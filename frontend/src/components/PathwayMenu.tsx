import { Info, MapTrifold } from "@phosphor-icons/react";
import { PATH_MENU_QUERY } from "../queries/pathMenu";
import { useContentfulClient } from "../utils/useContentfulClient";
import { CareerMapNodeProps } from "../types/contentful";

const Menu = (props: {
  sys: {
    id: string;
  };
  title: string;
}) => {
  const data: {
    careerMap: {
      title: string;
      careerPathwayItemsCollection: {
        items: CareerMapNodeProps[];
      };
    };
  } = useContentfulClient({
    query: PATH_MENU_QUERY,
    variables: { id: props.sys.id },
  });
  return (
    <div className="path-menu">
      <div className="buttons">
        <button className="usa-button usa-button--base">
          <div className="sr-only">info view</div>
          <Info size={24} />
        </button>
        <button className="usa-button">
          <div className="sr-only">map view</div>
          <MapTrifold size={24} />
        </button>
      </div>
      <h4>{props.title}</h4>
      <ul className="unstyled">
        {data &&
          data.careerMap.careerPathwayItemsCollection.items.map((mapItem) => (
            <li key={mapItem.sys.id}>
              <input
                type="radio"
                className="usa-radio__input"
                id={mapItem.sys.id}
                name={props.sys.id}
              />
              <label className="usa-radio__label" htmlFor={mapItem.sys.id}>
                {mapItem.title}
              </label>
            </li>
          ))}
      </ul>
    </div>
  );
};

export const PathwayMenu = ({
  menus,
  industry,
}: {
  industry: string;
  menus: {
    sys: {
      id: string;
    };
    title: string;
  }[];
}) => {
  return (
    <section className="pathway-menus">
      <div className="container">
        <div className="heading">
          <h3>Explore {industry} Pathways</h3>
          <p>
            Choose a pathway below and explore the occupations, skills, trainings, and credentials
            needed. Click the green View Map button to see an overview of the pathway.
          </p>
        </div>
        {menus.map((menu) => (
          <Menu key={menu.sys.id} {...menu} />
        ))}
      </div>
    </section>
  );
};
