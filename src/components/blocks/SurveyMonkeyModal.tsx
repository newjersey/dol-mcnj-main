"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "@components/modules/Button";

interface SurveyMonkeyModalProps {
  /** The SurveyMonkey survey URL to embed */
  surveyUrl: string;
  /** Text for the trigger button */
  buttonText?: string;
  /** Icon for the trigger button */
  buttonIcon?: string;
  /** Modal title */
  title?: string;
  /** Additional CSS class for the trigger button */
  buttonClassName?: string;
  /** Whether to show the modal immediately on mount */
  autoOpen?: boolean;
}

export const SurveyMonkeyModal = ({
  surveyUrl,
  buttonText = "Take Survey",
  buttonIcon = "ClipboardText",
  title = "Survey",
  buttonClassName = "",
  autoOpen = false,
}: SurveyMonkeyModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(autoOpen);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
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

  return (
    <>
      {!autoOpen && (
        <Button
          type="button"
          defaultStyle="primary"
          className={`survey-trigger ${buttonClassName}`}
          iconPrefix={buttonIcon as any}
          iconWeight="bold"
          onClick={openModal}
        >
          {buttonText}
        </Button>
      )}

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
              onClick={closeModal}
              className="close"
              aria-label="Close survey modal"
              type="button"
            >
              <X size={24} weight="bold" />
              <div className="sr-only">Close</div>
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
    </>
  );
};