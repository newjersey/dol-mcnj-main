import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { PageBanner } from "../components/PageBanner";

import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import ContactSuccess from "./ContactSuccess";
import ContactError from "./ContactError";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}
export const ContactUsPage = (props: Props): ReactElement<Props> => {
  const [formSuccess, setFormSuccess] = useState<boolean | undefined>(undefined);

  const bgColor = () => {
    switch (formSuccess) {
      case true:
        return "contact-success";
      case false:
        return "contact-error";
      default:
        return "contact-form";
    }
  };

  const resetForm = () => {
    setFormSuccess(undefined);
  };

  const contactUsContent = () => {
    switch (formSuccess) {
      case true:
        return <ContactSuccess resetForm={resetForm} />;
      case false:
        return <ContactError resetForm={resetForm} />;
      default:
        return (
          <ContactForm
            defaultValues={{ email: "", topic: "", message: "" }}
            setFormSuccess={setFormSuccess}
          />
        );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const url = new URL(window.location.href);
      const errorSlug = url.searchParams.get("path");
      const traingingTitle = url.searchParams.get("title");

      if (!errorSlug) {
        return;
      }

      const radioButtons = document.querySelectorAll<HTMLInputElement>("input[type=radio]");
      radioButtons.forEach((radioButton) => {
        if (radioButton.getAttribute("value") === "training-details") {
          radioButton.click();
        }
      });

      const searchInput = document.getElementById("message") as HTMLInputElement;
      if (searchInput) {
        searchInput.value = `Issue Report - Training Details Page: ${errorSlug}, ${traingingTitle}\n---\nPlease provide a description of the issue.`;
      }
    }, 200);
  }, []);

  return (
    <Layout
      client={props.client}
      seo={{
        title: "Contact Us | New Jersey Career Central",
        url: props.location?.pathname,
      }}
    >
      <PageBanner
        title="Contact Us"
        breadcrumbTitle="Contact Us"
        theme="green"
        section="support"
        breadcrumbsCollection={{
          items: [
            {
              url: "/",
              copy: "Home",
            },
          ],
        }}
      />
      <section className="contact-page-content">
        <ContactInfo />
        <div className={`contact-container form-container ${bgColor()}`}>
          {contactUsContent()}
          <div>
            Read about our{" "}
            <a href="https://www.nj.gov/nj/privacy.html" target="_blank" rel="noreferrer noopener">
              privacy policy
            </a>
            .
          </div>
        </div>
      </section>
    </Layout>
  );
};
