"use client";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useState } from "react";

export const ShowMore = ({
  children,
  hidden,
}: {
  children: React.ReactNode;
  hidden: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="showMore">
      {children}
      <button onClick={() => setShow(!show)}>
        {show ? (
          <>
            Show less
            <CaretUp />
          </>
        ) : (
          <>
            Show more
            <CaretDown />
          </>
        )}
      </button>
      {show && hidden}
    </div>
  );
};
