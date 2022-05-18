import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";
import SearchScreenshot from "./search-screenshot.png";
import FilterScreenshot from "./filter-screenshot.png";
import { useTranslation } from "react-i18next";

export const FaqSearchHelp = (_props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Search Help";
    window.scrollTo(0, 0);
  }, []);
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Search Help" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">How to start your search on the Training Explorer</h2>

            <h3 className="weight-500">Using The Search Bar</h3>
            <p>
              The search bar on the{" "}
              <Link className="link-format-blue" to="/">
                home page
              </Link>{" "}
              will allow you to make searches for training opportunities on the State’s Eligible
              Training Provider List (ETPL). The ETPL is a comprehensive listing of all schools and
              organizations offering occupational education and job training programs that are
              eligible to receive publicly funded tuition assistance. The listing is made available
              via this website’s “Find Training” search feature.
            </p>
            <p>
              <img width="345" src={SearchScreenshot} alt={t("FAQ.searchHelpScreenshot")} />
            </p>
            <p>
              The types of training you will find on this website range from private career schools,
              non-profit schools, community colleges, vocational schools, literacy programs,
              short-term credentials, and registered apprenticeships.
            </p>

            <h3 className="weight-500">Using the Search and Sort Filters</h3>
            <p>
              The filter box will be available for people using tablet or desktop devices on the
              left side of the search results page after performing a search. If you’re on a mobile
              device, the filter box will be accessible by clicking on the "Edit Search or Filter"
              button.
            </p>
            <p>
              <img width="119" src={FilterScreenshot} alt={t("FAQ.searchFilterScreenshot")} />
            </p>
            <p>
              The filters available will allow you to refine your search from a location, set a cost
              ceiling for training programs, find whether classes are in-person or done remotely,
              and set a timeframe for how long it takes to complete a course. Finally, there’s a
              toggle available to show a program that will lead to an in-demand occupation.
              Selecting this filter will only show search results with the yellow, in-demand tag.
              These filters can be used in combination with each other to create more specific
              search results.
            </p>
            <p>
              The sort by dropdown at the top of the page will sort your training search results
              according to the filter selected in the drop down. You can sort search results by max
              cost, employment rate, or a best match search result.
            </p>

            <h3 className="weight-500">Career Exploration</h3>
            <p>
              To find out information about occupations that are identified as in-demand by the
              State of New Jersey, select the "
              <Link className="link-format-blue" to="/in-demand-occupations">
                In-Demand Occupations
              </Link>
              " link at the top of the page. This link will navigate you to a listing of all the
              occupations that are projected to experience large increases in growth and job
              listings. On this page, you can use the search bar at the top of the page to look for
              an occupation or you can use the industry categories to look for in-demand
              occupations. An occupation’s page will detail statistics about how many jobs are
              currently listed in the State through the National Labor Exchange as well as the
              median salary for that career. You will also find a short description of that
              occupation, what a day in the life of that job looks like, as well as the education or
              credential requirements to get into that occupation. Finally, you will see related
              training and related careers for the occupation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
