import { SvgProps } from "@utils/types";

export const Explore = ({ className, color, size }: SvgProps) => {
  return (
    <svg
      width={size || "50"}
      height={size || "50"}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M48 25C48 37.7025 37.7025 48 25 48C12.2975 48 2 37.7025 2 25C2 12.2975 12.2975 2 25 2C37.7025 2 48 12.2975 48 25Z"
        stroke={color || "#5240AA"}
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.0857 15.2778L33.9137 15.31L28.1747 17.5347L21.7262 15.2778L15.6647 17.3198C15.439 17.395 15.2778 17.5885 15.2778 17.8356V34.0856C15.2778 34.3866 15.5143 34.623 15.8152 34.623L15.9872 34.5908L21.7262 32.3661L28.1747 34.623L34.2362 32.581C34.4619 32.5058 34.6231 32.3123 34.6231 32.0651V15.8151C34.6231 15.5142 34.3866 15.2778 34.0857 15.2778ZM28.1747 32.4735L21.7262 30.2058V17.4272L28.1747 19.6949V32.4735Z"
        fill={color || "#5240AA"}
      />
    </svg>
  );
};