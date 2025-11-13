"use client";
import { IndustryItemProps } from "@utils/types/components";
import { Tag } from "./Tag";
import Image from "next/image";
import { Flex } from "@components/utility/Flex";
import { Button } from "./Button";
import { ArrowRightIcon, InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { Drawer } from "./Drawer";
import { useEffect, useState } from "react";
import { Heading } from "./Heading";
import { LabelBox } from "./LabelBox";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { createPortal } from "react-dom";

export const IndustryItem = ({
  image,
  slug,
  title,
  description,
  drawerCards,
  active,
  drawerDescription,
}: IndustryItemProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawerContent = (
    <Drawer
      open={drawerOpen}
      setOpen={setDrawerOpen}
      className="industryDrawer"
    >
      <Flex direction="column" gap="sm">
        <Heading level={3}>{title} in New Jersey</Heading>
        <p>{drawerDescription}</p>
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          blurDataURL={image.blurDataURL}
          placeholder="blur"
          alt=""
        />
        {drawerCards.map((card) => (
          <LabelBox
            className="bg-secondaryExtraLight"
            color="green"
            key={card.title}
            title={card.title}
            icon={card.icon}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(card.copy),
              }}
            />
          </LabelBox>
        ))}
      </Flex>
    </Drawer>
  );

  return (
    <div className="industryItem">
      <Flex className="inner" direction="column" justifyContent="space-between">
        <Flex
          direction="column"
          justifyContent="center"
          gap="xs"
          alignItems="flex-start"
        >
          <h4 className="title">{title}</h4>
          <Tag
            color={active ? "purple" : "navy"}
            title={`Pathways ${active ? "included" : "coming soon"}`}
          />
          <div className="image">
            <Image
              src={image.src}
              blurDataURL={image.blurDataURL}
              placeholder="blur"
              alt=""
              fill
            />
          </div>
          {description && <p>{description}</p>}
        </Flex>
        <div className="buttons">
          <Button type="link" link={`/career-pathways/${slug}`}>
            Explore <ArrowRightIcon size={20} />
          </Button>
          <Button
            unstyled
            type="button"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <InfoIcon size={20} weight="bold" /> Learn More
          </Button>
        </div>
      </Flex>
      {mounted && createPortal(drawerContent, document.body)}
    </div>
  );
};
