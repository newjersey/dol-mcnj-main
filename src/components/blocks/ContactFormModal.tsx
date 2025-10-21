import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { SupportedLanguages } from "@utils/types/types";
import { ContactForm } from "app/contact/ContactForm";
import { Alert } from "@components/modules/Alert";
import { CONTACT_FORM as contentData } from "@data/global/contactForm";

export const ContactFormModal = () => {
  const [lang, setLang] = useState<SupportedLanguages>("en");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [params, setParams] = useState<
    { path: string | null; title: string | null } | undefined
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
        const url = new URL(window.location.href);
        url.searchParams.delete("contactModal");
        url.searchParams.delete("path");
        url.searchParams.delete("title");
        window.history.replaceState({}, document.title, url.toString());
      }
    };

    window.addEventListener("keydown", handleEsc);

    const overlay = document.querySelector(".overlay-contact");
    overlay?.addEventListener("click", () => {
      setIsOpen(false);
      const url = new URL(window.location.href);
      url.searchParams.delete("contactModal");
      url.searchParams.delete("path");
      url.searchParams.delete("title");
      window.history.replaceState({}, document.title, url.toString());
    });
  }, []);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    setParams({
      path: urlParams.get("path"),
      title: urlParams.get("title"),
    });

    if (urlParams.get("contactModal") === "true") {
      setIsOpen(true);
    }
  }, []);

  return (
    <>
      <button
        id="contactModalButton"
        className="nav-item contact-us"
        onClick={() => {
          setIsOpen(!isOpen);

          // Update params when opening the modal to capture any new URL parameters
          if (!isOpen) {
            const urlParams = new URLSearchParams(window.location.search);
            setParams({
              path: urlParams.get("path"),
              title: urlParams.get("title"),
            });
          }
        }}
      >
        Contact Us
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
                const url = new URL(window.location.href);
                url.searchParams.delete("contactModal");
                url.searchParams.delete("path");
                url.searchParams.delete("title");
                window.history.replaceState({}, document.title, url.toString());
              }}
              className="close"
            >
              <XIcon size={20} weight="bold" />
              <div className="sr-only">Close</div>
            </button>
            <ContactForm
              lang={lang}
              content={
                params
                  ? {
                      path: params.path ?? undefined,
                      title: params.title ?? undefined,
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
