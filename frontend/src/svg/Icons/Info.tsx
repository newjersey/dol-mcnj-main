export const Info = ({ color }: { color?: string }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <g>
        <path
          d="M16 28.0972C22.6274 28.0972 28 22.7246 28 16.0972C28 9.46975 22.6274 4.09717 16 4.09717C9.37258 4.09717 4 9.46975 4 16.0972C4 22.7246 9.37258 28.0972 16 28.0972Z"
          stroke={color || "black"}
          strokeWidth="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15 15.0972C15.2652 15.0972 15.5196 15.2025 15.7071 15.3901C15.8946 15.5776 16 15.832 16 16.0972V21.0972C16 21.3624 16.1054 21.6167 16.2929 21.8043C16.4804 21.9918 16.7348 22.0972 17 22.0972"
          stroke={color || "black"}
          strokeWidth="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.5 12.0972C16.3284 12.0972 17 11.4256 17 10.5972C17 9.76874 16.3284 9.09717 15.5 9.09717C14.6716 9.09717 14 9.76874 14 10.5972C14 11.4256 14.6716 12.0972 15.5 12.0972Z"
          fill={color || "black"}
        />
      </g>
    </svg>
  );
};
