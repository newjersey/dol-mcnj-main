import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BetaBanner } from "../components/BetaBanner";
import React, { ReactElement, useEffect } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { FundingPageStrings } from "../localizations/FundingPageStrings";

export const FundingPage = (_props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = FundingPageStrings.pageTitle;
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners">
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-xl pvd weight-500">{FundingPageStrings.header}</h2>
          </div>

          <div className="col-sm-8">
            <h3 className="text-l ptd weight-500">{FundingPageStrings.sectionOneHeader}</h3>
            <p>{FundingPageStrings.sectionOneText}</p>

            <h3 className="text-l ptd weight-500">{FundingPageStrings.sectionTwoHeader}</h3>
            <p>
              {FundingPageStrings.sectionTwoText.split("{link}")[0].trim()}
              &nbsp;
              <Link to="/in-demand-occupations">{FundingPageStrings.sectionTwoLinkText}</Link>
              &nbsp;
              {FundingPageStrings.sectionTwoText.split("{link}")[1].trim()}
            </p>

            <h3 className="text-l ptd weight-500">{FundingPageStrings.sectionThreeHeader}</h3>
            <p>
              {FundingPageStrings.sectionThreeText.split("{link}")[0].trim()}
              &nbsp;
              <a
                className="link-format-blue"
                target="_blank"
                rel="noopener noreferrer"
                href={FundingPageStrings.sectionThreeLink}
              >
                {FundingPageStrings.sectionThreeLinkText}
              </a>
              &nbsp;
              {FundingPageStrings.sectionThreeText.split("{link}")[1].trim()}
            </p>
          </div>

          <div className="col-sm-4 mbm">
            <div className="bg-light-purple pam bradl">
              <h3 className="text-l weight-500">{FundingPageStrings.purpleBoxHeader}</h3>
              <p>
                {FundingPageStrings.purpleBoxText.split("{link}")[0].trim()}
                &nbsp;
                <a
                  className="link-format-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={FundingPageStrings.purpleBoxLink}
                >
                  {FundingPageStrings.purpleBoxLinkText}
                </a>
                &nbsp;
                {FundingPageStrings.purpleBoxText.split("{link}")[1].trim()}
              </p>
            </div>

            <div className="bg-light-green pam mtm bradl">
              <h3 className="text-l ptd weight-500">{FundingPageStrings.greenBoxHeader}</h3>
              <p>
                {FundingPageStrings.greenBoxText.split("{link}")[0].trim()}
                &nbsp;
                <Link className="link-format-blue" to="/in-demand-occupations">
                  {FundingPageStrings.greenBoxLinkText}
                </Link>
                &nbsp;
                {FundingPageStrings.greenBoxText.split("{link}")[1].trim()}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
