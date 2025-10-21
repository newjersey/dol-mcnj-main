import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { SupportedLanguages } from "@utils/types/types";
import { ContactForm } from "app/contact/ContactForm";
import { Alert } from "@components/modules/Alert";
import { CONTACT_FORM as contentData } from "@data/global/contactForm";

export const ContactFormModal = () => {
  const [lang, setLang] = useState<SupportedLanguages>("en");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contactContext, setContactContext] = useState<
    | { path: string; title: string; type: string; referringPage: string }
    | undefined
  >(undefined);

  const modalRef = useRef<HTMLDivElement | null>(null);

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

  const detectPageContext = (isIssueReport: boolean = false) => {
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;
    const isTrainingDetailPage = currentPath.match(/^\/training\/(.+)$/) && !currentPath.startsWith('/training/search');

    if (isTrainingDetailPage) {
      const trainingId = currentPath.match(/^\/training\/(.+)$/)![1];
      const titleElement = document.querySelector("h1.heading-tag");
      const trainingName = titleElement
        ? titleElement.textContent?.replace(" | My Career NJ", "").trim() ||
          "Unknown Training Program"
        : "Unknown Training Program";

      return {
        path: `/training/${trainingId}`,
        title: trainingName,
        type: isIssueReport ? "issue" : "contact",
        referringPage: currentUrl,
      };
    }

    return {
      path: "",
      title: "",
      type: "contact",
      referringPage: currentUrl,
    };
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
        setIsOpen(false);
        setContactContext(undefined);
      }
    };

    window.addEventListener("keydown", handleEsc);

    const overlay = document.querySelector(".overlay-contact");
    overlay?.addEventListener("click", () => {
      setIsOpen(false);
      setContactContext(undefined);
    });
  }, []);

  return (
    <>
      <button
        id="contactModalButton"
        className="nav-item contact-us"
        onClick={() => {
          if (!isOpen) {
            const context = detectPageContext(false);
            setContactContext(context);
          }
          setIsOpen(!isOpen);
        }}
      >
        Contact Us
      </button>

      <button
        id="contactModalIssueButton"
        style={{ display: "none" }}
        onClick={() => {
          if (!isOpen) {
            const context = detectPageContext(true);
            setContactContext(context);
          }
          setIsOpen(true);
        }}
        aria-hidden="true"
      >
        Issue Report
      </button>

      <div
        ref={modalRef}
        className={`contactModal${isOpen ? " open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="overlay-contact" />
        <div className="modal">
          <Alert type="global" className="langAlert">
            <>
              {contentData[lang].languageMessage[0]}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setLang(lang === "en" ? "es" : "en");
                }}
              >
                <>{contentData[lang].languageMessage[1]}</>
              </a>
            </>
          </Alert>
          <div className="inner">
            <button
              onClick={() => {
                setIsOpen(false);
                setContactContext(undefined);
              }}
              className="close"
            >
              <XIcon size={20} weight="bold" />
              <div className="sr-only">Close</div>
            </button>
            <ContactForm
              lang={lang}
              content={
                contactContext
                  ? {
                      path: contactContext.path,
                      title: contactContext.title,
                      type: contactContext.type,
                      referringPage: contactContext.referringPage,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
