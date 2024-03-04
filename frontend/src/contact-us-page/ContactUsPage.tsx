import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import { Client } from "../domain/Client";
import { Layout } from "../components/Layout";
import { PageBanner } from "../components/PageBanner";

interface Props extends RouteComponentProps {
  client: Client;
  location?: WindowLocation<unknown> | undefined;
}

const topics = [
  {
    label: 'In-demand Occupations',
    value: 'in-demand-occupations'
  },
  {
    label: 'Occupation Details',
    value: 'occupation-details'
  },
  {
    label: 'Support and Assistance',
    value: 'support-and-assistance'
  },
  {
    label: 'Training Details',
    value: 'training-details'
  },
  {
    label: 'Training Provider Resources',
    value: 'training-provider-resources'
  },
  {
    label: 'Tuition Assistance',
    value: 'tuition-assistance'
  },
  {
    label: 'Other / Not Listed',
    value: 'other'
  }
]

interface FormValues {
  email: string;
  topic: string;
  message: string;
}

export const ContactUsPage = (props: Props): ReactElement<Props> => {
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    topic: '',
    message: '',
  });
  const { handleSubmit } = useForm();

  const onSubmit = () => {
    const data = JSON.stringify(formValues);
    console.log(data);
  };

  const clearForm = () => {
    setFormValues({
      email: '',
      topic: '',
      message: '',
    });
  }

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
          <div>
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
          </div>
          <div className="contact-form-container">
            <h2>Contact Form</h2>
            <p>
              Please reach out to us with your questions or comments. Our staff at the Department of Labor and Workforce office will get back with you in 3-5 business days.
            </p>
            <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={e => setFormValues({ ...formValues, email: e.target.value })}
                  value={formValues.email}
                  required
                />
              </div>
              <div>
                <label htmlFor="topic">Please select a topic</label>
                {topics.map((topic) => (
                  <div key={topic.value}>
                    <input
                      type="radio"
                      id={topic.value}
                      name="topic"
                      value={topic.value}
                      onChange={e => setFormValues({ ...formValues, topic: e.target.value })}
                      checked={formValues.topic === topic.value}
                      required
                    />
                    <label htmlFor={topic.value}>{topic.label}</label>
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="message">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  onChange={e => setFormValues({ ...formValues, message: e.target.value })}
                  value={formValues.message}
                  required
                />
              </div>
              <div>
                <button type="submit" className="usa-button">Submit</button>
                <button type="button" onClick={clearForm}>
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
};
