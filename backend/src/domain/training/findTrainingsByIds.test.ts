/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { FindTrainingsByIds } from "../types";
import { CalendarLength } from "../CalendarLength";
import { findTrainingsByIdsFactory } from "./findTrainingsByIds";
import { StubDataClient } from "../test-objects/StubDataClient";
import { buildLocalException, buildOccupationTitle, buildProgram } from "../test-objects/factories";

describe("findTrainingsByIds", () => {
  let findTrainingsByIds: FindTrainingsByIds;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    jest.resetAllMocks();
    stubDataClient = StubDataClient();
    findTrainingsByIds = findTrainingsByIdsFactory(stubDataClient);
    stubDataClient.getLocalExceptions.mockResolvedValue([]);
    stubDataClient.findOccupationTitlesByCip.mockResolvedValue([]);
  });

  it("finds training by one id", async () => {
    const program = buildProgram({
      programid: "123",
      cipcode: "123456",
      indemandcip: "123456",
      onlineprogramid: "123",
    });
    stubDataClient.findProgramsByIds.mockResolvedValue([program]);
    stubDataClient.findOccupationTitlesByCip.mockResolvedValue([
      buildOccupationTitle({ soctitle: "some job" }),
      buildOccupationTitle({ soctitle: "some other job" }),
    ]);
    stubDataClient.getLocalExceptions.mockResolvedValue([
      buildLocalException({ cipcode: program.cipcode, county: "Atlantic" }),
    ]);

    expect(await findTrainingsByIds(["123"])).toEqual([
      {
        id: program.programid,
        name: program.officialname,
        provider: {
          name: program.providername,
          id: program.providerid,
          url: program.website,
          contactName: program.contactfirstname + " " + program.contactlastname,
          contactTitle: program.contacttitle,
          phoneNumber: program.phone,
          phoneExtension: program.phoneextension,
          county: program.county + " County",
          address: {
            street1: program.street1,
            street2: program.street2,
            city: program.city,
            state: program.state,
            zipCode: program.zip,
          },
        },
        description: program.description,
        calendarLength: parseInt(program.calendarlengthid!),
        occupations: ["some job", "some other job"],
        inDemand: true,
        localExceptionCounty: ["Atlantic"],
        tuitionCost: parseFloat(program.tuition),
        feesCost: parseFloat(program.fees),
        booksMaterialsCost: parseFloat(program.booksmaterialscost),
        suppliesToolsCost: parseFloat(program.suppliestoolscost),
        otherCost: parseFloat(program.othercosts),
        totalCost: parseFloat(program.totalcost),
        online: true,
        percentEmployed: parseFloat(program.peremployed2!),
        averageSalary: parseFloat(program.avgquarterlywage2!) * 4,
      },
    ]);
  });

  it("finds many trainings by many ids", async () => {
    const program1 = buildProgram({});
    const program2 = buildProgram({});

    stubDataClient.findProgramsByIds.mockResolvedValue([program1, program2]);

    stubDataClient.findOccupationTitlesByCip
      .mockResolvedValueOnce([buildOccupationTitle({ soctitle: "occupation 1" })])
      .mockResolvedValueOnce([buildOccupationTitle({ soctitle: "occupation 2" })]);

    stubDataClient.getLocalExceptions
      .mockResolvedValueOnce([
        buildLocalException({ cipcode: program1.cipcode, county: "Atlantic" }),
      ])
      .mockResolvedValueOnce([
        buildLocalException({ cipcode: program2.cipcode, county: "Pacific" }),
      ]);

    const [training1, training2] = await findTrainingsByIds([
      program1.programid,
      program2.programid,
    ]);
    expect(training1.id).toEqual(program1.programid);
    expect(training1.name).toEqual(program1.officialname);
    expect(training1.occupations).toEqual(["occupation 1"]);
    expect(training1.localExceptionCounty).toEqual(["Atlantic"]);

    expect(training2.id).toEqual(program2.programid);
    expect(training2.name).toEqual(program2.officialname);
    expect(training2.occupations).toEqual(["occupation 2"]);
    expect(training2.localExceptionCounty).toEqual(["Pacific"]);
  });

  it("finds empty trainings by empty ids", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([]);
    expect(await findTrainingsByIds([])).toEqual([]);
  });

  it("lists matching occupation titles for a training", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([buildProgram({})]);
    stubDataClient.findOccupationTitlesByCip.mockResolvedValue([
      buildOccupationTitle({ soctitle: "chemists" }),
      buildOccupationTitle({ soctitle: "astrophysicists" }),
    ]);

    const training = await findTrainingsByIds(["123"]);
    expect(training[0].occupations).toEqual(["chemists", "astrophysicists"]);
  });

  it("replaces missing data with empty values", async () => {
    const program = buildProgram({
      programid: "123",
      providername: null,
      calendarlengthid: null,
      website: null,
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
      contactfirstname: null,
      contactlastname: null,
      contacttitle: null,
      phone: null,
      phoneextension: null,
      indemandcip: null,
      peremployed2: null,
      avgquarterlywage2: null,
      onlineprogramid: null,
    });
    stubDataClient.findProgramsByIds.mockResolvedValue([program]);

    const [training] = await findTrainingsByIds(["123"]);

    expect(training.calendarLength).toEqual(CalendarLength.NULL);
    expect(training.provider.url).toEqual("");
    expect(training.provider.name).toEqual("");
    expect(training.provider.address.street1).toEqual("");
    expect(training.provider.address.street2).toEqual("");
    expect(training.provider.address.city).toEqual("");
    expect(training.provider.address.state).toEqual("");
    expect(training.provider.address.zipCode).toEqual("");
    expect(training.provider.contactName).toEqual("");
    expect(training.provider.contactTitle).toEqual("");
    expect(training.provider.phoneNumber).toEqual("");
    expect(training.provider.phoneExtension).toEqual("");
    expect(training.inDemand).toEqual(false);
    expect(training.percentEmployed).toEqual(null);
    expect(training.averageSalary).toEqual(null);
    expect(training.online).toEqual(false);
  });

  it("returns null if percent employed is -99999", async () => {
    const program = buildProgram({
      programid: "123",
      peremployed2: "-99999",
    });
    stubDataClient.findProgramsByIds.mockResolvedValue([program]);
    const [training] = await findTrainingsByIds(["123"]);
    expect(training.percentEmployed).toEqual(null);
  });

  it("creates yearly salary by multiplying quarterly wage by 4", async () => {
    const program = buildProgram({
      programid: "123",
      avgquarterlywage2: "25000",
    });
    stubDataClient.findProgramsByIds.mockResolvedValue([program]);
    const [training] = await findTrainingsByIds(["123"]);
    expect(training.averageSalary).toEqual(100000);
  });

  it("strips surrounding quotation marks from title/description/more of training", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({
        officialname: '"Some Name with Quotes"',
        description: '"Some Name with Quotes"',
        providername: '"Some Name with Quotes"',
        street1: '"Some Name with Quotes"',
        street2: '"Some Name with Quotes"',
        contactfirstname: '"Some Name"',
        contactlastname: '"with Quotes"',
        contacttitle: '"Some Name with Quotes"',
      }),
    ]);

    let foundTraining = (await findTrainingsByIds(["123"]))[0];

    expect(foundTraining.name).toEqual("Some Name with Quotes");
    expect(foundTraining.description).toEqual("Some Name with Quotes");
    expect(foundTraining.provider.name).toEqual("Some Name with Quotes");
    expect(foundTraining.provider.address.street1).toEqual("Some Name with Quotes");
    expect(foundTraining.provider.address.street2).toEqual("Some Name with Quotes");
    expect(foundTraining.provider.contactName).toEqual("Some Name with Quotes");
    expect(foundTraining.provider.contactTitle).toEqual("Some Name with Quotes");

    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({
        officialname: "Some Name without Quotes",
        description: "Some Name without Quotes",
        providername: "Some Name without Quotes",
        street1: "Some Name without Quotes",
        street2: "Some Name without Quotes",
        contactfirstname: "Some Name",
        contactlastname: "without Quotes",
        contacttitle: "Some Name without Quotes",
      }),
    ]);

    foundTraining = (await findTrainingsByIds(["123"]))[0];
    expect(foundTraining.name).toEqual("Some Name without Quotes");
    expect(foundTraining.description).toEqual("Some Name without Quotes");
    expect(foundTraining.provider.name).toEqual("Some Name without Quotes");
    expect(foundTraining.provider.address.street1).toEqual("Some Name without Quotes");
    expect(foundTraining.provider.address.street2).toEqual("Some Name without Quotes");
    expect(foundTraining.provider.contactName).toEqual("Some Name without Quotes");
    expect(foundTraining.provider.contactTitle).toEqual("Some Name without Quotes");

    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({
        officialname: '"Quotes "in the" middle too"',
        description: '"Quotes "in the" middle too"',
        providername: '"Quotes "in the" middle too"',
        street1: '"Quotes "in the" middle too"',
        street2: '"Quotes "in the" middle too"',
        contactfirstname: '"Quotes "in" the"',
        contactlastname: 'the "middle" too',
        contacttitle: '"Quotes "in the" middle too"',
      }),
    ]);

    foundTraining = (await findTrainingsByIds(["123"]))[0];
    expect(foundTraining.name).toEqual('Quotes "in the" middle too');
    expect(foundTraining.description).toEqual('Quotes "in the" middle too');
    expect(foundTraining.provider.name).toEqual('Quotes "in the" middle too');
    expect(foundTraining.provider.address.street1).toEqual('Quotes "in the" middle too');
    expect(foundTraining.provider.address.street2).toEqual('Quotes "in the" middle too');
    expect(foundTraining.provider.contactName).toEqual('Quotes "in" the the "middle" too');
    expect(foundTraining.provider.contactTitle).toEqual('Quotes "in the" middle too');

    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({
        officialname: '"""Lots of Quotes"""',
        description: '"""Lots of Quotes"""',
        providername: '"""Lots of Quotes"""',
        street1: '"""Lots of Quotes"""',
        street2: '"""Lots of Quotes"""',
        contactfirstname: '"""Lots of"""',
        contactlastname: '"""Quotes"""',
        contacttitle: '"""Lots of Quotes"""',
      }),
    ]);

    foundTraining = (await findTrainingsByIds(["123"]))[0];
    expect(foundTraining.name).toEqual("Lots of Quotes");
    expect(foundTraining.description).toEqual("Lots of Quotes");
    expect(foundTraining.provider.name).toEqual("Lots of Quotes");
    expect(foundTraining.provider.address.street1).toEqual("Lots of Quotes");
    expect(foundTraining.provider.address.street2).toEqual("Lots of Quotes");
    expect(foundTraining.provider.contactName).toEqual("Lots of Quotes");
    expect(foundTraining.provider.contactTitle).toEqual("Lots of Quotes");
  });

  it("title cases the local exception county", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([buildProgram({ cipcode: "123" })]);

    stubDataClient.getLocalExceptions.mockResolvedValue([
      buildLocalException({ cipcode: "123", county: "ATLANTIC" }),
    ]);
    expect((await findTrainingsByIds(["123"]))[0].localExceptionCounty).toEqual(["Atlantic"]);

    stubDataClient.getLocalExceptions.mockResolvedValue([
      buildLocalException({ cipcode: "123", county: "ATLANTIC COUNTY" }),
    ]);
    expect((await findTrainingsByIds(["123"]))[0].localExceptionCounty).toEqual([
      "Atlantic County",
    ]);

    stubDataClient.getLocalExceptions.mockResolvedValue([
      buildLocalException({ cipcode: "123", county: "ATLANTIC" }),
      buildLocalException({ cipcode: "123", county: "MIDDLESEX" }),
    ]);
    expect((await findTrainingsByIds(["123"]))[0].localExceptionCounty).toEqual([
      "Atlantic",
      "Middlesex",
    ]);

    stubDataClient.getLocalExceptions.mockResolvedValue([]);
    expect((await findTrainingsByIds(["123"]))[0].localExceptionCounty).toEqual([]);
  });

  it("title cases program names if they are all caps", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({
        officialname: "MY VERY COOL PROGRAM",
      }),
    ]);

    expect((await findTrainingsByIds(["123"]))[0].name).toEqual("My Very Cool Program");

    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({
        officialname: "My very cool program",
      }),
    ]);

    expect((await findTrainingsByIds(["123"]))[0].name).toEqual("My very cool program");
  });

  it("strips unicode inverted question marks from descriptions", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([
      buildProgram({ description: "some ¿weird¿ character" }),
    ]);

    expect((await findTrainingsByIds(["123"]))[0].description).toEqual("some weird character");
  });

  it("appends `County` to the county", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([buildProgram({ county: "Atlantic" })]);

    expect((await findTrainingsByIds(["123"]))[0].provider.county).toEqual("Atlantic County");
  });

  it("replaces `Select One` county with empty string", async () => {
    stubDataClient.findProgramsByIds.mockResolvedValue([buildProgram({ county: "Select One" })]);

    expect((await findTrainingsByIds(["123"]))[0].provider.county).toEqual("");
  });

  describe("error handling", () => {
    it("rejects when find by ids is broken", (done) => {
      stubDataClient.findProgramsByIds.mockRejectedValue({});
      findTrainingsByIds(["id"]).catch(() => done());
    });

    it("rejects when local exception lookup is broken", (done) => {
      stubDataClient.findProgramsByIds.mockResolvedValue([buildProgram({})]);
      stubDataClient.getLocalExceptions.mockRejectedValue({});
      findTrainingsByIds(["id"]).catch(() => done());
    });

    it("rejects when occupation title lookup is broken", (done) => {
      stubDataClient.findProgramsByIds.mockResolvedValue([buildProgram({})]);
      stubDataClient.findOccupationTitlesByCip.mockRejectedValue({});
      findTrainingsByIds(["id"]).catch(() => done());
    });
  });
});
