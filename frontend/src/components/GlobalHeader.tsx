import { NEW_JERSEY_NAV_QUERY } from "../queries/newJerseyNavQuery";
import { EnvelopeSm } from "../svg/EnvelopeSm";
import { SearchSm } from "../svg/SearchSm";
import { GlobalHeaderProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";
import { OverlayTool } from "./OverlayTool";
import image from "../overlayImages/WE Homepage.png";

const GlobalHeader = () => {
  const data: GlobalHeaderProps = useContentfulClient({ query: NEW_JERSEY_NAV_QUERY });

  const HasIcon = ({ string }: { string: string }) => {
    const isEnvelope = string.includes("[envelope]");
    const isSearch = string.includes("[search]");
    const newString = string.replace("[envelope]", "").replace("[search]", "");
    const Icon = isEnvelope ? EnvelopeSm : isSearch ? SearchSm : null;

    return (
      <>
        {Icon ? (
          <span className="has-icon">
            {newString} {Icon && <Icon />}
          </span>
        ) : (
          <>{newString}</>
        )}
      </>
    );
  };

  return (
    <div className="global-header">
      <OverlayTool img={image} />
      <div className="container">
        <div className="logo">
          <img src="state_seal_white.png" alt="New Jersey State Seal" />
          Official Site Of The State Of New Jersey
        </div>
        <nav>
          <a
            href="https://nj.gov/governor/"
            className="gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            Governor Phil Murphy • Lt. Governor Sheila Oliver
          </a>
          <ul>
            {data?.navMenus.topLevelItemsCollection.items?.map((item) => (
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

export default GlobalHeader;
