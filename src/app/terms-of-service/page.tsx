import { MainLayout } from "@components/global/MainLayout";
import { Heading } from "@components/modules/Heading";
import { getNav } from "@utils/getNav";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  return {
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };
}

export function metadata() {
  return {
    title: `Terms of Service | ${process.env.REACT_APP_SITE_NAME}`,
    description:
      "Terms of Service for the New Jersey Training Explorer website.",
    openGraph: {
      images: [globalOgImage.src],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function TermsOfServicePage() {
  const { footerNav1, footerNav2, mainNav, globalNav } = await getData();
  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };
  return (
    <MainLayout {...navs}>
      <div
        className="container "
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <Heading level={2}>Terms of Conditions and Use</Heading>
        <p>
          Welcome! Thank you for visiting the New Jersey Training Explorer
          website (&quot;Website&quot;), a project of the New Jersey Department
          of Labor and Workforce Development, the Office of Innovation, the
          Heldrich Center for Workforce Development at Rutgers University, the
          New Jersey Council on Community Colleges, the Office of the Secretary
          of Higher Education, and the New Jersey Department of Education.
          (&quot;our&quot;, &quot;we&quot;, &quot;us&quot;). Please be aware
          that we have a Privacy Policy and Information Collection Statement
          included as part of this Terms and Conditions of Use.
        </p>
        <p>
          By proceeding beyond the Website home page or viewing or posting
          content to the Website, you indicate your consent to, agreement with,
          and understanding of these terms. Please note that this policy is
          subject to change without notice, and that it reflects our current
          business practices. By continuing to access and use the site, you
          indicate your consent to, agreement with, and understanding of such
          modifications, changes or alterations. Please review these terms
          regularly, as they may be modified from time to time without notice to
          you.
        </p>
        <p>
          During the pilot, usage of the Website is restricted to residents of
          the United States. By proceeding, you certify that you are currently
          located in and reside in the United States. If this status changes
          during the pilot period, please contact us at{" "}
          <a
            href="mailto:TrainingEvaluationUnit@dol.nj.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            TrainingEvaluationUnit@dol.nj.gov
          </a>
          .
        </p>

        <h3>Section A. Information Disclaimer</h3>
        <p>
          We make great effort to provide secure, accurate and complete
          information on this Website. Any errors or omissions should be
          reported to us at{" "}
          <a
            href="mailto:TrainingEvaluationUnit@dol.nj.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            TrainingEvaluationUnit@dol.nj.gov
          </a>{" "}
          for review.
        </p>
        <p>
          We shall not be liable for damages or losses of any kind arising out
          of or in connection with the use or performance of information,
          including but not limited to, damages or losses caused by reliance
          upon the accuracy or timeliness of any such information, or damages
          incurred from the viewing, distributing, or copying of those
          materials.
        </p>
        <p>
          The materials and information provided on this website are provided
          &quot;as is.&quot; No warranty of any kind, implied, expressed, or
          statutory, including but not limited to the warranties of
          non-infringement of third party rights, title, merchantability,
          fitness for a particular purpose, and freedom from computer virus, is
          given with respect to the contents of this web site or its hyperlinks
          to other Internet resources.
        </p>
        <p>
          We disclaim any duty or obligation to either maintain availability of
          or to update the information contained on this Website.
        </p>

        <h3>Section B. Links to Other Sites</h3>
        <p>
          This Website provides links to other websites as a convenience to you.
          These include links to websites operated by third-party government
          agencies, nonprofit organizations, universities, and private
          businesses. When you use one of these links, you are no longer on this
          site, and this Information Collection Statement does not apply. When
          you link to another website, you are subject to the privacy notice and
          information collection practices of that site. Any visitor who
          proceeds to those external sites and relies on any information
          obtained from them does so at his or her own risk and assumes any and
          all liability from damages which may result from accessing a
          third-party site linked to this Website.
        </p>
        <p>
          We exercise no control over the third-party organization&apos;s views,
          accuracy, copyright or trademark compliance, or the legality of the
          material contained on those websites, and do not sponsor, endorse, or
          approve the information, content, products, materials, opinions or
          services contained on such external sites.
        </p>
        <p>
          Furthermore, when you follow a link to another website, portions of
          their information may be incorrect or out-of-date. We do not warrant
          the accuracy, reliability, or timeliness of any information published
          by external sites.
        </p>

        <h3>Section C. Endorsement Disclaimer</h3>
        <p>
          Reference in this web site to any specific commercial products,
          processes, or services, or the use of any trade, firm, or corporation
          name is for the information and convenience of the public, and does
          not constitute endorsement, recommendation, or favoring by us.
        </p>

        <h3>Section D. Intrusion Detection</h3>
        <p>
          This Website may be subject to monitoring to assure proper functioning
          of the systems, to provide security for the computer system&apos;s
          operation and information contained therein, to prevent unauthorized
          use, and to deter and investigate violations of law. There is no
          reasonable expectation of privacy in the use of this Website.
        </p>

        <h3>Section E. Intellectual Property Licenses</h3>
        <ol>
          <li>
            We have made the original content (&quot;Content&quot;) of these
            pages available to the public. Unless otherwise stated on other
            content or information to which a restriction on free use may apply,
            Content is licensed under a Creative Commons 4.0 Attribution
            License, which provides for a worldwide, royalty-free license to
            reproduce and share the Content in whole or in part
          </li>
          <li>
            Unless otherwise stated, the software code for this website is made
            available under the MIT License. Original software code can be found
            at:{" "}
            <a
              href="https://github.com/newjersey"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/newjersey
            </a>
            . Third party content, libraries, services and materials retain
            their original licenses. Making a copy of such material may be
            subject to copyright, trademark or other intellectual property laws.
          </li>
          <li>
            Neither our name nor the names of other copyright holders may be
            used to endorse or promote products derived from this Content or
            software without specific prior written permission.
          </li>
        </ol>

        <h3>Section F. Your Conduct</h3>
        <p>
          You may submit content (collectively, &quot;User Created
          Content&quot;) to the Website, provided that you abide by these common
          sense rules. You may not:
        </p>
        <ol>
          <li>
            Violate any local, state, federal and international laws and
            regulations, including but not limited to copyright and intellectual
            property rights laws regarding any content that you send or receive
            via these Terms;
          </li>
          <li>
            Transmit any material (by uploading, posting, email or otherwise)
            that is unlawful, disruptive, threatening, profane, abusive,
            harassing, embarrassing, tortious, defamatory, obscene, libelous, or
            is an invasion of another&apos;s privacy, is hateful or racially,
            ethnically, religiously or otherwise objectionable as solely
            determined by us;
          </li>
          <li>
            Be considerate of others&apos; privacy; do not reference another
            person without their permission;
          </li>
          <li>Harass another;</li>
          <li>
            Impersonate any person or entity or falsely state or otherwise
            misrepresent your affiliation or agency relationship with a person
            or entity;
          </li>
          <li>
            Transmit any material (by any means) that:
            <ul>
              <li>You do not have a right to make available under any law;</li>
              <li>
                Infringes any patent, trademark, trade secret, copyright or
                other proprietary rights of any party;
              </li>
              <li>
                Contains malware, viruses, disabling code, or any other computer
                code, files or programs designed to interrupt, destroy or limit
                the functionality of any computer software, hardware, mobile
                devices, or telecommunications equipment;
              </li>
            </ul>
          </li>
          <li>
            Transmit (by any means) any unsolicited or unauthorized advertising,
            promotional materials, &quot;junk mail&quot;, &quot;spam&quot;,
            &quot;chain letters&quot;, &quot;pyramid schemes&quot; or any other
            form of solicitation;
          </li>
          <li>Post any third-party links.</li>
        </ol>

        <h3>Section G. DMCA Notice</h3>
        <p>
          We respect the intellectual property of others, and we ask users of
          our Website to do the same. In accordance with the Digital Millennium
          Copyright Act (DMCA) and other applicable law, if you believe your
          copyright has been infringed please email us at:{" "}
          <a
            href="mailto:TrainingEvaluationUnit@dol.nj.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            TrainingEvaluationUnit@dol.nj.gov
          </a>
          .
        </p>
        <p>
          To be an effective notice under Section 512(c) of the DMCA your
          written notice must include all of the following:
        </p>
        <ol>
          <li>
            A physical or electronic signature of a person authorized to act on
            behalf of the owner of an exclusive right that is allegedly
            infringed;
          </li>
          <li>
            Identification of the copyrighted work claimed to have been
            infringed, or if multiple copyrighted works at a single site are
            covered by a single notification, a representative list of such
            works at that site;
          </li>
          <li>
            Identification of the material that is claimed to be infringing or
            to be the subject of infringing activity and that is to be removed
            or access to which is to be disabled, and information reasonably
            sufficient to permit Rackspace to locate the material;
          </li>
          <li>
            Information reasonably sufficient to permit Rackspace to contact
            you, such as an address, telephone number, and, if available, an
            e-mail address;
          </li>
          <li>
            A statement that you have a good faith belief that use of the
            material in the manner complained of is not authorized by the
            copyright owner, its agent, or the law;
          </li>
          <li>
            A statement that the information in the notification is accurate,
            and under penalty of perjury, that you are copyright owner or
            authorized to act on behalf of the owner of an exclusive right that
            is allegedly infringed.
          </li>
        </ol>

        <h3>Section H - Correcting Your Information</h3>
        <p>
          We may also ask you to verify your identity and to provide further
          details relating to your request.
        </p>
        <ol>
          <li>
            Correcting your Information: We will take reasonable steps to ensure
            the accuracy of the personal information we retain about you. It is
            your responsibility to ensure you submit true, accurate, and
            complete information to us, and that you update us in a timely
            manner if your information changes. You may request that any
            inaccurate or incomplete personal information held by us or on our
            behalf is corrected, by contacting us as set forth under &quot;How
            Can You Contact Us?&quot; below.
          </li>
          <li>
            Transferring your Information: Under certain circumstances, you may
            receive your personal information in a format that allows you to
            send it somewhere else, or to direct us to transfer it directly
            somewhere else. This site uses the industry standard encryption
            software Secure Socket Layer (SSL) to enable secure transmission of
            data. The URL in your browser will change to &quot;HTTPS&quot;
            instead of &quot;HTTP&quot; when this security feature is used. Your
            browser may also display a &quot;padlock&quot; or &quot;key&quot;
            symbol on its task bar to indicate a secure transmission. If these
            indicators are not present, information may be susceptible to
            interception by other parties. Most internet email communication is
            not considered secure. If you are communicating sensitive
            information, please consider sending it by other means.
          </li>
          <li>
            Contact Information: If after reviewing this Terms of Use, you have
            any questions, complaints or privacy concerns, or would like to make
            any requests in relation to your personal information, or obtain
            further information on safeguards, please send an email to{" "}
            <a
              href="mailto:TrainingEvaluationUnit@dol.nj.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              TrainingEvaluationUnit@dol.nj.gov
            </a>
            .
          </li>
        </ol>
      </div>
    </MainLayout>
  );
}
