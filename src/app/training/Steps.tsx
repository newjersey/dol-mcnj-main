import { Markdown } from "@components/modules/Markdown";
import { Flex } from "@components/utility/Flex";
import { ThemeColors } from "@utils/types";

export const Steps = ({
  className,
  theme = "blue",
  items,
}: {
  className?: string;
  theme?: ThemeColors;
  items: string[];
}) => {
  return (
    <div
      className={`steps${className ? ` ${className}` : ""}${
        theme ? ` theme-${theme}` : ""
      }`}
    >
      <div>
        <div className="inner">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            columnBreak="lg"
            elementTag="ul"
            gap="sm"
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
                  <div className="list-num">
                    <span>{index + 1}</span>
                  </div>
                </div>
                <div className="list-info">
                  <Markdown content={item} />
                </div>
              </Flex>
            ))}
          </Flex>
        </div>
      </div>
    </div>
  );
};
