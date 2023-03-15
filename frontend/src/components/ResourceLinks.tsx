/* eslint-disable react/jsx-no-target-blank */
interface ResourceLinksProps {
  heading: string;
  links: {
    copy: string;
    href: string;
  }[];
}
export const ResourceLinks = ({ heading, links }: ResourceLinksProps) => {
  return (
    <div className="resource-links">
      <h4>{heading}</h4>
      <ul>
        {links.map(({ copy, href }, index) => {
          const newTab = href.startsWith("http");
          return (
            <li key={copy + index}>
              <a
                href={href}
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
