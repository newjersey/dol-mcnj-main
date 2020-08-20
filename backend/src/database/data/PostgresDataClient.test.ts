import {PostgresDataClient} from "./PostgresDataClient";
import {Error} from "../../domain/Error";

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
      "This program is designed for clients who are interested in learning skills necessary " +
      "for todays modern tree identification jobs. Students will learn to distinguish types of trees by " +
      "their leaves and bark and seeds.",
    calendarlengthid: "6",
    providername: "Vineland Public Schools Adult Education Program",
    providerid: "123",
    totalcost: "3035",
    website: "www.vineland.org/adulted",
    street1: "48 W. Landis Ave.",
    street2: null,
    city: "Vineland",
    state: "NJ",
    zip: "08360",
    indemandcip: "123456",
    peremployed2: "0.661016949152542",
    avgquarterlywage2: "16166",
    onlineprogramid: "1"
  };

  describe('findProgramsByIds', () => {
    it("finds programs by list of ids", async () => {
      const programs = await dataClient.findProgramsByIds(["1", "2"]);
      expect(programs.length).toEqual(2);
      expect(programs[0]).toEqual(testProgram1);
      expect(programs.map((it) => it.officialname)).toEqual(
        expect.arrayContaining(["Tree Identification Class", "Tree Identification Class Level 2"])
      );
    });

    it("does not return programs with status as not Approved", async () => {
      const programs = await dataClient.findProgramsByIds(["1", "3"]);
      expect(programs.length).toEqual(1);
      expect(programs[0].programid).toEqual('1');
    });

    it("does not return programs with provider status as not Approved", async () => {
      const programs = await dataClient.findProgramsByIds(["1", "4"]);
      expect(programs.length).toEqual(1);
      expect(programs[0].programid).toEqual('1');
    });

    it("preserves order of input list of ids", async () => {
      const programs = await dataClient.findProgramsByIds(["2", "1"]);
      expect(programs.length).toEqual(2);
      expect(programs[0].officialname).toEqual("Tree Identification Class Level 2");
      expect(programs[1].officialname).toEqual("Tree Identification Class");
    });

    it("returns empty when id list is empty", async () => {
      const programs = await dataClient.findProgramsByIds([]);
      expect(programs).toHaveLength(0);
    });

    it("throws with a not found error if called with one id that does not exist", (done) => {
      dataClient.findProgramsByIds(['doesnotexist'])
        .catch((e) => {
          expect(e).toEqual(Error.NOT_FOUND)
          done();
        })
    });
  })

  describe('getLocalExceptions', () => {
    it('gets cips and counties with local waiver exceptions', async () => {
      const localExceptions = await dataClient.getLocalExceptions()
      expect(localExceptions).toEqual([
        {
          cipcode: "123456",
          county: "ATLANTIC"
        },
        {
          cipcode: "123456",
          county: "MIDDLESEX"
        }
      ])
    })
  })

  describe('findOccupationTitlesByCip', () => {
    it('gets occupation information for a cip code', async () => {
      const occupationTitles = await dataClient.findOccupationTitlesByCip('987654')
      expect(occupationTitles).toEqual([
        {
          soc: "11-1011",
          soctitle: "Botanists"
        },
        {
          soc: "12-1011",
          soctitle: "Chefs"
        }
      ])
    })
  })

  describe('findOccupationTitleBySoc', () => {
    it('gets occupation information for a soc code', async () => {
      const occupationTitle = await dataClient.findOccupationTitleBySoc('11-0000')
      expect(occupationTitle).toEqual({
        soc: "11-0000",
        soctitle: "Agriculture Occupations"
      })
    })
  })

  describe('getInDemandOccupationTitles', () => {
    it('gets the list of in-demand SOCs and looks up their titles', async () => {
      const inDemandOccupations = await dataClient.getInDemandOccupationTitles();
      expect(inDemandOccupations).toEqual(expect.arrayContaining([
        {
          soc: "11-1011",
          soctitle: "Botanist Specialists"
        },
        {
          soc: "13-1081",
          soctitle: "Logisticians"
        },
        {
          soc: "old 2010 soc",
          soctitle: null
        }
      ]));
    })
  })

  describe('find2018OccupationTitleBySoc2010', () => {
    it('gets the list 2018 occupations for a 2010 soc', async () => {
      const soc2018s = await dataClient.find2018OccupationTitlesBySoc2010('15-1134');
      expect(soc2018s).toEqual(expect.arrayContaining([
        {
          soc: "15-1254",
          soctitle: "Web Developers"
        },
        {
          soc: "15-1255",
          soctitle: "Web and Digital Interface Designers (##)"
        }
      ]));
    })
  })

  afterAll(async () => {
    await dataClient.disconnect();
  });
});
