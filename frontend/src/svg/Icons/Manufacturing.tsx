export const Manufacturing = ({ color }: { color?: string }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3533_134110)">
        <path
          d="M10 22H13.5"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 22H22"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 17H21L13 11V17L5 11V27"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 27H30"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.1937 15.645L20.875 3.85875C20.909 3.61999 21.0283 3.40158 21.2106 3.24378C21.393 3.08597 21.6263 2.99939 21.8675 3H24.1325C24.3737 2.99939 24.6069 3.08597 24.7893 3.24378C24.9717 3.40158 25.0909 3.61999 25.125 3.85875L27 17V27"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3533_134110">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
