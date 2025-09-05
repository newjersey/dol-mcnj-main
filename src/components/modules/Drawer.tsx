import { X } from "@phosphor-icons/react";
import { slugify } from "@utils/slugify";
import { ReactNode, useEffect } from "react";

export const Drawer = ({
  children,
  className,
  title,
  open,
  setOpen,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  useEffect(() => {
    document.addEventListener("click", (e) => {
      const clickedElement = e.target as HTMLElement;

      if (clickedElement.classList.contains("overlay")) {
        setOpen(false);
      }
    });

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // put focus on the drawer when it opens
    if (open) {
      const panel = document.querySelector(".panel.open");
      (panel as HTMLElement)?.focus();
    }
  }, [open]);

  return (
    <div
      className="drawer"
      role="dialog"
      aria-modal="true"
      aria-label={title ? slugify(title) : "drawer"}
      aria-labelledby="drawer-heading"
    >
      <div className={`overlay${open ? " open" : ""}`} />
      <div
        className={`panel${open ? " open" : ""}${
          className ? ` ${className}` : ""
        }`}
        tabIndex={-1}
      >
        <button
          onClick={() => {
            setOpen(false);
          }}
          className="close"
        >
          <div className="sr-only">Close</div>
          <X size={30} />
        </button>
        <div className="content mcnj-box mcnj-flex direction-column align-flex-start justify-flex-start gap-sm column-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
