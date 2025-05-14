import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { Helmet } from "react-helmet-async";
import { ReactElement } from "react";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";
import { useTranslation } from "react-i18next";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
  code: "404" | "500" | "503";
  heading?: string;
  subheading?: string;
  copy?: string;
}
export const SystemErrorPage = ({
  client,
  code,
  heading,
  subheading,
  copy,
}: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <Layout
      client={client}
      seo={{
        title: `${code} | My Career NJ`,
        pageDescription: `${subheading || t("SystemErrorPage.fourOhFourSubheading")}`,
      }}
    >
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>{code} | My Career NJ</title>
      </Helmet>
      <section className="systemErrorPage">
        <div className="container copy-block">
          <h1>
            <strong>{heading || t("SystemErrorPage.fourOhFourHeading")}</strong>
          </h1>
          <p className="heading-3">
            <span>{subheading || t("SystemErrorPage.fourOhFourSubheading")}</span>
          </p>
          <div className="inner-copy">
            <div
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(copy || t("SystemErrorPage.fourOhFourCopy")),
              }}
            />
            <div className="buttons">
              <a href="/" className="usa-button primary">
                {t("SystemErrorPage.buttonOne")}
              </a>
              <a href="/contact" className="usa-button usa-button--outline outline primary">
                {t("SystemErrorPage.buttonTwo")}
              </a>
            </div>
            <p>
              <strong>{t("SystemErrorPage.errorText")}</strong> {code}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
