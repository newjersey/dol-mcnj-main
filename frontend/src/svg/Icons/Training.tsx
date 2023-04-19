export const Training = ({ color }: { color?: string }) => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M48 25C48 37.7025 37.7025 48 25 48C12.2975 48 2 37.7025 2 25C2 12.2975 12.2975 2 25 2C37.7025 2 48 12.2975 48 25Z"
        stroke={color || "#198042"}
        strokeWidth="4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4274 26.2186V30.5176L24.9505 34.6231L32.4737 30.5176V26.2186L24.9505 30.3241L17.4274 26.2186ZM24.9505 15.2778L13.1284 21.7262L24.9505 28.1747L34.6231 22.8977V30.3241H36.7726V21.7262L24.9505 15.2778Z"
        fill={color || "#198042"}
      />
    </svg>
  );
};
