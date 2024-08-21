import { SpinnerGap } from "@phosphor-icons/react";

interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

const Spinner = ({ className, size = 50, color }: SpinnerProps) => {
  return (
    <div className={`spinner${className ? ` ${className}` : ""}`}>
      <SpinnerGap size={size} color={color} />
    </div>
  );
};

export { Spinner };
