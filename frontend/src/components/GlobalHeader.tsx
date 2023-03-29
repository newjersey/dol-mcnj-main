import { NEW_JERSEY_NAV_QUERY } from "../queries/newJerseyNavQuery";
import { EnvelopeSm } from "../svg/EnvelopeSm";
import { SearchSm } from "../svg/SearchSm";
import { GlobalHeaderProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";

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
      <div className="usa-nav-container">
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
              <li key={item.sys.id}>
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
