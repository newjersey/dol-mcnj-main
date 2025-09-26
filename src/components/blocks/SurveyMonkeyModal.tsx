"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";

interface SurveyMonkeyModalProps {
  /** The SurveyMonkey survey URL to embed */
  surveyUrl: string;
  /** Modal title */
  title?: string;
  /** Unique key for localStorage tracking */
  storageKey?: string;
}

export const SurveyMonkeyModal = ({
  surveyUrl,
  title = "Survey",
  storageKey = "surveyMonkey_feedback_status",
}: SurveyMonkeyModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const router = useRouter();
  
  // Touch gesture state for swipe to close
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ y: number; time: number } | null>(null);

  // Check if user has already completed or dismissed the survey
  const getSurveyStatus = (): "completed" | "dismissed" | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(storageKey as string) as "completed" | "dismissed" | null;
  };

  // Set survey status in localStorage
  const setSurveyStatus = (status: "completed" | "dismissed") => {
    if (typeof window !== "undefined") {
      if (storageKey != null) {
        localStorage.setItem(storageKey, status);
      }
    }
  };

  const updateTabIndex = (enable: boolean) => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach((element) => {
        element.setAttribute("tabindex", enable ? "0" : "-1");
      });
    }
  };

  const closeModal = (markAsDismissed: boolean = true) => {
    setIsOpen(false);
    if (markAsDismissed && getSurveyStatus() === null) {
      setSurveyStatus("dismissed");
    }
  };

  const openModal = () => {
    setIsOpen(true);
    setHasInteracted(true);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    updateTabIndex(isOpen);
    return () => updateTabIndex(false);
  }, [isOpen]);

  // Handle navigation interception for exit-intent survey
  useEffect(() => {
    const surveyStatus = getSurveyStatus();
    
    // Don't show survey if already completed or dismissed
    if (surveyStatus !== null) {
      return;
    }

    // Track all clickable elements that could trigger navigation
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element or its parent is a navigation element
      const navElement = target.closest('a, button[type="submit"], [role="button"]');
      
      if (navElement && !hasInteracted && !isOpen) {
        const href = navElement.getAttribute('href');
        const onClick = navElement.getAttribute('onclick');
        
        // Check if this looks like navigation (has href, or onClick, or is a form submit)
        if (href || onClick || (navElement as HTMLButtonElement).type === 'submit') {
          // Prevent the navigation temporarily
          event.preventDefault();
          event.stopPropagation();
          
          // Store the navigation details so we can continue after survey interaction
          const navigationData = {
            element: navElement,
            href: href,
            originalEvent: event
          };
          
          // Show survey modal
          openModal();
          
          // Store navigation data for later use
          (window as any).__pendingNavigation = navigationData;
        }
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleClick, true); // Use capture phase
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [hasInteracted, isOpen]);

  // Handle continuing navigation after survey interaction
  useEffect(() => {
    if (!isOpen && (window as any).__pendingNavigation) {
      const { element, href } = (window as any).__pendingNavigation;
      
      // Clear the pending navigation
      delete (window as any).__pendingNavigation;
      
      // Continue with the navigation after a brief delay
      setTimeout(() => {
        if (href) {
          if (href.startsWith('http') || href.startsWith('//')) {
            // External link
            window.open(href, '_blank');
          } else if (href.startsWith('#')) {
            // Anchor link
            window.location.hash = href;
          } else {
            // Internal navigation
            router.push(href);
          }
        } else if (element.click) {
          // Re-trigger the click if it wasn't a simple href
          element.click();
        }
      }, 100);
    }
  }, [isOpen, router]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleOverlayClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("overlay")) {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      window.addEventListener("click", handleOverlayClick);
      
      return () => {
        window.removeEventListener("keydown", handleEsc);
        window.removeEventListener("click", handleOverlayClick);
      };
    }
  }, [isOpen]);

  // Reset iframe when modal opens to ensure fresh load
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      // Force iframe reload by setting src again
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 10);
    }
  }, [isOpen]);

  // Handle swipe gestures for mobile close functionality
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        y: e.touches[0].clientY,
        time: Date.now()
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStart.y;
      
      // Only prevent default if we're swiping down from the top of the modal
      if (deltaY > 0 && touchStart.y < 100) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;
      
      setTouchEnd({
        y: e.changedTouches[0].clientY,
        time: Date.now()
      });
      
      const deltaY = e.changedTouches[0].clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;
      
      // Detect swipe down gesture: minimum distance of 50px, maximum time of 300ms
      if (deltaY > 50 && deltaTime < 300 && touchStart.y < 100) {
        closeModal(true);
      }
      
      setTouchStart(null);
      setTouchEnd(null);
    };

    // Add touch event listeners to the modal
    if (modalRef.current) {
      const modal = modalRef.current;
      modal.addEventListener('touchstart', handleTouchStart, { passive: false });
      modal.addEventListener('touchmove', handleTouchMove, { passive: false });
      modal.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        modal.removeEventListener('touchstart', handleTouchStart);
        modal.removeEventListener('touchmove', handleTouchMove);
        modal.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, touchStart]);

  // Handle mobile back button for Android devices
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      closeModal(true);
      // Push a new state to prevent actual navigation
      window.history.pushState(null, '', window.location.href);
    };

    // Add a history entry when modal opens
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      className={`surveyMonkeyModal${isOpen ? " open" : ""}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="survey-modal-title"
    >
      <div className="overlay" />
      <div className="modal">
        <div className="modal-header">
          <h2 id="survey-modal-title" className="modal-title">
            {title}
          </h2>
          <button
            onClick={() => closeModal(true)}
            className="close"
            aria-label="Close survey modal (or swipe down on mobile)"
            type="button"
          >
            <X size={24} weight="bold" />
            <div className="sr-only">Close modal - you can also swipe down from the top on mobile devices</div>
          </button>
        </div>
        <div className="modal-content">
          {isOpen && (
            <iframe
              ref={iframeRef}
              src={surveyUrl}
              title="Survey"
              className="survey-iframe"
              allowFullScreen
              allow="camera; microphone; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          )}
        </div>
      </div>
    </div>
  );
};