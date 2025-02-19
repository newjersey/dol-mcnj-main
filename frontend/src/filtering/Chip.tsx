import { X } from "@phosphor-icons/react";
import { handleChipClick } from "../search-results/searchFunctions";

export const Chip = ({
  id,
  title,
  label,
  value,
}: {
  id: string;
  title: string;
  label: string;
  value: string;
}) => {
  return (
    <button
      className="tag-item color-blue"
      onClick={() => {
        handleChipClick(id, typeof value === "boolean" && value === true ? "true" : value);
      }}
    >
      {typeof value === "string" ? (
        <>
          {title}:<strong>{label}</strong>
        </>
      ) : (
        <strong>{title}</strong>
      )}
      <X />
    </button>
  );
};
