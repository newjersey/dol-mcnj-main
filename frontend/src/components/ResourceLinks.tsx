/* eslint-disable react/jsx-no-target-blank */
import { LinkGroupProps } from "../types/contentful";

export const ResourceLinks = ({ heading, linksCollection }: LinkGroupProps) => {
  return (
    <div className="resource-links">
      <h4>{heading}</h4>
      <ul>
        {linksCollection?.items.map(({ copy, url, sys }) => {
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
