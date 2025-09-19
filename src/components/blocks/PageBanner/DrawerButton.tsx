"use client";
import { Heading } from "@components/modules/Heading";
import { Box } from "@components/utility/Box";
import { X } from "@phosphor-icons/react";
import { slugify } from "@utils/slugify";
import { HeadingLevel } from "@utils/types";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, []);

  useEffect(() => {
    if (open) {
      const handleClick = (event: MouseEvent) => {
        if (overlayRef.current && event.target === overlayRef.current) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.style.right = "0";
    } else if (panelRef.current) {
      panelRef.current.style.right = "-100%";
    }
  }, [open]);

  const drawerContent = (
    <div
      className="drawer"
      role="dialog"
      aria-modal="true"
      aria-label={slugify(copy)}
      aria-labelledby="drawer-heading"
    >
      <div ref={overlayRef} className={`overlay${open ? " open" : ""}`} />
      <div ref={panelRef} className={`panel${open ? " open" : ""}`}>
        <button className="close" onClick={() => setOpen(false)}>
          <div className="sr-only">Close</div>
          <X size={30} />
        </button>
        <div className="content mcnj-box mcnj-flex direction-column align-flex-start justify-flex-start gap-sm column-sm">
          <Heading level={drawerHeadingLevel}>{copy}</Heading>
          <p>{definition}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Box
        radius={5}
        className={`box drawerButton${className ? ` ${className}` : ""}`}
      >
        <button onClick={() => setOpen(!open)}>
          <span>{copy}</span>
        </button>
        <span className="value">{number}</span>
      </Box>
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
};
