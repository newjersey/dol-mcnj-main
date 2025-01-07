"use client";
import { Heading } from "@components/modules/Heading";
import { Box } from "@components/utility/Box";
import { X } from "@phosphor-icons/react";
import { HeadingLevel } from "@utils/types";
import { useEffect, useState, useRef } from "react";

export const DrawerButton = ({
  copy,
  number,
  className,
  drawerHeadingLevel = 3,
  definition,
}: {
  copy: string;
  className?: string;
  number: string | number;
  drawerHeadingLevel?: HeadingLevel;
  definition: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", escFunction);
  }, []);

  useEffect(() => {
    if (open) {
      const handleClick = (event: MouseEvent) => {
        if (ref.current === event.target) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
    }
  }, [open]);
  return (
    <>
      <Box
        radius={5}
        className={`box drawerButton${className ? ` ${className}` : ""}`}
      >
        <button
          onClick={() => {
            setOpen(!open);
          }}
        >
          <span>{copy}</span>
        </button>
        <span className="value">{number}</span>
      </Box>
      <div className="drawer">
        <div ref={ref} className={`overlay${open ? " open" : ""}`} />
        <div className={`panel${open ? " open" : ""}`}>
          <button
            className="close"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <div className="sr-only">Close</div>
            <X size={30} />
          </button>
          <div className="content">
            <Heading level={drawerHeadingLevel}>{copy}</Heading>
            <p>{definition}</p>
          </div>
        </div>
      </div>
    </>
  );
};
