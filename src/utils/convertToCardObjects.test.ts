// convertToCardObjects.test.ts
import { convertToCardObjects } from "./convertToCardObjects"; // Adjust the path accordingly
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { LinkProps } from "./types";

jest.mock("./capitalizeFirstLetter");
jest.mock("../components/svgs", () => ({
  ExploreBold: "ExploreBold",
  JobsBold: "JobsBold",
  SupportBold: "SupportBold",
  TrainingBold: "TrainingBold",
  Explore: "Explore",
  Jobs: "Jobs",
  Support: "Support",
  Training: "Training",
}));

describe("convertToCardObjects", () => {
  beforeEach(() => {
    (capitalizeFirstLetter as jest.Mock).mockImplementation(
      (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
    );
  });

  it("should convert linkObjects correctly when all fields are present", () => {
    const linkObjects: LinkProps[] = [
      {
        sys: { id: "1" },
        copy: "Explore",
        url: "/explore",
        icon: undefined,
        systemIcon: "explore",
        message: "Explore our services",
      },
      {
        sys: { id: "2" },
        copy: "Jobs",
        url: "/jobs",
        systemIcon: "jobs",
        icon: undefined,
        message: "Find a job",
      },
    ];

    const expected = [
      {
        sys: { id: "1" },
        title: "Explore",
        url: "/explore",
        svg: "explore",
        description: "Explore our services",
        icon: undefined,
      },
      {
        sys: { id: "2" },
        title: "Jobs",
        url: "/jobs",
        svg: "jobs",
        description: "Find a job",
        icon: undefined,
      },
    ];

    expect(convertToCardObjects(linkObjects)).toEqual(expected);
  });

  it("should handle missing optional fields correctly", () => {
    const linkObjects: LinkProps[] = [
      {
        sys: { id: "3" },
        copy: "Support",
        url: "/support",
        icon: undefined,
        systemIcon: "supportBold",
        message: "",
      },
    ];

    const expected = [
      {
        sys: { id: "3" },
        title: "Support",
        url: "/support",
        svg: "supportBold",
        description: "",
        icon: undefined,
      },
    ];

    expect(convertToCardObjects(linkObjects)).toEqual(expected);
  });

  it("should use linkObject.copy as sys.id if sys.id is missing", () => {
    const linkObjects: LinkProps[] = [
      {
        sys: undefined,
        copy: "Training",
        url: "/training",
        icon: undefined,
        systemIcon: "training",
        message: "Our training programs",
      },
    ];

    const expected = [
      {
        sys: { id: "Training" },
        title: "Training",
        url: "/training",
        svg: "training",
        description: "Our training programs",
        icon: undefined,
      },
    ];

    expect(convertToCardObjects(linkObjects)).toEqual(expected);
  });

  it("should handle case when both icon and systemIcon are missing", () => {
    const linkObjects: LinkProps[] = [
      {
        sys: { id: "4" },
        copy: "Jobs",
        url: "/jobs",
        icon: undefined,
        systemIcon: undefined,
        message: "Find a job",
      },
    ];

    const expected = [
      {
        sys: { id: "4" },
        title: "Jobs",
        url: "/jobs",
        svg: undefined, // No matching icon
        description: "Find a job",
        icon: undefined,
      },
    ];

    expect(convertToCardObjects(linkObjects)).toEqual(expected);
  });
});
