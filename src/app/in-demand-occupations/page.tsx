import { OccupationList } from "@components/blocks/OccupationList";
import { MainLayout } from "@components/global/MainLayout";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Heading } from "@components/modules/Heading";
import { LinkObject } from "@components/modules/LinkObject";
import { getNav } from "@utils/getNav";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const occupationItems = await fetch(
    `${process.env.REACT_APP_API_URL}/api/occupations`,
  );

  return {
    occupationItems,
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };
}

export const revalidate = 1800;

export async function generateMetadata({}) {
  return {
    title: `In-Demand Occupations | ${process.env.REACT_APP_SITE_NAME}`,
    openGraph: {
      images: [globalOgImage.src],
    },
    description:
      "This is a list of occupations expected to have the most openings in the future in the State of New Jersey. Trainings related to careers on this list can be eligible for funding by the state. Some occupations qualify for local and region waivers and are noted below.",
  };
}

interface OccupationProps {
  soc: string;
  title: string;
  majorGroup: string;
  counties: string[];
}

export default async function IndemandOccupationsPage() {
  const { footerNav1, footerNav2, mainNav, globalNav, occupationItems } =
    await getData();
  const occupations: OccupationProps[] = await occupationItems.json();

  // group by major group in an array of objects that look like this: {title: }
  const majorGroups = occupations.reduce(
    (acc, occupation) => {
      const { majorGroup } = occupation;
      if (!acc[majorGroup]) {
        acc[majorGroup] = [];
      }
      acc[majorGroup].push(occupation);
      return acc;
    },
    {} as { [key: string]: OccupationProps[] },
  );

  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };

  const suggestions = occupations.map((occupation) => {
    return {
      soc: occupation.soc,
      title: occupation.title,
      majorGroup: occupation.majorGroup,
      counties: occupation.counties,
    };
  });

  return (
    <MainLayout {...navs}>
      <div className="page inDemandList">
        <section className="hero">
          <div className="container">
            <Breadcrumbs
              pageTitle="In-Demand Occupation"
              crumbs={[{ copy: "Home", url: "/" }]}
            />
            <Heading level={1}>In-Demand Occupation List</Heading>
            <p>
              This is a list of occupations expected to have the most openings
              in the future in the State of New Jersey. Trainings related to
              careers on this list can be eligible for funding by the state.
              Some occupations qualify for local and region waivers and are
              noted below.
            </p>
          </div>
        </section>
        <section className="listBlock">
          <div className="container">
            <OccupationList items={majorGroups} suggestions={suggestions} />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
