export const Healthcare = ({ color }: { color?: string }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3533_134122)">
        <path
          d="M25 20.5C25.8284 20.5 26.5 19.8284 26.5 19C26.5 18.1716 25.8284 17.5 25 17.5C24.1716 17.5 23.5 18.1716 23.5 19C23.5 19.8284 24.1716 20.5 25 20.5Z"
          fill={color || "#222222"}
        />
        <path
          d="M25 23C27.2091 23 29 21.2091 29 19C29 16.7909 27.2091 15 25 15C22.7909 15 21 16.7909 21 19C21 21.2091 22.7909 23 25 23Z"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17V23C12 24.3261 12.5268 25.5979 13.4645 26.5355C14.4021 27.4732 15.6739 28 17 28H20C21.3261 28 22.5979 27.4732 23.5355 26.5355C24.4732 25.5979 25 24.3261 25 23"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 4H18C18.2652 4 18.5196 4.10536 18.7071 4.29289C18.8946 4.48043 19 4.73478 19 5V9.89625C19 13.7425 15.94 16.95 12.0925 17C11.1655 17.0123 10.2453 16.8402 9.3853 16.4939C8.52532 16.1476 7.74269 15.634 7.08285 14.9827C6.42301 14.3315 5.8991 13.5557 5.54155 12.7003C5.184 11.845 4.99992 10.9271 5 10V5C5 4.73478 5.10536 4.48043 5.29289 4.29289C5.48043 4.10536 5.73478 4 6 4H8"
          stroke={color || "#222222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3533_134122">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
