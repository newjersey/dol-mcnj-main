import { NavMenuData } from "../types/contentful";
import { Icon } from "@material-ui/core";
import stateSeal from "@newjersey/njwds/dist/img/nj_state_seal.png";

export const GlobalHeader = ({ items }: { items?: NavMenuData }) => {

  return (
    <div className="global-header">
      <div className="container">
        <div className="logo">
          <img src={stateSeal} alt="New Jersey State Seal" />
          Official Site Of The State Of New Jersey
        </div>
        <nav aria-label="global-navigation">
          <a
            href="https://nj.gov/governor/"
            className="gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            Governor Phil Murphy • Lt. Governor Tahesha Way
          </a>
          <ul>
            {items?.navMenus.topLevelItemsCollection.items?.map((item) => {
              const isEnvelope = item.copy.includes("[envelope]");
              const isSearch = item.copy.includes("[search]");
              const newString = item.copy.replace("[envelope]", "").replace("[search]", "");
              const iconString = isEnvelope ? "mail" : isSearch ? "search" : null;


              return (
                <li key={item.sys.id} className={item.classes || undefined}>
                  <a href={item.url} className={iconString ? "has-icon" : undefined}>
                    {newString} {iconString && <Icon>{iconString}</Icon>}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
