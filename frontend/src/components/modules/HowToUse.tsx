import { Info, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Cta } from "./Cta";

export const HowToUse = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const overlay = document.querySelector("#overlay-how-to-use");
      if (overlay) {
        overlay.addEventListener("click", () => {
          setOpen(false);
        });
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <button
        aria-label="How to use Career Pathways"
        className={`how-to-button${show ? "" : " buttonHide"}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Info size={32} color="white" />
        <span>How to use Career Pathways</span>
      </button>
      <div className="how-to-panel" role="region">
        <div className={`overlay${open ? " open" : ""}`} id="overlay-how-to-use" />
        <div className={`panel${open ? " open" : ""}`}>
          <button
            aria-label="How to use Career Pathways panel close"
            className="close"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
          <div className="content">
            <div className="heading">How to use Career Pathways</div>
            <ol>
              <li>
                <strong>Choose an Industry</strong> to explore. More industries will be added
                regularly.
              </li>
              <li>
                <strong>Choose a field within that industry.</strong> You can learn about that field
                and explore the occupations with in it.
              </li>
              <li>
                <strong>Choose an occupation.</strong> You can use the dropdown or the interactive
                career pathways map.
              </li>
              <li>
                <strong>Learn about the occupation</strong> and what it takes to succeed. You can
                even explore related trainings to help you achieve your career goals.
              </li>
            </ol>
            <Cta
              heading="Still have a question?"
              theme="blue"
              linkDirection="row"
              noIndicator
              links={[
                {
                  copy: "Contact Us",
                  url: "/contact",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
