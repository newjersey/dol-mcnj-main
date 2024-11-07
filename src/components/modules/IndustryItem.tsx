"use client";
import { IndustryItemProps } from "@utils/types/components";
import { Tag } from "./Tag";
import Image from "next/image";
import { Flex } from "@components/utility/Flex";
import { Button } from "./Button";
import { ArrowRight, Info } from "@phosphor-icons/react/dist/ssr";
import { Drawer } from "./Drawer";
import { useState } from "react";
import { Heading } from "./Heading";
import { LabelBox } from "./LabelBox";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export const IndustryItem = ({
  image,
  slug,
  title,
  description,
  drawerCards,
  active,
  drawerDescription,
  shorthandTitle,
}: IndustryItemProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="industryItem">
      <Flex className="inner" direction="column" justifyContent="space-between">
        <Flex
          direction="column"
          justifyContent="center"
          gap="xs"
          alignItems="flex-start"
        >
          <p className="title">{title}</p>
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
            Explore <ArrowRight size={20} />
          </Button>
          <Button
            unstyled
            type="button"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <Info size={20} weight="bold" /> Learn More
          </Button>
        </div>
      </Flex>
      <Drawer open={drawerOpen} setOpen={setDrawerOpen}>
        <Flex direction="column" gap="sm">
          <Heading level={3}>
            {shorthandTitle ? shorthandTitle : title} in New Jersey
          </Heading>
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
              color="green"
              large
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
    </div>
  );
};
