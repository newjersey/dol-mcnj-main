import React, { ChangeEvent, ReactElement, useContext, useEffect, useState } from "react";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { SpacedCheckbox } from "../components/SpacedCheckbox";
import { FilterActionType, FilterContext } from "./FilterContext";
import { FilterableElement } from "../domain/Filter";
import { TrainingResult } from "../domain/Training";
import { SearchAndFilterStrings } from "../localizations/SearchAndFilterStrings";
import { UnstyledLinkButton } from "../components/UnstyledLinkButton";
import { InlineIcon } from "../components/InlineIcon";
import { ALL_LANGUAGES, DATA_VALUE_TO_LANGUAGE } from "./trainingLanguages";

const COLLAPSED_LIST_LENGTH = 4;

export const LanguagesFilter = (): ReactElement => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [showFullList, setShowFullList] = useState<boolean>(false);
  const { state, dispatch } = useContext(FilterContext);

  useEffect(() => {
    const languagesFilter = state.filters.find(
      (filter) => filter.element === FilterableElement.LANGUAGES
    );
    if (languagesFilter) {
      setLanguages(languagesFilter.value);
    } else if (languagesFilter == null && languages.length > 0) {
      setLanguages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

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
                  newLanguages != null && newLanguages.includes(DATA_VALUE_TO_LANGUAGE[lang])
              )
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
      {SearchAndFilterStrings.languagesFilterLabel}
      <FormGroup id="languages">
        <div>
          <div className="two-column-list">
            {displayedLanguages.map((lang) => (
              <FormControlLabel
                key={lang}
                control={
                  <SpacedCheckbox
                    checked={languages.includes(lang)}
                    onChange={handleCheckboxChange}
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
            ? SearchAndFilterStrings.filterListCollapseLabel
            : SearchAndFilterStrings.filterListExpandLabel}
        </span>
        <InlineIcon className="mlxs">
          {showFullList ? "arrow_drop_up" : "arrow_drop_down"}
        </InlineIcon>
      </UnstyledLinkButton>
    </label>
  );
};
