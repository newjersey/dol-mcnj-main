export const TrainingBold = ({ color, size }: { color?: string; size?: number }) => {
  return (
    <svg
      width={size || "32"}
      height={size || "32"}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 16.0977C30 23.8296 23.732 30.0977 16 30.0977C8.26801 30.0977 2 23.8296 2 16.0977C2 8.36567 8.26801 2.09766 16 2.09766C23.732 2.09766 30 8.36567 30 16.0977Z"
        stroke={color || "#198042"}
        stroke-width="4"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.1527 16.8771V19.6284L15.9675 22.256L20.7823 19.6284V16.8771L15.9675 19.5046L11.1527 16.8771ZM15.9675 9.875L8.40137 14.002L15.9675 18.129L22.158 14.7517V19.5046H23.5336V14.002L15.9675 9.875Z"
        fill={color || "#198042"}
      />
    </svg>
  );
};
