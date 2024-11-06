import { Button } from "@components/modules/Button";
import { LinkObject } from "@components/modules/LinkObject";
import { Box } from "@components/utility/Box";
import { LinkProps } from "@utils/types";
import { DrawerButton } from "./DrawerButton";

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
    <div className={`infoBlocks${className ? ` ${className}` : ""}`}>
      <div className="items">
        {titleBlock && (
          <Box radius={5} className="box">
            <p className="title">{titleBlock.copy}</p>
            <p>
              {titleBlock.message}
              {titleBlock.link?.url && (
                <LinkObject noIndicator url={titleBlock.link.url}>
                  {titleBlock.link.copy}
                </LinkObject>
              )}
            </p>
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
            className=""
            copy={rateBlock.copy}
            number={rateBlock.number}
            definition={rateBlock.definition}
          />
        )}
      </div>

      {ctaLink && (
        <Button type="link" unstyled link={ctaLink.url} iconSuffix="CaretRight">
          {ctaLink.copy}
        </Button>
      )}
    </div>
  );
};

export { InfoBlocks };
