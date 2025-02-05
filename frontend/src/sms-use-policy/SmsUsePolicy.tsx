import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { usePageTitle } from "../utils/usePageTitle";

interface Props extends RouteComponentProps {
  client: Client;
}

export const SmsUsePolicyPage = (props: Props): ReactElement => {
  usePageTitle(`SMS Use Policy | ${process.env.REACT_APP_SITE_NAME}`);

  return (
    <Layout
      client={props.client}
      seo={{
        title: `SMS Use Policy | ${process.env.REACT_APP_SITE_NAME}`,
        pageDescription: `SMS Use Policy for ${process.env.REACT_APP_SITE_NAME}`,
        url: props.location?.pathname || "/sms-use-policy",
      }}
    >
      <div className="container">
        <div className="row mbm">
          <div className="col-sm-12">
            <h2 className="text-xl mvd">The State of New Jersey - Department of Labor and Workforce Development SMS Use Policy</h2>
            
            <h3 className="text-l mt-4">Consent</h3>
            <p className="mb-3">
              We will only send you SMS (text message) communications related to My Career NJ updates, programs, financial aid information, 
              important deadlines, and other relevant notifications if you have explicitly opted in to receive them.
            </p>
            <p className="mb-3">You can provide consent by:</p>
            <ul className="mb-4">
              <li>Checking a box on a designated form or website indicating your agreement to receive SMS messages.</li>
              <li>Texting a specific keyword (provided on official materials) to a designated short code.</li>
            </ul>
            <p className="mb-4">
              We will clearly explain what types of messages you can expect to receive and the approximate frequency.
            </p>
            <p className="mb-5">
              We will never sell your phone number to any third parties or share it without your explicit consent, except as required by law.
            </p><br></br>
  
            <h3 className="text-l mt-5">Opt-Out</h3>
            <p className="mb-3">You can opt-out of receiving SMS messages at any time by:</p>
            <ul className="mb-4">
              <li>Texting "STOP" to any message you receive from us.</li>
              <li>Replying with any of the opt-out keywords provided in our messages (e.g., "UNSUBSCRIBE," "QUIT").</li>
              <li>Contacting the New Jersey Department of Labor and Workforce Development directly through the provided contact information.</li>
            </ul>
            <p className="mb-5">
              Once you opt out, you will no longer receive SMS messages from us unless you opt back in at a later time.
            </p><br></br>
  
            <h3 className="text-l mt-5">Message Frequency</h3>
            <p className="mb-3">
              We respect your time and will not send an excessive number of SMS messages. We will strive to provide clear expectations about 
              message frequency at the time of opt-in.
            </p>
            <p className="mb-5">
              If you feel you are receiving too many messages, you can contact us to adjust your preferences or opt-out completely.
            </p><br></br>
  
            <h3 className="text-l mt-5">Message Content</h3>
            <p className="mb-3">SMS messages will primarily contain information related to:</p>
            <ul className="mb-4">
              <li>My Career NJ news and updates in New Jersey</li>
              <li>Career tips including resume writing, job interview skills, creating a community network, benefits, and changing careers.</li>
              <li>Finding a job with Career Navigator, getting new skills with Training Explorer, qualifying for additional support, and more.</li>
            </ul>
            <p className="mb-5">
              We will never send you any inappropriate, offensive, or unsolicited commercial content.
            </p><br></br>
  
            <h3 className="text-l mt-5">Message and Data Rates</h3>
            <p className="mb-3">
              Standard message and data rates may apply to any SMS messages you receive from us. These rates are determined by your mobile 
              carrier and are beyond our control.
            </p>
            <p className="mb-5">
              Please consult your mobile carrier's plan for specific information on messaging costs.
            </p><br></br>
  
            <h3 className="text-l mt-5">Privacy</h3>
            <p className="mb-3">
              We are committed to protecting your privacy. Your personal information will be handled in accordance with all applicable state 
              and federal privacy laws, including the New Jersey Privacy Act.
            </p>
            <p className="mb-5">
              We will not use your phone number for any purpose other than sending you the SMS communications you have opted in to receive.
            </p><br></br>
  
            <h3 className="text-l mt-5">Changes to this Policy</h3>
            <p className="mb-3">
              This SMS Use Policy may be updated periodically to reflect changes in our practices or applicable laws.
            </p>
            <p className="mb-5">
              Any significant changes to the policy will be communicated to you via SMS or through other official channels.
            </p><br></br>
  
            <h3 className="text-l mt-5">Contact Us</h3>
            <p className="mb-3">
              If you have any questions, concerns, or would like to update your SMS communication preferences, 
              please contact the New Jersey Department of Labor and Workforce Development using the 
              <a href="/contact"> Contact Us </a> link.
            </p><br></br>
  
            <h3 className="text-l mt-5">Disclaimer</h3>
            <p className="mb-3">
              This SMS Use Policy is subject to the laws and regulations of the State of New Jersey.
            </p>
            <p className="mb-5">
              The New Jersey Department of Labor and Workforce Development reserves the right to modify or terminate this service at any time.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
  
};
