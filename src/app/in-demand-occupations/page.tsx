import { OccupationList } from "@components/blocks/OccupationList";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import globalOgImage from "@images/globalOgImage.jpeg";
import { IN_DEMAND_OCCUPATIONS_PAGE_DATA as pageData } from "@data/pages/in-demand-occupations";

async function getData() {
  const occupationItems = await fetch(
    `${process.env.REACT_APP_API_URL}/api/occupations`
  );

  return {
    occupationItems,
  };
}

export const revalidate = 1800;

export async function generateMetadata({}) {
  return {
    title: pageData.seo.title,
    openGraph: {
      images: [globalOgImage.src],
    },
    description: pageData.seo.pageDescription,
  };
}

interface OccupationProps {
  soc: string;
  title: string;
  majorGroup: string;
  counties: string[];
}

export default async function IndemandOccupationsPage() {
  const { occupationItems } = await getData();
  const occupations: OccupationProps[] = await occupationItems.json();

  // group by major group in an array of objects that look like this: {title: }
  const majorGroups = occupations.reduce((acc, occupation) => {
    const { majorGroup } = occupation;
    if (!acc[majorGroup]) {
      acc[majorGroup] = [];
    }
    acc[majorGroup].push(occupation);
    return acc;
  }, {} as { [key: string]: OccupationProps[] });

  const suggestions = occupations.map((occupation) => {
    return {
      soc: occupation.soc,
      title: occupation.title,
      majorGroup: occupation.majorGroup,
      counties: occupation.counties,
    };
  });

  return (
    <div className="page inDemandList">
      <section className="hero">
        <div className="container">
          <Breadcrumbs {...pageData.hero.breadcrumbs} />
          <Heading {...pageData.hero.heading} />
          <p>{pageData.hero.message}</p>
        </div>
      </section>
      <section className="listBlock">
        <div className="container">
          <OccupationList items={majorGroups} suggestions={suggestions} />
        </div>
      </section>
    </div>
  );
}
