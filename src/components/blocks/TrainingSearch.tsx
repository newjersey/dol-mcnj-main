"use client";
import { ChangeEvent, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Heading } from "@components/modules/Heading";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { CurrencyDollarSimple, Info } from "@phosphor-icons/react";
import { zipCodes } from "@utils/zipCodeCoordinates";
import { encodeForUrl } from "@utils/encodeForUrl";
import { Flex } from "@components/utility/Flex";
import { Tooltip } from "react-tooltip";
import { colors } from "@utils/settings";
import { TrainingExplorerHeadingProps } from "app/training/TrainingExplorerHeading";

export interface TrainingSearchProps {
  className?: string;
  content: TrainingExplorerHeadingProps["search"];
}

const TrainingSearch = ({ className, content }: TrainingSearchProps) => {
  const [inPerson, setInPerson] = useState<boolean>(false);
  const [maxCost, setMaxCost] = useState<string>("");
  const [miles, setMiles] = useState<string>("");
  const [online, setOnline] = useState<boolean>(false);
  const [zipCode, setZipCode] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchUrl, setSearchUrl] = useState<string>("");
  const [zipError, setZipError] = useState<boolean>(true);
  const [attempted, setAttempted] = useState<boolean>(false);

  const sanitizedValue = (value: string | Node) => DOMPurify.sanitize(value);

  const clearAllInputs = () => {
    const inputs = document.querySelectorAll("input");
    const selects = document.querySelectorAll("select");
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    const checkboxArray: HTMLInputElement[] = Array.from(
      checkboxes,
    ) as HTMLInputElement[];
    checkboxArray.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
    inputs.forEach((input) => {
      input.value = "";
    });
    selects.forEach((select) => {
      select.selectedIndex = 0;
    });

    // clear state
    setInPerson(false);
    setMaxCost("");
    setMiles("");
    setOnline(false);
    setZipCode("");
    setSearchTerm("");
    setZipError(true);
    setAttempted(false);
  };

  useEffect(() => {
    setTimeout(() => {
      clearAllInputs();
    }, 200);
  }, []);

  useEffect(() => {
    const params = [];
    const url = `/training/search?q=${searchTerm}${
      params.length > 0 ? "&" : ""
    }`;
    // Build the search parameters
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

    if (params.length > 0) {
      const queryParams = params.join("&");
      setSearchUrl(`${url}&${queryParams}`);
    } else {
      setSearchUrl(url);
    }
  }, [searchTerm, inPerson, maxCost, miles, online, zipCode]);

  useEffect(() => {
    const searchInput = document.getElementById("searchInput");
    const milesInput = document.getElementById("miles");
    const zipInput = document.getElementById("zip");
    const maxCostInput = document.getElementById("maxCost");
    const searchButton = document.getElementById("search-button");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (
          e.target === searchInput ||
          e.target === milesInput ||
          e.target === zipInput ||
          e.target === maxCostInput
        ) {
          searchButton?.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      id="trainingSearch"
      className={`trainingSearch${className ? ` ${className}` : ""}`}
    >
      <div className="container">
        <div className="inner-container">
          <Flex direction="column" gap="sm" fill className="inner">
            <Flex direction="column" gap="xs" fill>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                className="input-heading"
                columnBreak="none"
              >
                <Flex columnBreak="none" alignItems="center" gap="xxs">
                  <Heading level={content.heading.level}>
                    {content.heading.heading}
                  </Heading>

                  <Info
                    data-tooltip-id="totalClockHours-tooltip"
                    size={24}
                    color={colors.primary}
                  />

                  <Tooltip
                    id="totalClockHours-tooltip"
                    className="custom-tooltip"
                  >
                    <div className="max-w-[250px] text-pretty">
                      {content.toolTip.copy}
                    </div>
                  </Tooltip>
                </Flex>
                <Button
                  {...content.clearButton}
                  onClick={() => {
                    clearAllInputs();
                  }}
                />
              </Flex>

              <form
                onSubmit={(
                  e:
                    | React.FormEvent<HTMLFormElement>
                    | React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  e.preventDefault();
                  // navigate to searchUrl
                  window.location.href = searchUrl;
                }}
              >
                <FormInput
                  type="text"
                  inputId="searchInput"
                  label="Search for Training"
                  hideLabel
                  ariaLabel="search"
                  defaultValue={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(encodeForUrl(sanitizedValue(e.target.value)));
                  }}
                />

                <Button
                  buttonId="search-button"
                  defaultStyle="secondary"
                  link={searchUrl}
                  className="search-button"
                  type="submit"
                  label={content.form.submitLabel}
                  iconSuffix="ArrowRight"
                />
              </form>
            </Flex>
            <Flex direction="column" gap="xxs" fill className="filter-row">
              <Heading level={3}>Filters</Heading>
              <Flex alignItems="flex-end" className="filters" columnBreak="lg">
                <Flex
                  alignItems="flex-end"
                  gap="xs"
                  className="miles-container"
                  columnBreak="none"
                >
                  <FormInput
                    type="select"
                    inputId="miles"
                    disabled={zipError}
                    label={content.form.miles.label}
                    error={
                      zipError && attempted
                        ? content.form.miles.zipError
                        : undefined
                    }
                    options={[
                      { key: content.form.miles.milesPlaceholder, value: "" },
                      { key: "5", value: "5" },
                      { key: "10", value: "10" },
                      { key: "25", value: "25" },
                      { key: "50", value: "50" },
                      { key: "100", value: "100" },
                      { key: "200", value: "200" },
                    ]}
                    value={miles}
                    onChangeSelect={(e: ChangeEvent<HTMLSelectElement>) => {
                      if (
                        e.target.value === content.form.miles.milesPlaceholder
                      ) {
                        setMiles("");
                        return;
                      }

                      setMiles(sanitizedValue(e.target.value));
                    }}
                  />

                  <span className="from">from</span>
                  <FormInput
                    type="text"
                    inputId="zip"
                    placeholder={content.form.miles.zipPlaceholder}
                    label={content.form.miles.zipPlaceholder}
                    hideLabel
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setZipCode(sanitizedValue(e.target.value));
                    }}
                    onBlur={() => {
                      setAttempted(true);
                      setZipError(
                        zipCodes.filter((zip) => zip === zipCode).length > 0
                          ? false
                          : true,
                      );
                    }}
                  />
                </Flex>
                <Flex alignItems="flex-end" gap="sm" columnBreak="none">
                  <div className="maxCost">
                    <CurrencyDollarSimple />
                    <FormInput
                      type="number"
                      inputId="maxCost"
                      label={content.form.costLabel}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setMaxCost(sanitizedValue(e.target.value));
                      }}
                    />
                  </div>
                  <div className="checks">
                    <p>{content.form.format.label}</p>
                    <Flex
                      alignItems="center"
                      className="items"
                      columnBreak="none"
                    >
                      <FormInput
                        type="checkbox"
                        inputId="in-person"
                        label={content.form.format.inPersonLabel}
                        onChange={() => {
                          setInPerson(!inPerson);
                        }}
                      />
                      <FormInput
                        type="checkbox"
                        inputId="online"
                        label={content.form.format.onlineLabel}
                        onChange={() => {
                          setOnline(!online);
                        }}
                      />
                    </Flex>
                  </div>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>
    </section>
  );
};

export { TrainingSearch };
