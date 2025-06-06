import { CurrencyDollarSimple, Info, X } from "@phosphor-icons/react";
import { ChangeEvent, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { checkValidZipCode } from "../utils/checkValidZipCode";
import { InlineIcon } from "./InlineIcon";
import { ContentfulRichText } from "../types/contentful";
import { ContentfulRichText as RichText } from "./ContentfulRichText";
import { CipDrawerContent } from "./CipDrawerContent";

export const SearchBlock = ({ drawerContent }: { drawerContent?: ContentfulRichText }) => {
  const [inPerson, setInPerson] = useState<boolean>(false);
  const [maxCost, setMaxCost] = useState<string>("");
  const [miles, setMiles] = useState<string>("");
  const [online, setOnline] = useState<boolean>(false);
  const [zipCode, setZipCode] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchUrl, setSearchUrl] = useState<string>("");
  const [zipValid, setZipValid] = useState<boolean>(false);
  const [attempted, setAttempted] = useState<boolean>(false);
  const [socDrawerOpen, setSocDrawerOpen] = useState<boolean>(false);
  const [cipDrawerOpen, setCipDrawerOpen] = useState<boolean>(false);

  const sanitizedValue = (value: string) => DOMPurify.sanitize(value);

  const clearAllInputs = () => {
    const inputs = document.querySelectorAll("input");
    const selects = document.querySelectorAll("select");
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    const checkboxArray: HTMLInputElement[] = Array.from(checkboxes) as HTMLInputElement[];
    checkboxArray.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
    inputs.forEach((input) => {
      input.value = "";
    });
    selects.forEach((select) => {
      select.value = "Miles";
    });
    // clear state
    setInPerson(false);
    setMaxCost("");
    setMiles("");
    setOnline(false);
    setZipCode("");
    setSearchTerm("");
  };

  useEffect(() => {
    setTimeout(() => {
      clearAllInputs();
    }, 200);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const overlay = document.querySelector("#drawerOverlay");
      if (overlay) {
        overlay.addEventListener("click", () => {
          setSocDrawerOpen(false);
          setCipDrawerOpen(false);
        });
      }

      // close drawer on escape key
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setSocDrawerOpen(false);
          setCipDrawerOpen(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    const params = [];
    if (inPerson) params.push("inPerson=true");
    if (maxCost) params.push(`maxCost=${encodeURIComponent(maxCost)}`);
    if (miles) params.push(`miles=${encodeURIComponent(miles)}`);
    if (online) params.push("online=true");
    if (zipCode) params.push(`zip=${encodeURIComponent(zipCode)}`);

    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `/training/search?q=${encodedSearchTerm}${params.length > 0 ? "&" : ""}${params.join("&")}`;
    setSearchUrl(url);
  }, [searchTerm, inPerson, maxCost, miles, online, zipCode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://newjersey.github.io/njwds/dist/js/uswds.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="search-block">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = searchUrl;
        }}
        data-testid="search-form"
      >
        <div className="heading">
          <p className="heading-tag">
            <span>Search for training </span>
            <button
              type="button"
              className="unstyled usa-tooltip"
              data-position="top"
              title="Search by training, provider, certification, SOC code, CIP code, or keyword."
            >
              <Info />
              <div className="sr-only">Information</div>
            </button>
          </p>
          <button
            type="button"
            id="clearAll"
            className="usa-button usa-button--unstyled clear-all"
            onClick={() => {
              clearAllInputs();
            }}
          >
            Clear all
          </button>
        </div>
        <div className="row">
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <input
            id="search-input"
            data-testid="search-input"
            type="text"
            aria-label="search"
            className="search-input usa-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(sanitizedValue(e.target.value));
            }}
            defaultValue={searchTerm}
          />
          <div className="submit">
            <button
              type="submit"
              id="search-button"
              data-testid="search-submit"
              className="usa-button"
            >
              Search
            </button>
          </div>
        </div>
        <div className="filters">
          <p className="heading-tag">Filters</p>
          <div className="row">
            <div className="area">
              <div className="label">Miles from ZIP code </div>
              <div className="inputs">
                <label htmlFor="miles" className="sr-only">
                  Miles
                </label>
                <select
                  disabled={!zipValid}
                  id="miles"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    if (e.target.value === "Miles") {
                      setMiles("");
                      return;
                    }

                    setMiles(sanitizedValue(e.target.value));
                  }}
                >
                  <option>Miles</option>
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>from</span>

                <input
                  type="number"
                  name="Zip"
                  id="zipCode"
                  placeholder="ZIP code"
                  onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = sanitizedValue(e.target.value);
                    setZipValid(checkValidZipCode(value));
                    setAttempted(true);

                    if (zipValid) {
                      setTimeout(() => {
                        const select = document.getElementById("miles") as HTMLSelectElement;
                        if (select) {
                          select.value = "10";
                          setMiles("10");
                        }
                      }, 100);
                    }
                  }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = sanitizedValue(e.target.value);
                    const select = document.getElementById("miles") as HTMLSelectElement;
                    if (checkValidZipCode(value)) {
                      setZipCode(value);
                      setAttempted(false);
                      if (select) {
                        select.value = "10";
                        setMiles("10");
                      }
                    } else {
                      setZipCode("");
                      setMiles("");
                    }
                  }}
                />

                {!zipValid && attempted && (
                  <div className="red fin mts">
                    <InlineIcon className="mrxs">error</InlineIcon> Please enter a 5-digit New
                    Jersey ZIP code.
                  </div>
                )}
              </div>
            </div>
            <div className="cost">
              <label className="label" htmlFor="maxCost">
                Max cost
              </label>
              <CurrencyDollarSimple />
              <input
                type="number"
                name="Max Cost"
                id="maxCost"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setMaxCost(sanitizedValue(e.target.value));
                }}
              />
            </div>
            <div className="format">
              <div className="label">Class format</div>
              <div className="checks">
                <div className="usa-checkbox">
                  <input
                    className="usa-checkbox__input"
                    id="in-person"
                    type="checkbox"
                    onChange={() => {
                      setInPerson(!inPerson);
                    }}
                  />
                  <label className="usa-checkbox__label" htmlFor="in-person">
                    In-person
                  </label>
                </div>
                <div className="usa-checkbox">
                  <input
                    className="usa-checkbox__input"
                    id="online"
                    type="checkbox"
                    onChange={() => {
                      setOnline(!online);
                    }}
                  />
                  <label className="usa-checkbox__label" htmlFor="online">
                    Online
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {drawerContent && (
        <>
          <div
            id="drawerOverlay"
            className={`overlay${socDrawerOpen || cipDrawerOpen ? " open" : ""}`}
          />
          {socDrawerOpen && (
            <div className="panel open">
              <div className="copy">
                <button
                  aria-label="Close"
                  title="Close"
                  className="close"
                  onClick={() => setSocDrawerOpen(false)}
                  type="button"
                >
                  <X size={28} />
                  <div className="sr-only">Close</div>
                </button>
                <RichText document={drawerContent.json} assets={drawerContent.links} />
              </div>
            </div>
          )}

          {cipDrawerOpen && (
            <div className="panel open">
              <div className="copy">
                <button
                  aria-label="Close"
                  title="Close"
                  className="close"
                  onClick={() => setCipDrawerOpen(false)}
                  type="button"
                >
                  <X size={28} />
                  <div className="sr-only">Close</div>
                </button>
                <CipDrawerContent onClose={() => setCipDrawerOpen(false)} />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
