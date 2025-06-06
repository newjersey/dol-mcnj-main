import { Info, X } from "@phosphor-icons/react";
import { PathwayGroupProps } from "../types/contentful";
import { useEffect, useState } from "react";
import { slugify } from "../utils/slugify";

export const IndustryFieldDrawer = ({
  title,
  boxes,
}: {
  title: string;
  boxes?: PathwayGroupProps["learnMoreBoxes"];
}) => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const overlay = document.querySelector(`#overlay-${slugify(title)}`);
      if (overlay) {
        overlay.addEventListener("click", () => {
          setOpen(false);
        });
      }
      document.addEventListener("keydown", handleKeyDown);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className="industry-field-drawer">
      <button
        className="usa-button usa-button--unstyled"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Info size={22} />
        <span>Learn more</span>
      </button>
      <div className={`overlay${open ? " open" : ""}`} id={`overlay-${slugify(title)}`} />
      <div className={`panel${open ? " open" : ""}`}>
        <button className="close" onClick={() => setOpen(false)}>
          <X size={22} />
        </button>
        <div className="content">
          {boxes?.map((box, index) => (
            <div key={`mob${box.title || "box"}-${index}`}>
              {box.title && <p className="title">{box.title}</p>}
              {box.copy && <p>{box.copy}</p>}
              {box.tags && (
                <ul className="tags">
                  {box.tags?.map((tag, index) => <li key={"mob" + tag + index}>{tag}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
