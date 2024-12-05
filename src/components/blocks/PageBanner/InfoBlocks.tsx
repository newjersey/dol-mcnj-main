import { Button } from "@components/modules/Button";
import { LinkObject } from "@components/modules/LinkObject";
import { Box } from "@components/utility/Box";
import { LinkProps } from "@utils/types";
import { DrawerButton } from "./DrawerButton";
import { Flex } from "@components/utility/Flex";
import { Fire } from "@phosphor-icons/react";

interface InfoBlocksProps {
  className?: string;
  ctaLink?: LinkProps;
  costBlock?: {
    copy: string;
    number: string | number;
    definition: string;
  };
  rateBlock?: {
    copy: string;
    number: string | number;
    definition: string;
  };
  titleBlock?: {
    copy: string;
    link?: LinkProps;
    message?: string;
  };
}

const InfoBlocks = ({
  className,
  ctaLink,
  costBlock,
  rateBlock,
  titleBlock,
}: InfoBlocksProps) => {
  return (
    <Flex
      alignItems="stretch"
      gap="xs"
      columnBreak="md"
      className={`infoBlocks${className ? ` ${className}` : ""}`}
    >
      {titleBlock && (
        <Box radius={5} className="box title">
          <p>
            {titleBlock.message}&nbsp;
            {titleBlock.link?.url && (
              <LinkObject noIndicator url={titleBlock.link.url}>
                {titleBlock.link.copy}
              </LinkObject>
            )}
          </p>
          <Flex
            elementTag="p"
            alignItems="center"
            gap="xxs"
            className="value"
            columnBreak="none"
          >
            <Fire size={24} weight="bold" />
            {titleBlock.copy}
          </Flex>
        </Box>
      )}
      {costBlock && (
        <DrawerButton
          className="cost"
          copy={costBlock.copy}
          number={costBlock.number}
          definition={costBlock.definition}
        />
      )}
      {rateBlock && (
        <DrawerButton
          className="rate"
          copy={rateBlock.copy}
          number={rateBlock.number}
          definition={rateBlock.definition}
        />
      )}

      {ctaLink && (
        <Button type="link" unstyled link={ctaLink.url} iconSuffix="CaretRight">
          {ctaLink.copy}
        </Button>
      )}
    </Flex>
  );
};

export { InfoBlocks };
