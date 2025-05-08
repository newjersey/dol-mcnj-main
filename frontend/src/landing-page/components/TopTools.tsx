import { Card, CardProps } from "../../components/Card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TopTools = ({ heading, items }: { heading: string; items: CardProps[] }) => {
  return (
    <section className="topTools">
      <div className="container">
        <div className="heading-container">
          <h2 className="heading-tag">{heading}:</h2>
        </div>
        <div className="inner">
          {items.map((item) => (
            <Card key={item.heading} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};
