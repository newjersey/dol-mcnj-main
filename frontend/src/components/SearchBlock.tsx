import { ArrowRight, CurrencyDollarSimple, X } from "@phosphor-icons/react";
import { ChangeEvent, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { checkValidZipCode } from "../utils/checkValidZipCode";
import { InlineIcon } from "./InlineIcon";
import { ContentfulRichText } from "../types/contentful";
import { ContentfulRichText as RichText } from "./ContentfulRichText";
import {CipDrawerContent} from "./CipDrawerContent";

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

  const sanitizedValue = (value: string | Node) => DOMPurify.sanitize(value);

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
    }
  }, []);

  useEffect(() => {
    // Build the search parameters
    const params = [];
    if (inPerson) {
      params.push("inPerson=true");
    }
    if (maxCost) {
      params.push(`maxCost=${maxCost}`);
    }
    if (miles) {
      params.push(`miles=${miles}`);
    }
    if (online) {
      params.push("online=true");
    }
    if (zipCode) {
      params.push(`zip=${zipCode}`);
    }

    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `/training/search?q=${encodedSearchTerm}${params.length > 0 ? "&" : ""}`;

    // Concatenate the search parameters to the url
    if (params.length > 0) {
      const queryParams = params.join("&");
      setSearchUrl(url + queryParams);
    } else {
      setSearchUrl(url);
    }
  }, [searchTerm, inPerson, maxCost, miles, online, zipCode]);
  return (
    <div className="search-block">
      <div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = searchUrl;
          }}
          className="container"
          data-testid="search-form"
        >
          <div className="heading">
            <h2>Find Training</h2>
            <button
              type="button"
              id="clearAll"
              className="usa-button usa-button--unstyled"
              onClick={() => {
                clearAllInputs();
              }}
            >
              Clear All
            </button>
          </div>
          <p>
            Search by training, provider, certification,{" "}
            {drawerContent ? (
              <button
                className="toggle"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSocDrawerOpen(true);
                }}
              >
                SOC code
              </button>
            ) : (
              "SOC code"
            )}
            ,&nbsp;
          <button
          className="toggle"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setCipDrawerOpen(true);
          }}
        >
            CIP code
        </button>
          , or keyword
          </p>
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
                setSearchTerm(e.target.value);

            }}
            defaultValue={searchTerm}
          />
          <div className="submit">
            <button type="submit" data-testid="search-submit" className="usa-button">
              Search
            </button>
            <a
              id="search-button"
              href={`/training/search?q=${searchTerm}`}
              className="usa-button usa-button--unstyled"
            >
              Advanced Search
              <ArrowRight />
            </a>
          </div>
        </div>
        <div className="filters">
          <h3>Filters</h3>
          <div className="row">
            <div className="area">
              <div className="label">
                {zipValid ? "Miles from Zip Code" : "Enter a New Jersey Zip Code"}
              </div>
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
                      setZipValid(checkValidZipCode(e.target.value));
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
                      const select = document.getElementById("miles") as HTMLSelectElement;
                      if (checkValidZipCode(e.target.value)) {
                        setZipCode(sanitizedValue(e.target.value));
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
                  Max Cost
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
                <a
                  href="/support-resources/tuition-assistance"
                  className="usa-button usa-button--unstyled"
                >
                  Tuition Assistance Information
                </a>
              </div>
              <div className="class">
                <div className="label">Class Format</div>
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
                      In-Person
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
            <div id="drawerOverlay" className={`overlay${socDrawerOpen || cipDrawerOpen ? " open" : ""}`} />
          {socDrawerOpen && (
            <div className="panel open">
              <div className="copy">
                <button aria-label="Close" title="Close" className="close" onClick={() => setSocDrawerOpen(false)} type="button">
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
                <button aria-label="Close" title="Close" className="close" onClick={() => setCipDrawerOpen(false)} type="button">
                  <X size={28} />
                  <div className="sr-only">Close</div>
                </button>
                <CipDrawerContent onClose={() => setCipDrawerOpen(false)} />
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};
