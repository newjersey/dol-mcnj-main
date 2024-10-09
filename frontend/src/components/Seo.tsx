import { Helmet } from "react-helmet-async";
import { SeoProps } from "../types/contentful";

export const Seo = (props: SeoProps) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      {props.pageDescription && (
        <>
          <meta name="description" content={props.pageDescription} />
          <meta name="twitter:description" content={props.pageDescription} />
        </>
      )}
      {props.keywords && <meta name="keywords" content={props.keywords.join(",")} />}
      <meta property="og:title" content={props.title} />
      <meta property="twitter:title" content={props.title} />
      <meta name="twitter:card" content="summary_large_image" />

      {props.pageDescription && <meta property="og:description" content={props.pageDescription} />}
      {props.ogImage?.url && (
        <>
          <meta property="og:image" content={props.ogImage?.url} />
          <meta property="twitter:image" content={props.ogImage?.url} />
        </>
      )}
      {props.image && !props.ogImage?.url && (
        <>
          <meta property="og:image" content={props.image} />
          <meta property="twitter:image" content={props.image} />
        </>
      )}
      <meta property="og:type" content="website" />
      {props.url && <meta property="og:url" content={`https://mycareer.nj.gov${props.url}`} />}
      <meta property="og:site_name" content={process.env.REACT_APP_SITE_NAME} />
    </Helmet>
  );
};
