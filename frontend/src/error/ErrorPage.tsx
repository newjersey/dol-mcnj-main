import React, { ReactElement } from "react";
import { Header } from "../search-results/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Icon } from "@material-ui/core";

interface Props {
  headerText: string;
  children: ReactElement;
}

export const ErrorPage = (props: Props): ReactElement => {
  return (
    <>
      <Header />
      <BetaBanner />
      <main role="main" className="container below-banners">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="alert-box mtxl">
              <div className="rounded-top bg-light-green pal fdr fac">
                <div className="text-xxl mrs fin vam">
                  <Icon fontSize="inherit">error</Icon>
                </div>
                <h2 className="text-xl">{props.headerText}</h2>
              </div>
              <div className="pal">{props.children}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
