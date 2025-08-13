import { Card, CardProps } from "../../components/Card";

export const Resources = ({
  heading,
  subheading,
  items,
}: {
  heading?: string;
  subheading?: string;
  items: CardProps[];
}) => {
  return (
    <div className="resources">
      <div className="container">
        <div className="heading-container">
          {heading && <h3 className="heading-tag">{heading}</h3>}
          {subheading && <p className="subheading">{subheading}</p>}
        </div>
        <div className="inner">
          {items.map((item) => (
            <Card key={item.heading} {...item} outline />
          ))}
        </div>
      </div>
    </div>
  );
};
