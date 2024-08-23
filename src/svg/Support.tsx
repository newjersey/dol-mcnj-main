export const Support = ({ color }: { color?: string }) => {
  return (
    <svg
      width="50"
      height="46"
      viewBox="0 0 50 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25 45.9722L21.375 42.6722C8.5 30.9972 0 23.2972 0 13.8472C0 6.14717 6.05 0.097168 13.75 0.097168C18.1 0.097168 22.275 2.12217 25 5.32217C27.725 2.12217 31.9 0.097168 36.25 0.097168C43.95 0.097168 50 6.14717 50 13.8472C50 23.2972 41.5 30.9972 28.625 42.6972L25 45.9722Z"
        fill={color || "#2E6276"}
      />
    </svg>
  );
};
