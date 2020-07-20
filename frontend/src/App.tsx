import React, {Dispatch, ReactElement, Reducer, useReducer} from "react";
import {LandingPage} from "./landing-page/LandingPage";
import {SearchResultsPage} from "./search-results/SearchResultsPage";
import {TrainingPage} from "./training-page/TrainingPage";
import {Client} from "./domain/Client";
import {Router} from "@reach/router";
import {Filter} from "./domain/Filter";

interface Props {
    client: Client;
}

export enum FilterActionType {
    ADD, REMOVE
}

type FilterReducer = Reducer<State, FilterAction>;

const initialState = {
    filters: [],
};

interface State {
    filters: Filter[];
}

export interface FilterAction {
    type: FilterActionType;
    filter: Filter;
}

interface FilterContext {
    state: State;
    dispatch: Dispatch<FilterAction>;
}

export const FilterContext = React.createContext<FilterContext>(
    { dispatch: () => {}, state: initialState}
);

export const App = (props: Props): ReactElement => {

    const removeFilter = (filter: Filter, list: Filter[]): Filter[] => {
        return list.filter((it: Filter) => it.element !== filter.element)
    }

    const reducer = (state: State, action: FilterAction): State => {
        switch (action.type) {
            case FilterActionType.ADD:
                return {
                    ...state,
                    filters: [...removeFilter(action.filter, state.filters), action.filter]
                };
            case FilterActionType.REMOVE:
                return {
                    ...state,
                    filters: removeFilter(action.filter, state.filters)
                }
            default:
                throw new Error();
        }
    }

    const [state, dispatch] = useReducer<FilterReducer>(reducer, initialState);

    return (
        <FilterContext.Provider value={{state, dispatch}}>
            <Router>
                <LandingPage path="/"/>
                <SearchResultsPage path="/search" client={props.client}/>
                <SearchResultsPage path="/search/:searchQuery" client={props.client}/>
                <TrainingPage path="/training/:id" client={props.client}/>
            </Router>
        </FilterContext.Provider>
    )
}