import { SvgProps } from "@utils/types";

export const Jobs = ({ className, color, size }: SvgProps) => {
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
        stroke={color || "#0066AA"}
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.5484 18.5018H29.2494V16.3524C29.2494 15.1594 28.2929 14.2029 27.0999 14.2029H22.801C21.6081 14.2029 20.6515 15.1594 20.6515 16.3524V18.5018H16.3526C15.1596 18.5018 14.2139 19.4583 14.2139 20.6513L14.2031 32.4734C14.2031 33.6663 15.1596 34.6229 16.3526 34.6229H33.5484C34.7413 34.6229 35.6978 33.6663 35.6978 32.4734V20.6513C35.6978 19.4583 34.7413 18.5018 33.5484 18.5018ZM27.0999 18.5018H22.801V16.3524H27.0999V18.5018Z"
        fill={color || "#0066AA"}
      />
    </svg>
  );
};