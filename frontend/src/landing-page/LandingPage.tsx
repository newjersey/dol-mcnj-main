import { navigate, RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Searchbar } from "../components/Searchbar";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import IconOccupation from "./landing-icons/occupations.svg";
import IconGear from "./landing-icons/gear.svg";
import IconCounseling from "./landing-icons/counseling.svg";
import { LandingPageStrings } from "../localizations/LandingPageStrings";
import { Button } from "../components/Button";

export const LandingPage = (_props: RouteComponentProps): ReactElement => {
  return (
    <>
      <Header />
      <BetaBanner />

      <main className="below-banners" role="main">
        <div className="bg-light-green pvl">
          <div className="container search-container fdc fac fjc mtm mbl">
            <h2 className="text-xl weight-400 align-center mbd title">
              {LandingPageStrings.headerText}
            </h2>
            <Searchbar
              className="width-100 phm"
              onSearch={(searchQuery: string): Promise<void> =>
                navigate(`/search/${encodeURIComponent(searchQuery)}`)
              }
              placeholder={LandingPageStrings.searchBoxPlaceholder}
              stacked={true}
              isLandingPage={true}
            />
          </div>
        </div>

        <div className="container options-container">
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-occupation" src={IconOccupation} />
            </div>
            <h3 className="text-l weight-400 align-center">{LandingPageStrings.columnOneHeader}</h3>
            <p className="phm align-center options-desc">
              {LandingPageStrings.columnOneDescription}
            </p>
            <Button variant="secondary" onClick={() => navigate("/explorer")}>
              {LandingPageStrings.columnOneButtonText}
            </Button>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-counseling" src={IconCounseling} />
            </div>
            <h3 className="text-l weight-400 align-center">{LandingPageStrings.columnTwoHeader}</h3>
            <p className="phm align-center options-desc">
              {LandingPageStrings.columnTwoDescription}
            </p>
            <Button variant="secondary" onClick={() => navigate("/counselor")}>
              {LandingPageStrings.columnTwoButtonText}
            </Button>
          </div>
          <div className="col-md-4 fdc fac mvl">
            <div className="landing-image mbs">
              <img alt="icon-workforce" src={IconGear} />
            </div>
            <h3 className="text-l weight-400 align-center">
              {LandingPageStrings.columnThreeHeader}
            </h3>
            <p className="phm align-center options-desc">
              {LandingPageStrings.columnThreeDescription}
            </p>
            <Button variant="secondary" onClick={() => navigate("/training-provider")}>
              {LandingPageStrings.columnThreeButtonText}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
