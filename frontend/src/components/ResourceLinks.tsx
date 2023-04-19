/* eslint-disable react/jsx-no-target-blank */

import { LinkObjectProps } from "../types/contentful";

export const ResourceLinks = ({
  heading,
  links,
}: {
  heading?: string;
  links?: {
    items: LinkObjectProps[];
  };
}) => {
  return (
    <div className="resource-links">
      <p className="heading">{heading}</p>
      <ul>
        {links?.items.map(({ copy, url, sys }) => {
          const newTab = url.startsWith("http");
          return (
            <li key={sys?.id}>
              <a
                href={url}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
              >
                {copy}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
