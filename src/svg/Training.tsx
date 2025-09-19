export const Training = ({ color }: { color?: string }) => {
  return (
    <svg
      width="56"
      height="46"
      viewBox="0 0 56 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 26.0472V36.0472L28 45.5972L45.5 36.0472V26.0472L28 35.5972L10.5 26.0472ZM28 0.597168L0.5 15.5972L28 30.5972L50.5 18.3222V35.5972H55.5V15.5972L28 0.597168Z"
        fill={color || "#198042"}
      />
    </svg>
  );
};
