import { X } from "@phosphor-icons/react";
import { ReactNode, useEffect } from "react";

export const Drawer = ({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
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
  }, [open]);

  return (
    <div className="drawer">
      <div className={`overlay${open ? " open" : ""}`} />
      <div className={`panel${open ? " open" : ""}`}>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className="close"
        >
          <div className="sr-only">Close</div>
          <X size={30} />
        </button>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
