import { Markdown } from "@components/modules/Markdown";
import { Flex } from "@components/utility/Flex";

export const Steps = ({
  className,
  items,
}: {
  className?: string;
  items: string[];
}) => {
  return (
    <div className={`steps${className ? ` ${className}` : ""}`}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        columnBreak="lg"
        elementTag="ul"
        gap="micro"
        className="container unstyled"
      >
        {items.map((item, index) => (
          <Flex
            columnBreak="none"
            alignItems="center"
            gap="xs"
            elementTag="li"
            key={item}
          >
            <div className="list-num-container">
              <div className="list-num">{index + 1}</div>
            </div>
            <div className="list-info">
              <Markdown content={item} />
            </div>
          </Flex>
        ))}
      </Flex>
    </div>
  );
};
