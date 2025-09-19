import { Envelope, MagnifyingGlass } from "@phosphor-icons/react";
import { NavMenuProps } from "@utils/types";
import { SupportedLanguages } from "@utils/types/types";
import Image from "next/image";

interface NjHeaderProps {
  menu: NavMenuProps;
  lang: SupportedLanguages;
}

const HasIcon = ({ string }: { string: string }) => {
  const isEnvelope = string.includes("[envelope]");
  const isSearch = string.includes("[search]");
  const newString = string.replace("[envelope]", "").replace("[search]", "");
  const IconItem = isEnvelope ? (
    <Envelope weight="bold" />
  ) : isSearch ? (
    <MagnifyingGlass weight="bold" />
  ) : null;

  return (
    <>
      {IconItem ? (
        <span className="has-icon">
          {newString} {IconItem}
        </span>
      ) : (
        <>{newString}</>
      )}
    </>
  );
};

const NjHeader = ({ menu, lang }: NjHeaderProps) => {
  return (
    <div className="global-header">
      <div className="container">
        <div className="logo">
          <Image
            width={30}
            height={30}
            src="/stateSeal.png"
            alt="New Jersey State Seal"
          />
          <span>Official Site Of The State Of New Jersey</span>
        </div>
        <nav aria-label="Global Navigation">
          <a
            href="https://nj.gov/governor/"
            className="gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            Governor Phil Murphy • Lt. Governor Sheila Oliver
          </a>
          <ul>
            {menu[lang]?.topLevelItemsCollection.items?.map((item) => (
              <li key={item.itemId} className={item.classes || undefined}>
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

export { NjHeader };
