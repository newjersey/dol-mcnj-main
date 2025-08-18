import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { SupportedLanguages } from "@utils/types/types";
import { ContactForm } from "app/contact/ContactForm";

export const ContactFormModal = ({ lang }: { lang: SupportedLanguages }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      }
    };

    window.addEventListener("keydown", handleEsc);

    const overlay = document.querySelector(".overlay");
    overlay?.addEventListener("click", () => {
      setIsOpen(false);
    });
  }, []);

  return (
    <>
      <button
        className="nav-item contact-us"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Contact Us
      </button>

      <div
        ref={modalRef}
        className={`signUpModal${isOpen ? " open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="overlay" />
        <div className="modal">
          <button onClick={() => setIsOpen(false)} className="close">
            <XIcon size={20} weight="bold" />
            <div className="sr-only">Close</div>
          </button>
          <ContactForm lang={lang} />
        </div>
      </div>
    </>
  );
};
