import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import { Layout } from "../components/Layout";
import { OverlayTool } from "../components/OverlayTool";
import image from "../overlayImages/Financial Resources - Mobile.png";

export const FinancialPage = (props: RouteComponentProps): ReactElement => {
  return (
    <Layout>
      <OverlayTool img={image} />
      <div className="container">
        <code>
          <pre
            style={{
              fontFamily: "monospace",
              display: "block",
              padding: "50px",
              color: "#88ffbf",
              backgroundColor: "black",
              textAlign: "left",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(props, null, "    ")}
          </pre>
        </code>

        <h1>Financial Page</h1>
      </div>
    </Layout>
  );
};
