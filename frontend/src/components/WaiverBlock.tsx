import { useMediaQuery } from "@material-ui/core";
import React, { ReactElement, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ContextualInfoContext } from "../contextual-info/ContextualInfoContext";

interface Props {
    title: string;
    backgroundColorClass: string;
}

export const WaiverBlock = (props: Props): ReactElement => {
    const { t } = useTranslation();

    const isTabletAndUp = useMediaQuery("(min-width:768px)");
    const { setContextualInfo } = useContext(ContextualInfoContext);

    return (
        <div className={`${props.backgroundColorClass} stat-block`}>
            <div>{props.title}</div>

            {isTabletAndUp && <div className="ptm pbs"><a className="link-format-blue" href="https://www.nj.gov/labor/career-services/tools-support/demand-occupations/waivers.shtml" target="_blank" rel="noreferrer">{t("OccupationPage.localAndRegionalWaiversText")}</a></div>}

        </div>
    );
};