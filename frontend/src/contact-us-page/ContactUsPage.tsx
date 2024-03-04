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
      <section className="contact-us-content">
        <div className="contact-us-container">
          <div className="info-block">
            <h2>Contact Information</h2>
            <p>
              <strong>
                NJ Department of Labor and Workforce Development
              </strong>
            </p>
            <p>
              Center for Occupational Employment Information (COEI)
            </p>
            <p>
              PO Box 057, 5th Floor, Trenton, New Jersey 08625-0057
            </p>
          </div>
          <div className="contact-form-container">
            <h2>Contact Form</h2>
            <p>
              Please reach out to us with your questions or comments. Our staff at the Department of Labor and Workforce office will get back with you in 3-5 business days.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
};
