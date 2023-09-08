import { NavMenuData } from "../types/contentful";
import { Icon } from "@material-ui/core";
import stateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";

export const GlobalHeader = ({ items }: { items?: NavMenuData }) => {
  const HasIcon = ({ string }: { string: string }) => {
    const isEnvelope = string.includes("[envelope]");
    const isSearch = string.includes("[search]");
    const newString = string.replace("[envelope]", "").replace("[search]", "");
    const iconString = isEnvelope ? "mail" : isSearch ? "search" : null;

    return (
      <>
        {iconString ? (
          <span className="has-icon">
            {newString} {Icon && <Icon>{iconString}</Icon>}
          </span>
        ) : (
          <>{newString}</>
        )}
      </>
    );
  };

  return (
    <div className="global-header">
      <div className="container">
        <div className="logo">
          <img src={stateSeal} alt="New Jersey State Seal" />
          Official Site Of The State Of New Jersey
        </div>
        <nav>
          <a
            href="https://nj.gov/governor/"
            className="gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            Governor Phil Murphy • Lt. Governor Tahesha Way, Esq.
          </a>
          <ul>
            {items?.navMenus.topLevelItemsCollection.items?.map((item) => (
              <li key={item.sys.id} className={item.classes || undefined}>
                <a href={item.url}>
                  <HasIcon string={item.copy} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
