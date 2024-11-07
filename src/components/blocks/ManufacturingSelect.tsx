import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
import { Button } from "@components/modules/Button";
import { CareerMapProps, IndustryProps } from "@utils/types";
import { Flex } from "@components/utility/Flex";
import { Heading } from "@components/modules/Heading";
import { LearnMoreDrawer } from "@components/blocks/LearnMoreDrawer";
import { LinkObject } from "@components/modules/LinkObject";
import { SectionHeading } from "@components/modules/SectionHeading";

interface ManufacturingSelectProps {
  industry: IndustryProps;
  activeMap?: CareerMapProps;
  setOpen: (open: boolean) => void;
  setMapOpen: (open: boolean) => void;
  setActiveOccupation: (occupation: any) => void;
  setActivePathway: (pathway: any) => void;
  getCareerMap: (map: any) => void;
  setFullMap: (map: any) => void;
}

export const ManufacturingSelect = ({
  industry,
  activeMap,
  setOpen,
  setMapOpen,
  setActiveOccupation,
  setActivePathway,
  getCareerMap,
  setFullMap,
}: ManufacturingSelectProps) => {
  return (
    <section className="manufacturingSelect">
      <div className="container">
        <Flex direction="column" gap="xxl">
          <Breadcrumbs
            crumbs={[
              {
                copy: "Home",
                url: "/",
                sys: {
                  id: "home",
                },
              },
              {
                copy: "New Jersey Career Pathways",
                url: "/career-pathways",
                sys: {
                  id: "career-pathways",
                },
              },
            ]}
            pageTitle={`Select a ${industry.title} Field`}
          />
          <Flex direction="column" gap="xs" fill>
            <LinkObject url="/career-pathways" className="back">
              <ArrowLeft size={24} />
              Back
            </LinkObject>
            <SectionHeading
              headingLevel={1}
              noDivider
              heading={`Select a ${industry.title} Field`}
            />
            {industry.careerMaps && industry.careerMaps.items.length > 0 && (
              <Flex className="cards" fill>
                {industry.careerMaps.items.map((map, index) => (
                  <Flex
                    direction="column"
                    fill
                    key={map.sys.id}
                    gap="xs"
                    className="card"
                  >
                    <Heading level={2}>{map.title}</Heading>
                    <p>{`Explore ${map.title} pathways in the field of ${industry.title} in the state of New Jersey.`}</p>
                    <div className="buttons">
                      <Button
                        info
                        className={`radio-button${
                          activeMap?.careerMap.title === map.title
                            ? " active"
                            : ""
                        }`}
                        type="button"
                        iconWeight={
                          activeMap?.careerMap.title === map.title
                            ? "fill"
                            : "regular"
                        }
                        iconPrefix={
                          activeMap?.careerMap.title === map.title
                            ? "RadioButton"
                            : "Circle"
                        }
                        onClick={() => {
                          setOpen(false);
                          setMapOpen(false);
                          setActiveOccupation(undefined);
                          setActivePathway(undefined);
                          getCareerMap(map.sys.id);
                          setFullMap(undefined);
                        }}
                      >
                        <span>
                          <span>Select </span>
                          {map.title}
                        </span>
                      </Button>
                      {map.learnMoreBoxes?.length > 0 && (
                        <LearnMoreDrawer map={map} />
                      )}
                    </div>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        </Flex>
      </div>
    </section>
  );
};
