import { X } from "@phosphor-icons/react";

export const SocDrawerContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="copy">
      <button
        aria-label="Close"
        title="Close"
        className="close"
        onClick={() => onClose()}
        type="button"
      >
        <X size={28} />
        <div className="sr-only">Close</div>
      </button>
      <h3>Standard Occupational Classification (SOC) codes</h3>
      <p>
        "The 2018 Standard Occupational Classification (SOC) system is a federal statistical
        standard used by federal agencies to classify workers into occupational categories for the
        purpose of collecting, calculating, or disseminating data." <sup>1.</sup>
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
      <br />
      <small className="sources">
        <p>
          <sup>1.</sup> Sources
          <ul>
            <li>
              .S. Bureau of Labor Statistics (BLS)
              <br />
              <a href="https://www.bls.gov/soc/" target="_blank" rel="noopener noreferrer">
                https://www.bls.gov/soc/
              </a>
            </li>
          </ul>
        </p>
      </small>
    </div>
  );
};
