import { Info, X } from "@phosphor-icons/react";
import { PathwayGroupProps } from "../types/contentful";
import { useEffect, useState } from "react";
import { slugify } from "../utils/slugify";
import { Tag } from "./modules/Tag";

export const IndustryFieldDrawer = ({
  title,
  boxes,
}: {
  title: string;
  boxes?: PathwayGroupProps["learnMoreBoxes"];
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const overlay = document.querySelector(`#overlay-${slugify(title)}`);
      if (overlay) {
        overlay.addEventListener("click", (e) => {
          setOpen(false);
        });
      }
    }
  }, []);

  const evenNumberedBoxes = boxes?.filter((_box, index) => index % 2 === 0);
  const oddNumberedBoxes = boxes?.filter((_box, index) => index % 2 !== 0);

  return (
    <div className="industry-field-drawer">
      <button
        className="explore-button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Info size={22} />
        <span>
          Learn more about <strong>{title}</strong>
        </span>
      </button>
      <div className={`overlay${open ? " open" : ""}`} id={`overlay-${slugify(title)}`} />
      <div className={`panel${open ? " open" : ""}`}>
        <button className="close" onClick={() => setOpen(false)}>
          <X size={22} />
        </button>
        <div className="content">
          <div className="mobile-only">
            {boxes?.map((box, index) => (
              <div className="box" key={`mob${box.title || "box"}-${index}`}>
                {box.title && <p className="title">{box.title}</p>}
                {box.copy && <p>{box.copy}</p>}
                {box.tags && (
                  <div className="tags">
                    {box.tags?.map((tag, index) => (
                      <Tag key={"mob" + tag + index} title={tag} color="purple" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="column desktop-only">
            {evenNumberedBoxes?.map((box, index) => (
              <div className="box" key={`c1${box.title || "box"}-${index}`}>
                {box.title && <p className="title">{box.title}</p>}
                {box.copy && <p>{box.copy}</p>}
                {box.tags && (
                  <div className="tags">
                    {box.tags?.map((tag, index) => (
                      <Tag key={tag + index} title={tag} color="purple" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="column desktop-only">
            {oddNumberedBoxes?.map((box, index) => (
              <div className="box" key={`c2${box.title || "box"}-${index}`}>
                {box.title && <p className="title">{box.title}</p>}
                {box.copy && <p>{box.copy}</p>}
                {box.tags && (
                  <div className="tags">
                    {box.tags?.map((tag, index) => (
                      <Tag key={tag + index} title={tag} color="purple" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
