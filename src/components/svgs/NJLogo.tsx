const NJLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="31"
      height="32"
      viewBox="0 0 31 32"
      fill="none"
    >
      <rect width="30.1176" height="32" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0"
            transform="translate(0 -0.00282031) scale(0.0136986 0.0128928)"
          />
        </pattern>
        <image
          id="image0"
          width="73"
          height="78"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default NJLogo;
