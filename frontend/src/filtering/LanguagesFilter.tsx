import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { UnstyledLinkButton } from "../components/UnstyledLinkButton";
import { InlineIcon } from "../components/InlineIcon";
import { ALL_LANGUAGES, DATA_VALUE_TO_LANGUAGE } from "./trainingLanguages";
import { useTranslation } from "react-i18next";
import { toggleParams } from "../utils/updateUrlParams";
import { camelify } from "../utils/slugify";

const COLLAPSED_LIST_LENGTH = 4;

export const LanguagesFilter = (): ReactElement => {
  const { t } = useTranslation();

  const [languages, setLanguages] = useState<string[]>([]);
  const [showFullList, setShowFullList] = useState<boolean>(false);
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const languagesFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.LANGUAGES,
    );
    if (languagesFilter) {
      setLanguages(languagesFilter.value);
    } else if (languagesFilter == null && languages.length > 0) {
      setLanguages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const arabic = urlParams.get("arabic");
    const chinese = urlParams.get("chinese");
    const french = urlParams.get("french");
    const frenchCreole = urlParams.get("frenchCreole");
    const german = urlParams.get("german");
    const greek = urlParams.get("greek");
    const hebrew = urlParams.get("hebrew");
    const hindi = urlParams.get("hindi");
    const hungarian = urlParams.get("hungarian");
    const italian = urlParams.get("italian");
    const japanese = urlParams.get("japanese");
    const korean = urlParams.get("korean");
    const polish = urlParams.get("polish");
    const portuguese = urlParams.get("portuguese");
    const russian = urlParams.get("russian");
    const spanish = urlParams.get("spanish");
    const tagalog = urlParams.get("tagalog");
    const vietnamese = urlParams.get("vietnamese");

    const languageArray: string[] = [];

    if (arabic === "true") {
      languageArray.push("Arabic");
    }
    if (chinese === "true") {
      languageArray.push("Chinese");
    }
    if (french === "true") {
      languageArray.push("French");
    }
    if (frenchCreole === "true") {
      languageArray.push("French Creole");
    }
    if (german === "true") {
      languageArray.push("German");
    }
    if (greek === "true") {
      languageArray.push("Greek");
    }
    if (hebrew === "true") {
      languageArray.push("Hebrew");
    }
    if (hindi === "true") {
      languageArray.push("Hindi");
    }

    if (hungarian === "true") {
      languageArray.push("Hungarian");
    }

    if (italian === "true") {
      languageArray.push("Italian");
    }

    if (japanese === "true") {
      languageArray.push("Japanese");
    }
    if (korean === "true") {
      languageArray.push("Korean");
    }
    if (polish === "true") {
      languageArray.push("Polish");
    }
    if (portuguese === "true") {
      languageArray.push("Portuguese");
    }
    if (russian === "true") {
      languageArray.push("Russian");
    }
    if (spanish === "true") {
      languageArray.push("Spanish");
    }
    if (tagalog === "true") {
      languageArray.push("Tagalog");
    }
    if (vietnamese === "true") {
      languageArray.push("Vietnamese");
    }

    setLanguages(languageArray);

    dispatch({
      type: FilterActionType.ADD,
      filter: {
        element: FilterableElement.LANGUAGES,
        value: languageArray,
        func: (trainingResults): TrainingResult[] =>
          trainingResults.filter((it) =>
            it.languages.some(
              (lang) =>
                languageArray != null && languageArray.includes(DATA_VALUE_TO_LANGUAGE[lang]),
            ),
          ),
      },
    });
  }, []);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    let newLanguages: string[] | null = null;
    const selectedLanguage = event.target.name;

    if (checked && !languages.includes(selectedLanguage)) {
      newLanguages = [...languages, selectedLanguage];
    } else if (!checked && languages.includes(selectedLanguage)) {
      newLanguages = languages.filter((l) => l !== selectedLanguage);
    }

    if (newLanguages != null) {
      setLanguages(newLanguages);
      dispatch({
        type: newLanguages.length === 0 ? FilterActionType.REMOVE : FilterActionType.ADD,
        filter: {
          element: FilterableElement.LANGUAGES,
          value: newLanguages,
          func: (trainingResults): TrainingResult[] =>
            trainingResults.filter((it) =>
              it.languages.some(
                (lang) =>
                  newLanguages != null && newLanguages.includes(DATA_VALUE_TO_LANGUAGE[lang]),
              ),
            ),
        },
      });
    }
  };

  const displayedLanguages = showFullList
    ? ALL_LANGUAGES
    : ALL_LANGUAGES.slice(0, COLLAPSED_LIST_LENGTH);

  return (
    <label className="bold" htmlFor="languages">
      {t("SearchAndFilter.languagesFilterLabel")}
      <FormGroup id="languages">
        <div>
          <div className="two-column-list">
            {displayedLanguages.map((lang) => (
              <FormControlLabel
                key={lang}
                control={
                  <SpacedCheckbox
                    checked={languages.includes(lang)}
                    onChange={(e) => {
                      handleCheckboxChange(e, !languages.includes(lang));
                      toggleParams({
                        condition: e.target.checked,
                        value: "true",
                        key: camelify(lang),
                        valid: true,
                      });
                    }}
                    name={lang}
                    color="primary"
                  />
                }
                label={lang}
              />
            ))}
          </div>
        </div>
      </FormGroup>
      <UnstyledLinkButton
        data-testid="toggle-language-list"
        onClick={() => setShowFullList((prevValue) => !prevValue)}
      >
        <span className="underline">
          {showFullList
            ? t("SearchAndFilter.filterListCollapseLabel")
            : t("SearchAndFilter.filterListExpandLabel")}
        </span>
        <InlineIcon className="mlxs">
          {showFullList ? "arrow_drop_up" : "arrow_drop_down"}
        </InlineIcon>
      </UnstyledLinkButton>
    </label>
  );
};
