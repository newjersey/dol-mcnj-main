import { IconSelector } from "@components/modules/IconSelector";
import { Flex } from "@components/utility/Flex";
import { useEffect, useState } from "react";
import { logEvent } from "@utils/analytics";
import { Button } from "@components/modules/Button";

interface SaveControlsProps {
  id: string;
  printHandler: () => void;
}

interface Copy {
  class: string;
  text: string;
}

export const SaveControls = (props: SaveControlsProps) => {
  const [copy, setCopy] = useState<Copy | null>(null);

  const copyHandler = (): void => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      setCopy({
        class: "red",
        text: "Unsuccessful, try again later",
      });
    }

    setCopy({
      class: "green",
      text: "Successfully copied",
    });

    setTimeout((): void => {
      setCopy(null);
    }, 5000);

    logEvent("Training page", "Clicked copy link", props.id);
  };

  return (
    <Flex
      elementTag="ul"
      columnBreak="md"
      justifyContent="flex-end"
      alignItems="center"
      gap="xs"
      className="save-controls unstyled desktop-only"
    >
      <li>
        <Button
          type="button"
          unstyled
          ariaLabel="Copy link"
          className={`link-format-blue${copy ? " green" : ""}`}
          onClick={copyHandler}
        >
          <Flex gap="xxs" direction="column" alignItems="center">
            <IconSelector name="LinkSimple" size={26} />
            <span className="label">{copy ? "Copied!" : "Copy link"}</span>
            <span className="sr-only">Copy button</span>
          </Flex>
        </Button>
      </li>
      <li>
        <Button
          type="button"
          unstyled
          ariaLabel="Print and Save"
          className="link-format-blue"
          onClick={props.printHandler}
        >
          <Flex gap="xxs" direction="column" alignItems="center">
            <IconSelector
              name="Printer"
              size={26}
              className={copy ? "green" : undefined}
            />
            <span className="label">Print and Save</span>
          </Flex>
        </Button>
      </li>
    </Flex>
  );
};
