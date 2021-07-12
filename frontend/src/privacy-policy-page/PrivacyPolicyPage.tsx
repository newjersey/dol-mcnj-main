import React, { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Header } from "../components/Header";
import { BetaBanner } from "../components/BetaBanner";
import { Footer } from "../components/Footer";

export const PrivacyPolicyPage = (props: RouteComponentProps): ReactElement => {
  return (
    <>
      <Header />
      <BetaBanner />

      <main className="container below-banners" role="main">
        <div className="row mbm">
          <div className="col-sm-12">
            <h2 className="text-xl mvd">Privacy Policy and Information Collection Statement</h2>
            <p>
              We respect your personal privacy and want you to be familiar with how we collect,
              disclose, and otherwise use ("Process") your information. This Information Collection
              Statement describes our practices in connection with the information we collect
              through this Website. Please read the following to learn more about our privacy
              practices.
            </p>

            <h3 className="text-l">Definition of Personal Information</h3>
            <p>
              For purposes of this Information Collection Statement, "Personal Information" means
              any information that can be used to distinguish or trace an individual’s identity,
              either alone or when combined with other personal or identifying information that is
              linked or linkable to a specific individual.
            </p>

            <h3 className="text-l">What We Collect</h3>
            <p>
              The User Created Content that you voluntarily provide to us or post to the Website or
              use to access the Website, which may include personal information or training search
              related information and documentation, including:
            </p>
            <ul className="plm mvd">
              <li>
                Support inquiries (e.g, technical, training-related), feedback and other
                communications
              </li>
              <li>Site-generated data, including recommendations provided to you</li>
              <li>Interactions with the Website and related metadata</li>
              <li>Information about the devices you use to access the site</li>
              <li>Website analytics data</li>
            </ul>
            <p>
              This User Created Content will be used solely for the purposes of providing you the
              stated service on the Website, enabling us to monitor and improve the Website, and
              reporting aggregate data about use of the Website.
            </p>
            <p>
              We take reasonable steps to protect the information you provide us from loss, misuse
              and unauthorized access, disclosure, alteration, and destruction. We have implemented
              appropriate physical, electronic and managerial procedures to help safeguard and
              secure your information from loss, misuse, unauthorized access or disclosure,
              alteration or destruction. Unfortunately, no security system is 100% secure; thus, we
              cannot ensure the security of all information you provide to us via our services.
            </p>
            <p>
              Under no circumstances, shall any User Created Information, with the exception of that
              which is publicly posted and visible to all, be sold, rented, given or provided to any
              third-party. Other information we may collect about you:
            </p>
            <ul className="plm mvd">
              <li className="mbd">
                <span className="bold">Cookies: </span>Our services may use "cookies" and similar
                technologies (collectively, "Cookies"). Cookies are small text files that this
                website sends to your computer for record-keeping purposes and this information is
                stored in a file on your computer’s hard drive. Cookies make web surfing and
                browsing easier for you by saving your preferences so that we can use these to
                improve your next visit to our website.
                <ul className="plm mbd mts">
                  <li>
                    One of the purposes of cookies is to simplify the use of the website. A cookie
                    may save a user’s login details for example, so that the user does not need to
                    login every time.
                  </li>
                  <li>
                    Cookies are also used for statistical purposes, to determine how the website is
                    used.
                  </li>
                </ul>
              </li>
              <li className="mbd">
                <span className="bold">Google Analytics: </span> We may use Google Analytics to help
                us get a better understanding of how visitors use this website.
                <ul className="plm mbd mts">
                  <li>
                    The information generated by the Google Analytics cookie, about your use of this
                    website, is transmitted to and stored by Google. If you do not want your
                    activity on this website to be tracked by Google Analytics, you may opt out by
                    using this link:&nbsp;
                    <a
                      href="http://tools.google.com/dlpage/gaoptout?hl=en."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-format-blue"
                    >
                      http://tools.google.com/dlpage/gaoptout?hl=en.
                    </a>
                    .
                  </li>
                </ul>
              </li>
              <li className="mbd">
                <span className="bold">From Other Sources: </span> We may receive your personal
                information from other sources, such as public databases, social media platforms,
                from people with whom you are friends or otherwise connected on social media
                platforms, as well as from other third parties. For example, if you elect to connect
                your social media account to your website account, certain personal information from
                your social media account will be shared with us, which may include personal
                information that is part of your public profile, or your friends' public profiles.
              </li>
              <li className="mbd">
                <span className="bold">Other Non-Personal Information: </span>
                In addition to any personal information or other information that you choose to
                provide to us on our services, we and our third-party service providers may use a
                variety of technologies, now and hereafter devised, that automatically collect
                certain website usage information whenever you visit or interact with our services.
                This information may include browser type, operating system, the page served, the
                time, the source of the request, the preceding page view, and other similar
                information. We may use this usage information for a variety of purposes, including
                to enhance or otherwise improve our services. In addition, we may also collect your
                IP address or some other unique identifier for the particular device you use to
                access the Internet, as applicable (collectively, referred to herein as a "Device
                Identifier"). A device identifier is a number that is automatically assigned to your
                device, and we may identify your device by its device identifier. When analyzed,
                usage information helps us determine how our services are used, such as what types
                of visitors arrive at the services, what type of content is most popular, what type
                of content you may find most relevant and what type of visitors are interested in
                particular kinds of content and advertising. We may associate your device identifier
                or website usage information with the personal information you provide, but we will
                treat the combined information as personal information.
              </li>
            </ul>
            <p>
              We use non-personal information in a variety of ways, including to help analyze site
              traffic, understand our user’s needs and trends and to improve our services. We may
              use your non-personal information by itself or aggregate it with information we have
              obtained from others. We may share your non-personal information with our third
              parties to achieve these objectives and others, but remember that aggregate
              information is anonymous information that does not personally identify you. We may
              provide our analysis and certain non-personal information to third parties, who may in
              turn use this information to provide additional services tailored to your needs, but
              this will not involve disclosing any of your personally identifiable information.
            </p>
            <p>
              Because aggregated or anonymized information does not constitute personal information,
              we may use it for any purpose. If we combine anonymized or aggregated data with
              personal information, we will treat the combined information as personal information
              according to this Privacy Notice.
            </p>
            <p>We may process personal information in connection with any of the following:</p>
            <ol className="plm mvd">
              <li className="mbd">
                Our business transactions with you, including, but not limited to:
                <ul className="plm mbd mts">
                  <li>To respond to your inquiries and fulfill your requests</li>
                  <li>
                    To send administrative information to you, for example, information regarding
                    the services
                  </li>
                  <li>To complete and fulfill any requests for services</li>
                </ul>
              </li>
              <li className="mbd">
                For our legitimate interests, including, but not limited to:
                <ul className="plm mbd mts">
                  <li>To personalize your experience with our services</li>
                  <li>
                    To carry out data analysis, audits, fraud monitoring and prevention, internal
                    quality assurance, developing new services, enhancing, improving or modifying
                    our services, identifying usage trends, auditing use and functionality of our
                    services and/or helping enforce compliance with our Legal Statement and
                    Disclaimers.
                  </li>
                </ul>
              </li>
              <li className="mbd">
                In accordance with any consent you may have provided. In some cases, you have the
                right to decline to provide your consent and, if consent is provided, to withdraw
                your consent at any time.
              </li>
              <li className="mbd">
                As necessary or appropriate for legal reasons, including, but not limited to:
                <ul className="plm mbd mts">
                  <li>Under applicable law</li>
                  <li>To comply with legal process</li>
                  <li>
                    To respond to requests from other public and government authorities, including
                    those outside your State or country of residence
                  </li>
                </ul>
              </li>
            </ol>

            <h3 className="text-l">When We Disclose Your Information</h3>
            <p>We may disclose your information as follows: </p>
            <ul className="plm mvd">
              <li className="mbd">
                <span className="bold">
                  Among New Jersey Agencies and Departments, and Rutgers University:
                </span>{" "}
                To better provide you with services and provide a consistent user experience, we
                may, according to any applicable laws or rules, share your information between New
                Jersey Agencies and Departments, and Rutgers University.
              </li>
              <li className="mbd">
                <span className="bold">Vendors and Service Providers: </span>
                We may disclose your information to vendors and service providers we retain in
                connection with our services such as: financial services companies, website hosting,
                data analysis, payment processing, information technology and related infrastructure
                provision, email delivery, credit card processing, legal advisers, accountants or
                auditing.
              </li>
              <li className="mbd">
                <span className="bold">Message Boards: </span> We may make reviews, message boards,
                blogs, and other such user-generated content facilities available to users. Any
                information disclosed in these areas becomes public information and you should
                always be careful when deciding to disclose your personal information. We are not
                responsible for privacy practices of other users, including website operators to
                whom you provide information.
              </li>
              <li className="mbd">
                <span className="bold">Disclosure Permitted by Law: </span> We may disclose your
                personal information to law enforcement authorities, other government or public
                agencies or officials, regulators, and/or to any other person or entity having
                appropriate legal authority or justification for receipt of your information, if
                required or permitted to do so by law or legal process, in order to respond to
                claims, or to protect our rights, interests, privacy, property or safety, and/or
                that of our affiliates, you or other third parties.
              </li>
            </ul>

            <h3 className="text-l">Other Important Information</h3>

            <ul className="plm mvd">
              <li className="mbd">
                <span className="bold">Applications and Social Media Sites: </span>
                Please note that we are not responsible for the collection, usage and disclosure of
                policies and practices, including the data security, of other organizations, such as
                Facebook, Apple, Google, Microsoft, or any other app developer, app provider, social
                media platform provider, operating system provider, wireless service provider or
                device manufacturer, including any personal information you disclose to other
                organizations through or in connection with the apps or our social media pages.
              </li>
              <li>
                <span className="bold">International Transfers: </span>
                The users of our services may come from all over the world. Therefore, we may,
                subject to applicable law, transfer your information, outside the country where you
                are located and where information protection standards may differ, e.g., your
                information may be stored on servers located in other states, or even countries. We
                will utilize appropriate safeguards governing the transfer and usage of your
                personal information. If you would like further details on the safeguards we have in
                place you can contact us directly at{" "}
                <a
                  href="mailto:TrainingEvaluationUnit@dol.nj.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-format-blue"
                >
                  TrainingEvaluationUnit@dol.nj.gov
                </a>
                .
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
