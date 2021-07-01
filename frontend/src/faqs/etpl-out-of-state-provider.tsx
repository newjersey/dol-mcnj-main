import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqEtplOosProvider = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Etpl Out of State Provider";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Etpl Out of State Provider" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">Out of State Training Providers</h2>
            <p>
              An out-of-state training provider that has been determined an eligible training
              provider under ETPL eligibility procedures in the provider's home state is considered
              eligible for ETPL placement in New Jersey. Out-of-state eligible training providers
              must still submit an ETPL application to COEI and include proof of ETPL eligibility in
              the provider's home state.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
