import { Helmet } from "react-helmet-async";
import { SeoProps } from "../types/contentful";

export const Seo = (props: SeoProps) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      {props.pageDescription && <meta name="description" content={props.pageDescription} />}
      {props.keywords && <meta name="keywords" content={props.keywords.join(",")} />}
      <meta property="og:title" content={props.title} />
      {props.pageDescription && <meta property="og:description" content={props.pageDescription} />}
      {props.ogImage?.url && <meta property="og:image" content={props.ogImage?.url} />}
      {props.image && !props.ogImage?.url && <meta property="og:image" content={props.image} />}
      <meta property="og:type" content="website" />
      {props.url && <meta property="og:url" content={`https://mycareer.nj.gov${props.url}`} />}
      <meta property="og:site_name" content="My Career NJ" />
    </Helmet>
  );
};
