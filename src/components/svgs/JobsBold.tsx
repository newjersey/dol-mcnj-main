import { SvgProps } from "@utils/types";

export const JobsBold = ({ className, color, size }: SvgProps) => {
  return (
    <svg
      width={size || "32"}
      height={size || "32"}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M30 16.0977C30 23.8296 23.732 30.0977 16 30.0977C8.26801 30.0977 2 23.8296 2 16.0977C2 8.36567 8.26801 2.09766 16 2.09766C23.732 2.09766 30 8.36567 30 16.0977Z"
        stroke={color || "#0066AA"}
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.4708 11.9388H18.7195V10.5632C18.7195 9.79967 18.1073 9.1875 17.3438 9.1875H14.5925C13.829 9.1875 13.2168 9.79967 13.2168 10.5632V11.9388H10.4655C9.70201 11.9388 9.09672 12.551 9.09672 13.3145L9.08984 20.8806C9.08984 21.6441 9.70201 22.2563 10.4655 22.2563H21.4708C22.2343 22.2563 22.8465 21.6441 22.8465 20.8806V13.3145C22.8465 12.551 22.2343 11.9388 21.4708 11.9388ZM17.3438 11.9388H14.5925V10.5632H17.3438V11.9388Z"
        fill={color || "#0066AA"}
      />
    </svg>
  );
};