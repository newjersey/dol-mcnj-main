interface DividerProps {
  className?: string;
  line?: boolean;
  testId?: string;
  size?: "sm" | "md" | "lg";
}

const Divider = ({ size = "sm", line, className, testId }: DividerProps) => {
  return (
    <div
      data-testid={testId}
      role="separator"
      className={`divider size-${size}${className ? ` ${className}` : ""}`}
    >
      {line && <hr className="line" />}
    </div>
  );
};

export { Divider };
