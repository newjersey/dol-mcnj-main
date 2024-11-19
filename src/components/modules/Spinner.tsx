import { SpinnerGap } from "@phosphor-icons/react";

interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const Spinner = ({ className, style, size = 50, color }: SpinnerProps) => {
  return (
    <span
      style={style}
      className={`spinner${className ? ` ${className}` : ""}`}
    >
      <SpinnerGap size={size} color={color} />
    </span>
  );
};

export { Spinner };
