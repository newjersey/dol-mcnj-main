import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { useContentful } from "../utils/useContentful";
import { HomepageProps } from "../types/contentful";
import { HomeBanner } from "./components/HomeBanner";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/homePage.jpg";
import { useTranslation } from "react-i18next";
import { content } from "./content";
import { CardProps } from "../components/Card";
import { TopTools } from "./components/TopTools";
import { Resources } from "./components/Resourses";

// --- Basic styles for the modal ---
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999998,
};

const modalContentStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  height: '80%',
  maxHeight: '700px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
};

const iframeStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-15px',
  right: '-15px',
  background: 'white',
  border: '2px solid black',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999999,
};

const SURVEY_MONKEY_DISMISSED_KEY = "surveyMonkeyModalDismissed";

interface Props extends RouteComponentProps {
  client: Client;
}

export const LandingPage = (props: Props): ReactElement => {
  const data: HomepageProps = useContentful({
    path: `/home-page`,
  });

  const pageData = data?.homePage;
  const { t } = useTranslation();

  usePageTitle(pageData?.title);

  const seoObject = {
    title: pageData?.title || (process.env.REACT_APP_SITE_NAME as string),
    pageDescription:
        "Explore My Career NJ to find job training, career resources, and employment opportunities with the New Jersey Department ofLabor.",
    image: pageData?.ogImage?.url || pageImage,
    keywords: pageData?.keywords,
    url: props.location?.pathname || "/",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const surveyUrl = "https://www.surveymonkey.com/r/GK6PZRQ";

  useEffect(() => {
    // Only show modal if not previously dismissed/completed
    if (localStorage.getItem(SURVEY_MONKEY_DISMISSED_KEY) === "true") {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      const linkElement = (event.target as HTMLElement).closest("a");
      if (!linkElement) return;
      if (linkElement.pathname === window.location.pathname && linkElement.hash) return;

      event.preventDefault();

      setTargetUrl(linkElement.href);
      setIsModalOpen(true);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Optionally, listen for SurveyMonkey completion via postMessage (advanced)
  // useEffect(() => {
  //   function handleMessage(event: MessageEvent) {
  //     // Example: if SurveyMonkey posts a message on completion, set the flag here.
  //     // if(event.data === 'survey-complete') {
  //     //   localStorage.setItem(SURVEY_MONKEY_DISMISSED_KEY, "true");
  //     //   setIsModalOpen(false);
  //     // }
  //   }
  //   window.addEventListener('message', handleMessage);
  //   return () => window.removeEventListener('message', handleMessage);
  // }, []);

  const closeAndNavigate = () => {
    setIsModalOpen(false);
    localStorage.setItem(SURVEY_MONKEY_DISMISSED_KEY, "true");
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click is on the overlay itself, not its children
    if (event.target === event.currentTarget) {
      closeAndNavigate();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Close on Escape key for accessibility
    if (event.key === 'Escape') {
      closeAndNavigate();
    }
  };

  return (
      <>
        {isModalOpen && (
            // The onKeyDown is now for the 'Escape' key, a standard modal pattern
            <div
                style={modalOverlayStyle}
                onClick={handleOverlayClick}
                onKeyDown={handleKeyDown}
                role="presentation" // Use "presentation" as it's a container, not a button
                tabIndex={-1} // Make div focusable for keydown
            >
              <div
                  style={modalContentStyle}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="survey-dialog-title" // Good for screen readers
              >
                {/* You can add a hidden title for screen readers */}
                <h2 id="survey-dialog-title" style={{ display: 'none' }}>Feedback Survey</h2>
                <button style={closeButtonStyle} onClick={closeAndNavigate} aria-label="Close survey modal">X</button>
                <iframe title="Survey" src={surveyUrl} style={iframeStyle} />
              </div>
            </div>
        )}

        <Layout client={props.client} noPad seo={seoObject}>
          <div className="home-page">
            <HomeBanner
                heading={t("LandingPage.bannerHeading")}
                images={content.banner.images}
                subheading={t("LandingPage.bannerSubheading")}
                message={t("LandingPage.bannerMessageCopy")}
                preload
            />
            <TopTools
                heading={t("LandingPage.topToolsHeader")}
                items={
                  [
                    {
                      heading: t("LandingPage.topToolNavigatorHeading"),
                      description: t("LandingPage.topToolNavigatorDescription"),
                      icon: "Compass",
                      link: { href: "/navigator", text: t("LandingPage.topToolNavigatorButtonText") },
                      theme: "blue",
                    },
                    {
                      heading: t("LandingPage.topToolExplorerHeading"),
                      description: t("LandingPage.topToolExplorerDescription"),
                      icon: "Signpost",
                      link: { href: "/training", text: t("LandingPage.topToolExplorerButtonText") },
                      theme: "green",
                    },
                    {
                      heading: t("LandingPage.topToolPathwaysHeading"),
                      description: t("LandingPage.topToolPathwaysDescription"),
                      icon: "Path",
                      link: { href: "/career-pathways", text: t("LandingPage.topToolPathwaysButtonText") },
                      theme: "purple",
                    },
                  ] as CardProps[]
                }
            />
            <Resources
                heading={t("LandingPage.resourcesHeading")}
                subheading={t("LandingPage.resourcesDescription")}
                items={[
                  { heading: t("LandingPage.resourcesCard1"), icon: "Briefcase", theme: "blue", link: { href: "/tools#jobs" } },
                  { heading: t("LandingPage.resourcesCard2"), icon: "Signpost", theme: "green", link: { href: "/tools#training" } },
                  { heading: t("LandingPage.resourcesCard3"), icon: "Path", theme: "purple", link: { href: "/tools#career" } },
                  { heading: t("LandingPage.resourcesCard4"), icon: "Lifebuoy", theme: "navy", link: { href: "/tools#resources" } },
                ]}
            />
          </div>
        </Layout>
      </>
  );
};