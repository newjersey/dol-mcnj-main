import { SvgProps } from "@utils/types";

export const ExploreBold = ({ className, color, size }: SvgProps) => {
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
        stroke={color || "#5240AA"}
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.8144 9.875L21.7043 9.89563L18.0313 11.3194L13.9043 9.875L10.025 11.1819C9.88052 11.23 9.77734 11.3538 9.77734 11.512V21.912C9.77734 22.1046 9.92867 22.256 10.1213 22.256L10.2313 22.2353L13.9043 20.8115L18.0313 22.256L21.9107 20.9491C22.0551 20.9009 22.1583 20.7771 22.1583 20.6189V10.2189C22.1583 10.0263 22.007 9.875 21.8144 9.875ZM18.0313 20.8803L13.9043 19.429V11.2507L18.0313 12.702V20.8803Z"
        fill={color || "#5240AA"}
      />
    </svg>
  );
};