"use client";
import { Button } from "@components/modules/Button";
import { Drawer } from "@components/modules/Drawer";
import { CareerMapItemProps } from "@utils/types/components";
import { useState } from "react";
import { createPortal } from "react-dom";

export const LearnMoreDrawer = ({ map }: { map: CareerMapItemProps }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerContent = (
    <Drawer open={drawerOpen} setOpen={setDrawerOpen}>
      <div className="learn-more-conten flex-col flex gap-4">
        {map.learnMoreBoxes?.map((box, index) => (
          <div
            key={`mob${box.title || "box"}-${index}`}
            className="flex flex-col gap-2"
          >
            {box.title && <p className="font-bold text-[18px]">{box.title}</p>}
            {box.copy && <p>{box.copy}</p>}
            {box.tags && (
              <ul className="list-disc ml-10">
                {box.tags?.map((tag, index) => (
                  <li key={"mob" + tag + index}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );

  return (
    <>
      <Button
        unstyled
        className="learn-more-button"
        type="button"
        iconPrefix="Info"
        onClick={() => {
          setDrawerOpen(!drawerOpen);
        }}
      >
        <span className="copy">Learn more</span>
      </Button>
      {createPortal(drawerContent, document.body)}
    </>
  );
};
