import { Drawer } from "@components/modules/Drawer";
import { Heading } from "@components/modules/Heading";

export const SocDrawer = ({
  socDrawerOpen,
  setSocDrawerOpen,
}: {
  socDrawerOpen: boolean;
  setSocDrawerOpen: (value: boolean) => void;
}) => {
  return (
    <Drawer open={socDrawerOpen} setOpen={setSocDrawerOpen}>
      <Heading level={3}>
        Standard Occupational Classification (SOC) codes
      </Heading>
      <p>
        "The 2018 Standard Occupational Classification (SOC) system is a federal
        statistical standard used by federal agencies to classify workers into
        occupational categories for the purpose of collecting, calculating, or
        disseminating data." <sup>1.</sup>
      </p>
      <p>
        You can find a list of SOC codes{" "}
        <a
          href="https://www.bls.gov/oes/current/oes_stru.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          here.
        </a>
      </p>
      <br />
      <div className="small sources">
        <span>
          <sup>1.</sup> Sources
          <ul>
            <li>
              .S. Bureau of Labor Statistics (BLS)
              <br />
              <a
                href="https://www.bls.gov/soc/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.bls.gov/soc/
              </a>
            </li>
          </ul>
        </span>
      </div>
    </Drawer>
  );
};
