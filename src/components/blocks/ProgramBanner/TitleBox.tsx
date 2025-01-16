import { Heading } from "@components/modules/Heading";
import { SaveControls } from "./SaveControls";
import { Flex } from "@components/utility/Flex";

interface TitleBoxProps {
  id: string;
  name: string;
  provider: string;
  printHandler: () => void;
}

export const TitleBox = (props: TitleBoxProps) => {
  return (
    <div className="titleBox">
      <Flex
        columnBreak="none"
        alignItems="center"
        className="container"
        justifyContent="space-between"
      >
        <div>
          <Heading level={1}>{props.name}</Heading>
          <p className="subHeading">{props.provider}</p>
        </div>
        <SaveControls id={props.id} printHandler={props.printHandler} />
      </Flex>
    </div>
  );
};
