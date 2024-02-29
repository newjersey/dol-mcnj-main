import { ReactElement } from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { PageBanner } from "../components/PageBanner";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

export const ContactUsPage = (props: Props): ReactElement<Props> => {
  return (
    <Layout
      client={props.client}
      seo={{
        title: 'Contact Us | New Jersey Career Central',
        url: props.location?.pathname,
      }}
    >
      <PageBanner
        title="Contact Us"
        breadcrumbTitle="Contact Us"
        theme="green"
        section="support"
        breadcrumbsCollection={
          {
            items: [
              {
                url: '/',
                copy: 'Home',
              }
            ],
          }
        }
      />
    </Layout>
  )
};
