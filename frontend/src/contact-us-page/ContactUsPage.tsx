import { ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { RouteComponentProps, WindowLocation } from "@reach/router";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField
} from "@material-ui/core";
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

const schema = yup.object()
  .shape({
    email: yup.string().email('Please enter a valid email').required('Please enter an email'),
    topic: yup.string().required('Please select an option'),
    message: yup.string().required('Please enter a message').test('len', 'Cannot be more than 250 characters', val => {
      if (val?.length) return val.length <= 250;
    }),
  })
  .required();

export const ContactUsPage = (props: Props): ReactElement<Props> => {
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchMessage = watch("message");

  // @ts-expect-error - TS doesn't know that the formValues state is being set
  const onSubmit = (data) => {
    const formValues = JSON.stringify(data);
    console.log(formValues);
  };

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
          <section className="">
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
          </section>
          <section className="contact-form-container">
            <h2>Contact Form</h2>
            <p>
              Please reach out to us with your questions or comments. Our staff at the Department of Labor and Workforce office will get back with you in 3-5 business days.
            </p>
            <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="input-container">
                <div>
                  <label htmlFor="email">Email</label> <span className="required">*</span>
                </div>
                <TextField
                  fullWidth
                  id="email"
                  type="text"
                  variant="outlined"
                  {...register("email")}
                />
                <div className="form-error-message">
                  {errors.email?.message}
                </div>
              </div>
              <div className="input-container">
                <div>
                  <label htmlFor="topic">Please select a topic</label> <span className="required">*</span>
                </div>
                <Controller
                  name="topic"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      aria-label="topic"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {topics.map((topic, index) => (
                        <FormControlLabel key={index} value={topic.value} control={<Radio />} label={topic.label} />
                      ))}
                    </RadioGroup>
                  )}
                />
                <div className="form-error-message">
                  {errors.topic?.message}
                </div>
              </div>
              <div className="input-container">
                <div>
                  <label htmlFor="message">Your message</label> <span className="required">*</span>
                </div>
                <textarea
                  id="message"
                  {...register("message")}
                />
                <div className={`message-count ${getValues("message")?.length > 250 ? 'required' : undefined}`}>
                  {watchMessage ? `${getValues("message").length}` : `0`} / 250
                </div>
                <div className="form-error-message">
                  {errors.message?.message}
                </div>
              </div>
              <div className="required-instructions">
                A red asterisk (<span className="required">*</span>) indicates a required field.
              </div>
              <div className="button-container">
                <button type="submit" className="usa-button">Submit</button>
                <button type="button" onClick={() => reset()}>
                  Clear Form
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </Layout>
  )
};
