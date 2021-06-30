import React, { ReactElement, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { BetaBanner } from "../components/BetaBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FaqBreadcrumb } from "../components/faq-breadcrumb";

export const FaqRegisteredApprenticeship = (props: RouteComponentProps): ReactElement => {
  useEffect(() => {
    document.title = "FAQ - Registered Apprenticeship";
  }, []);

  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <FaqBreadcrumb current="Registered Apprenticeship" />

        <div className="row mbm">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <h2 className="text-l mvd">
              I operate a Registered Apprenticeship Program. Does my program need to be on the ETPL?
            </h2>
            <p>
              Registered Apprenticeship programs are only required to be listed on the ETPL if they
              are seeking to receive any state or federal job training funds. Otherwise, ETPL
              participation is optional.
            </p>
            <p>
              Registered Apprenticeship programs are not subject to the same application
              requirements as all other training providers. Registered Apprenticeship program
              sponsors that request to be listed on the ETPL are automatically included on the list
              and will remain as long as the program is registered or until the program sponsor
              notifies the State that it no longer wants to be included on the list.
            </p>
            <p>
              COEI shall work directly with the Office of Apprenticeship to semi-annually obtain a
              listing of all newly Registered Apprenticeship programs in New Jersey. Office of
              Apprenticeship shall contact all Registered Apprenticeship programs on the list to
              obtain the programs' interest in ETPL placement. Contacted Registered Apprenticeship
              programs who wish to be listed on the ETPL must submit the{" "}
              <a
                href="http://lwd.dol.state.nj.us/labor/forms_pdfs/coei/ETPL/ETPLRegisteredApprenticeshipApplicationPacket.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="link-format-blue"
              >
                Registered Apprenticeship Application
              </a>
              .
            </p>
            <p>
              Although WIOA does not require Registered Apprenticeship programs to submit program
              performance information in order to be placed on or remain eligible for ETPL
              placement, the submission of student information is required pursuant to New Jersey
              state law. Any Registered Apprenticeship program electing to be added to the ETPL must
              agree to and adhere to the student record reporting requirements contained in N.J.S.A
              . 34:15C-10.2.d.
            </p>
            <p>
              COEI shall work directly with the Office of Apprenticeship to obtain a listing of all
              deregistered apprenticeship programs at least every two years. Any programs actively
              listed on the ETPL that are no longer registered with the Office of Apprenticeship
              will be removed from the ETPL.
            </p>
            <p>
              Pre-apprenticeship programs do not have the same automatic ETPL status under WIOA as
              do Registered Apprenticeship programs and must follow the initial application process
              in order to obtain ETPL placement.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
