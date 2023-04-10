import { PostgresDataClient } from "./PostgresDataClient";
import { Selector } from "../../domain/training/Selector";
import { Error } from "../../domain/Error";

describe("PostgresDataClient", () => {
  let dataClient: PostgresDataClient;

  beforeAll(async () => {
    const connection = {
      user: "postgres",
      host: "localhost",
      database: "d4adtest",
      password: "",
      port: 5432,
    };
    dataClient = new PostgresDataClient(connection);
  });

  const testProgram1 = {
    programid: "1",
    cipcode: "123456",
    officialname: "Tree Identification Class",
    description:
      "Standardized This program is designed for clients who are interested in learning skills necessary " +
      "for todays modern tree identification jobs. Students will learn to distinguish types of trees by " +
      "their leaves and bark and seeds.",
    industrycredentialname: "tree identifier",
    prerequisites: "High School Diploma/G.E.D. or Ability To Benefit",
    calendarlengthid: "6",
    providername: "Standardized Vineland Public Schools",
    providerid: "123",
    tuition: "3000",
    fees: "35",
    booksmaterialscost: "0",
    suppliestoolscost: "0",
    othercosts: "0",
    totalcost: "3035",
    website: "www.vineland.org/adulted",
    street1: "48 W. Landis Ave.",
    street2: null,
    city: "Vineland",
    state: "NJ",
    zip: "8360",
    county: "Cumberland",
    contactfirstname: "Gloria",
    contactlastname: "Kucher",
    contacttitle: "Principal",
    phone: "8567946943",
    phoneextension: "8950",
    indemandcip: "123456",
    peremployed2: "0.661016949152542",
    avgquarterlywage2: "16166",
    onlineprogramid: "1",
    eveningcourses: "1",
    languages: null,
    accessfordisabled: "1",
    personalassist: "2",
    childcare: "2",
    assistobtainingchildcare: "1",
  };

  describe("findProgramsBy", () => {
    it("finds programs by list of ids", async () => {
      const programs = await dataClient.findProgramsBy(Selector.ID, ["1", "2"]);
      expect(programs.length).toEqual(2);
      expect(programs[0]).toEqual(testProgram1);
      expect(programs.map((it) => it.officialname)).toEqual(
        expect.arrayContaining([
          "Tree Identification Class",
          "Tree Identification Class Level 2",
        ])
      );
    });

    it("finds programs by list of cip codes", async () => {
      const programs = await dataClient.findProgramsBy(Selector.CIP_CODE, ["123456", "000000"]);
      expect(programs.length).toEqual(2);
      expect(programs[0]).toEqual(testProgram1);
      expect(programs.map((it) => it.officialname)).toEqual(
        expect.arrayContaining([
          "Tree Identification Class",
          "Tree Identification Class Level 2",
        ])
      );
    });

    it("does not return programs with status as not Approved", async () => {
      const programs = await dataClient.findProgramsBy(Selector.ID, ["1", "3"]);
      expect(programs.length).toEqual(1);
      expect(programs[0].programid).toEqual("1");
    });

    it("does not return programs with provider status as not Approved", async () => {
      const programs = await dataClient.findProgramsBy(Selector.ID, ["1", "4"]);
      expect(programs.length).toEqual(1);
      expect(programs[0].programid).toEqual("1");
    });

    it("preserves order of input list of ids", async () => {
      const programs = await dataClient.findProgramsBy(Selector.ID, ["2", "1"]);
      expect(programs.length).toEqual(2);
      expect(programs[0].officialname).toEqual("Tree Identification Class Level 2");
      expect(programs[1].officialname).toEqual("Tree Identification Class");
    });

    it("returns empty when list is empty", async () => {
      const programs = await dataClient.findProgramsBy(Selector.ID, []);
      expect(programs).toHaveLength(0);
    });

    it("returns empty if called with a cipcode selector that does not exist", async () => {
      const programs = await dataClient.findProgramsBy(Selector.CIP_CODE, ["doesnotexist"]);

      expect(programs).toHaveLength(0);
    });

    it("throws a not found error if called with a selector that does not exist", (done) => {
      dataClient.findProgramsBy(Selector.ID, ["doesnotexist"]).catch((e) => {
        expect(e).toEqual(Error.NOT_FOUND);
        done();
      });
    });
  });

  describe("getLocalExceptions", () => {
    it("gets cips and counties with local waiver exceptions", async () => {
      const localExceptions = await dataClient.getLocalExceptions();
      expect(localExceptions).toEqual([
        {
          cipcode: "123456",
          county: "ATLANTIC",
        },
        {
          cipcode: "123456",
          county: "MIDDLESEX",
        },
      ]);
    });
  });

  describe("findOccupationsByCip", () => {
    it("gets occupation information for a cip code", async () => {
      const occupations = await dataClient.findOccupationsByCip("987654");
      expect(occupations).toEqual([
        {
          soc: "11-1011",
          title: "Botanists",
        },
        {
          soc: "12-1011",
          title: "Chefs",
        },
      ]);
    });
  });

  describe("findSocDefinitionBySoc", () => {
    it("gets occupation information for a soc code", async () => {
      const socDefinition = await dataClient.findSocDefinitionBySoc("11-1011");
      expect(socDefinition).toEqual({
        soc: "11-1011",
        title: "Botanist Specialists",
        definition: "Do stuff related to plants",
      });
    });
  });

  describe("findCipDefinitionBySoc2018", () => {
    it("gets the list of 2020 cip codes for a 2018 soc code", async () => {
      const cips = await dataClient.findCipDefinitionBySoc2018("12-1011");

      expect(cips).toEqual([
        {
          cipcode: "121212",
          ciptitle: "Mushrooms",
        },
        {
          cipcode: "987654",
          ciptitle: "Vegetables",
        },
      ]);
    });
  });

  describe("getOccupationsInDemand", () => {
    it("gets the list of in-demand SOCs and looks up their titles", async () => {
      const inDemandOccupations = await dataClient.getOccupationsInDemand();
      expect(inDemandOccupations).toEqual(
        expect.arrayContaining([
          {
            soc: "11-1011",
            title: "Botanist Specialists",
          },
          {
            soc: "13-1081",
            title: "Logisticians",
          },
          {
            soc: "old 2010 soc",
            title: null,
          },
        ])
      );
    });
  });

  describe("find2018OccupationsBySoc2010", () => {
    it("gets the list 2018 occupations for a 2010 soc", async () => {
      const soc2018s = await dataClient.find2018OccupationsBySoc2010("15-1134");
      expect(soc2018s).toEqual(
        expect.arrayContaining([
          {
            soc: "15-1254",
            title: "Web Developers",
          },
          {
            soc: "15-1255",
            title: "Web and Digital Interface Designers",
          },
        ])
      );
    });
  });

  describe("find2010OccupationsBySoc2018", () => {
    it("gets the list 2010 occupations for a 2018 soc", async () => {
      const soc2010s = await dataClient.find2010OccupationsBySoc2018("15-1255");
      expect(soc2010s).toEqual(
        expect.arrayContaining([
          {
            soc: "15-1134",
            title: "Web Developers (#)",
          },
          {
            soc: "15-1199",
            title: "Computer Occupations, All Other (#)",
          },
        ])
      );
    });
  });

  describe("getEducationTextBySoc", () => {
    it("gets the occupation_summary_how_to_become_one for a given soc", async () => {
      const education = await dataClient.getEducationTextBySoc("15-2011");
      expect(education.howtobecomeone.replace(/\s+/g, " ").trim()).toEqual(
        "<h4>How to Become an Actuary</h4> " +
        "<p>Actuaries need a bachelor&rsquo;s degree and must pass a series of exams to become certified professionals. They must have a strong background in mathematics, statistics, and business.</p>"
      );
    });
  });

  describe("getSalaryEstimateBySoc", () => {
    it("gets the a_median for a given soc", async () => {
      const estimate = await dataClient.getSalaryEstimateBySoc("11-1021");
      expect(estimate.mediansalary).toEqual("138,010");
    });
  });

  describe("getOESOccupationBySoc", () => {
    it("gets the OES 2019 code from a soc 2018 code", async () => {
      const oesCode = await dataClient.getOESOccupationBySoc("15-1254");
      expect(oesCode).toEqual({
        soc: "15-1257",
        title: "Web Developers and Digital Interface Designers",
      });
    });
  });

  describe("getNeighboringOccupations", () => {
    it("gets occupations with a soc code matching first 5 digits of input not including itself", async () => {
      const neighboringOccupations = await dataClient.getNeighboringOccupations("15-1254");
      expect(neighboringOccupations).toEqual([
        {
          soc: "15-1253",
          title: "Software Quality Assurance Analysts and Testers",
        },
        {
          soc: "15-1255",
          title: "Web and Digital Interface Designers",
        },
      ]);
    });
  });

  afterAll(async () => {
    await dataClient.disconnect();
  });
});
