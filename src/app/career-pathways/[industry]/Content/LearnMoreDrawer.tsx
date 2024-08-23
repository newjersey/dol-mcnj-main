"use client";
import { Button } from "@components/modules/Button";
import { Drawer } from "@components/modules/Drawer";
import { Tag } from "@components/modules/Tag";
import { CareerMapProps } from "@utils/types";
import { useState } from "react";

export const LearnMoreDrawer = ({ map }: { map: CareerMapProps }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const evenNumberedBoxes = map.learnMoreBoxes?.filter(
    (_box, index) => index % 2 === 0,
  );
  const oddNumberedBoxes = map.learnMoreBoxes?.filter(
    (_box, index) => index % 2 !== 0,
  );
  return (
    <>
      <Button
        tag
        type="button"
        iconPrefix="Info"
        onClick={() => {
          setDrawerOpen(!drawerOpen);
        }}
      >
        <span>
          Learn more about <strong>{map.title}</strong>
        </span>
      </Button>
      <Drawer open={drawerOpen} setOpen={setDrawerOpen}>
        <div className="learn-more-content">
          <div className="mobile-only">
            {map.learnMoreBoxes?.map((box, index) => (
              <div className="box" key={`mob${box.title || "box"}-${index}`}>
                {box.title && <p className="title">{box.title}</p>}
                {box.copy && <p>{box.copy}</p>}
                {box.tags && (
                  <div className="tags">
                    {box.tags?.map((tag, index) => (
                      <Tag
                        key={"mob" + tag + index}
                        title={tag}
                        color="purple"
                      />
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
      </Drawer>
    </>
  );
};
