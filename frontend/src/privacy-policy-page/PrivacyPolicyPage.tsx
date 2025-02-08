import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { usePageTitle } from "../utils/usePageTitle";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { useTranslation } from "react-i18next";

interface Props extends RouteComponentProps {
  client: Client;
}

export const PrivacyPolicyPage = (props: Props): ReactElement => {
  usePageTitle(`Privacy Policy | ${process.env.REACT_APP_SITE_NAME}`);
  const { t } = useTranslation();

  return (
    <Layout
      client={props.client}
      seo={{
        title: `Privacy Policy | ${process.env.REACT_APP_SITE_NAME}`,
        pageDescription: "Privacy Policy and Information Collection Statement",
        url: props.location?.pathname || "/privacy-policy",
      }}
    >
      <div className="container">
        <div className="row mbm">
          <div
            className="col-sm-12 copy-block"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(t("PrivacyPolicy.copy")),
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
