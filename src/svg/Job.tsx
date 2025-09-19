export const Job = ({ color }: { color?: string }) => {
  return (
    <svg
      width="50"
      height="48"
      viewBox="0 0 50 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 10.0972H35V5.09717C35 2.32217 32.775 0.097168 30 0.097168H20C17.225 0.097168 15 2.32217 15 5.09717V10.0972H5C2.225 10.0972 0.025 12.3222 0.025 15.0972L0 42.5972C0 45.3722 2.225 47.5972 5 47.5972H45C47.775 47.5972 50 45.3722 50 42.5972V15.0972C50 12.3222 47.775 10.0972 45 10.0972ZM30 10.0972H20V5.09717H30V10.0972Z"
        fill={color || "#0066AA"}
      />
    </svg>
  );
};
