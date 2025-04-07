import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Flex } from "@components/utility/Flex";
import { LinkProps } from "@utils/types";

interface CrumbSearchProps {
  name: string;
  items: LinkProps[];
  className?: string;
}

export const CrumbSearch = ({ name, items, className }: CrumbSearchProps) => {
  return (
    <div className={`container${className ? ` ${className}` : ""}`}>
      <Flex
        alignItems="center"
        columnBreak="none"
        justifyContent="space-between"
        className="crumbContainer"
      >
        {items && <Breadcrumbs pageTitle={name} crumbs={items} />}
      </Flex>
    </div>
  );
};
