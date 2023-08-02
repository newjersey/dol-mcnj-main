"use client";
import { ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface BackToTopProps {
  className?: string;
}

const BackToTop = ({ className }: BackToTopProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
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
    <button
      className={`backToTop${className ? ` ${className}` : ""}${show ? "" : " buttonHide"}`}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      <span className="sr-only">Back to Top</span>
      <ArrowUp size={22} />
    </button>
  );
};

export { BackToTop };
