import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqEtplPerformanceStandards = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Etpl Performance Standards";
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Etpl Performance Standards" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Minimum Performance Standards for Training Providers</h2>
            <p>
              Statewide minimum performance standards will not be set during the implementation year
              (beginning August 1, 2016) as eligibility criteria for training programs to be placed
              on the ETPL. In subsequent years, COEI will report to the State Employment and
              Training Commission on the status of the performance data available and submit a
              recommendation regarding whether statewide minimum performance standards should be set
              for ETPL eligibility.
            </p>
            <p>
              However, the local areas may establish additional criteria for program eligibility
              within a local area, including the establishment of minimum required levels of
              performance as criteria for training providers to become or remain eligible to provide
              services in that particular local area. Training providers should be aware that
              programs may be approved for some local areas and denied for others based on local
              criteria and the approved local areas for each training provider will be listed on
              this page as local areas are instructed to notify COEI if performance standards are
              created.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
