"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCalendarLengthId = exports.randomCalendarLength = exports.buildLocalException = exports.buildCipDefinition = exports.buildNullableOccupation = exports.buildSocDefinition = exports.buildProgram = exports.buildOccupationDetailPartial = exports.buildOccupationDetail = exports.buildInDemandOccupation = exports.buildOccupation = exports.buildAddress = exports.buildProvider = exports.buildTraining = exports.buildTrainingResult = exports.randomBool = exports.randomInt = void 0;
const CalendarLength_1 = require("../CalendarLength");
const randomInt = () => Math.floor(Math.random() * Math.floor(10000000));
exports.randomInt = randomInt;
const randomBool = () => !!Math.round(Math.random());
exports.randomBool = randomBool;
const buildTrainingResult = (overrides) => {
    return Object.assign({ id: "some-id-" + (0, exports.randomInt)(), name: "some-name-" + (0, exports.randomInt)(), cipDefinition: {
            cipcode: "some-cipcode-" + (0, exports.randomInt)(),
            ciptitle: "some-ciptitle-" + (0, exports.randomInt)(),
        }, totalCost: (0, exports.randomInt)(), percentEmployed: (0, exports.randomInt)(), calendarLength: (0, exports.randomCalendarLength)(), totalClockHours: (0, exports.randomInt)(), inDemand: (0, exports.randomBool)(), online: (0, exports.randomBool)(), localExceptionCounty: [], highlight: "some-hightlight-" + (0, exports.randomInt)(), rank: (0, exports.randomInt)(), city: "some-city-" + (0, exports.randomInt)(), zipCode: "some-zipcode-" + (0, exports.randomInt)(), county: "some-county-" + (0, exports.randomInt)(), providerId: "some-id-" + (0, exports.randomInt)(), providerName: "some-provider-name-" + (0, exports.randomInt)(), socCodes: ["some-soc-" + (0, exports.randomInt)()], hasEveningCourses: (0, exports.randomBool)(), languages: ["some-language-" + (0, exports.randomInt)()], isWheelchairAccessible: (0, exports.randomBool)(), hasJobPlacementAssistance: (0, exports.randomBool)(), hasChildcareAssistance: (0, exports.randomBool)() }, overrides);
};
exports.buildTrainingResult = buildTrainingResult;
const buildTraining = (overrides) => {
    return Object.assign({ id: "some-id-" + (0, exports.randomInt)(), name: "some-name-" + (0, exports.randomInt)(), cipDefinition: {
            cipcode: "some-cipcode-" + (0, exports.randomInt)(),
            ciptitle: "some-ciptitle-" + (0, exports.randomInt)(),
        }, provider: (0, exports.buildProvider)({}), description: "some-description-" + (0, exports.randomInt)(), certifications: "some-certifications-" + (0, exports.randomInt)(), prerequisites: "some-certifications-" + (0, exports.randomInt)(), occupations: [(0, exports.buildOccupation)({})], calendarLength: (0, exports.randomCalendarLength)(), totalClockHours: (0, exports.randomInt)(), inDemand: (0, exports.randomBool)(), localExceptionCounty: [], tuitionCost: (0, exports.randomInt)(), feesCost: (0, exports.randomInt)(), booksMaterialsCost: (0, exports.randomInt)(), suppliesToolsCost: (0, exports.randomInt)(), otherCost: (0, exports.randomInt)(), totalCost: (0, exports.randomInt)(), online: (0, exports.randomBool)(), percentEmployed: (0, exports.randomInt)(), averageSalary: (0, exports.randomInt)(), hasEveningCourses: (0, exports.randomBool)(), languages: ["some-language-" + (0, exports.randomInt)()], isWheelchairAccessible: (0, exports.randomBool)(), hasJobPlacementAssistance: (0, exports.randomBool)(), hasChildcareAssistance: (0, exports.randomBool)() }, overrides);
};
exports.buildTraining = buildTraining;
const buildProvider = (overrides) => {
    return Object.assign({ id: "some-id-" + (0, exports.randomInt)(), url: "some-url-" + (0, exports.randomInt)(), address: (0, exports.buildAddress)({}), name: "some-name-" + (0, exports.randomInt)(), contactName: "some-contactName-" + (0, exports.randomInt)(), contactTitle: "some-contactTitle-" + (0, exports.randomInt)(), phoneNumber: "some-phoneNumber-" + (0, exports.randomInt)(), phoneExtension: "some-phoneExtension-" + (0, exports.randomInt)(), county: "some-county-" + (0, exports.randomInt)() }, overrides);
};
exports.buildProvider = buildProvider;
const buildAddress = (overrides) => {
    return Object.assign({ street1: "some-street1-" + (0, exports.randomInt)(), street2: "some-street2-" + (0, exports.randomInt)(), city: "some-city-" + (0, exports.randomInt)(), state: "some-state-" + (0, exports.randomInt)(), zipCode: "some-zipCode-" + (0, exports.randomInt)() }, overrides);
};
exports.buildAddress = buildAddress;
const buildOccupation = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)() }, overrides);
};
exports.buildOccupation = buildOccupation;
const buildInDemandOccupation = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)(), majorGroup: "some-group-" + (0, exports.randomInt)() }, overrides);
};
exports.buildInDemandOccupation = buildInDemandOccupation;
const buildOccupationDetail = (overrides) => {
    return Object.assign({ soc: "some-soc-code-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)(), description: "some-description-" + (0, exports.randomInt)(), tasks: ["some-tasks-" + (0, exports.randomInt)()], education: "some-education-" + (0, exports.randomInt)(), inDemand: (0, exports.randomBool)(), counties: [], medianSalary: (0, exports.randomInt)(), openJobsCount: (0, exports.randomInt)(), relatedOccupations: [(0, exports.buildOccupation)({})], relatedTrainings: [(0, exports.buildTrainingResult)({})] }, overrides);
};
exports.buildOccupationDetail = buildOccupationDetail;
const buildOccupationDetailPartial = (overrides) => {
    return Object.assign({ soc: "some-soc-code-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)(), description: "some-description-" + (0, exports.randomInt)(), tasks: ["some-tasks-" + (0, exports.randomInt)()], relatedOccupations: [(0, exports.buildOccupation)({})] }, overrides);
};
exports.buildOccupationDetailPartial = buildOccupationDetailPartial;
const buildProgram = (overrides) => {
    return Object.assign({ programid: "some-programid-" + (0, exports.randomInt)(), cipcode: "some-cipcode-" + (0, exports.randomInt)(), ciptitle: "some-ciptitle-" + (0, exports.randomInt)(), officialname: "some-officialname-" + (0, exports.randomInt)(), description: "some-description-" + (0, exports.randomInt)(), industrycredentialname: "tree identifier", prerequisites: "High School Diploma/G.E.D. or Ability To Benefit", providerid: "some-providerid-" + (0, exports.randomInt)(), tuition: (0, exports.randomInt)().toString(), fees: (0, exports.randomInt)().toString(), booksmaterialscost: (0, exports.randomInt)().toString(), suppliestoolscost: (0, exports.randomInt)().toString(), othercosts: (0, exports.randomInt)().toString(), totalcost: (0, exports.randomInt)().toString(), providername: "some-providername-" + (0, exports.randomInt)(), calendarlengthid: (0, exports.randomCalendarLengthId)(), totalclockhours: (0, exports.randomInt)().toString(), website: "some-website-" + (0, exports.randomInt)(), street1: "some-street1-" + (0, exports.randomInt)(), street2: "some-street2-" + (0, exports.randomInt)(), city: "some-city-" + (0, exports.randomInt)(), state: "some-state-" + (0, exports.randomInt)(), zip: "some-zip-" + (0, exports.randomInt)(), county: "some-county-" + (0, exports.randomInt)(), contactfirstname: "some-contactfirstname-" + (0, exports.randomInt)(), contactlastname: "some-contactlastname-" + (0, exports.randomInt)(), contacttitle: "some-contacttitle-" + (0, exports.randomInt)(), phone: "some-phone-" + (0, exports.randomInt)(), phoneextension: "some-phoneextension-" + (0, exports.randomInt)(), indemandcip: "some-indemandcip-" + (0, exports.randomInt)(), peremployed2: (0, exports.randomInt)().toString(), avgquarterlywage2: (0, exports.randomInt)().toString(), onlineprogramid: "some-onlineprogramid-" + (0, exports.randomInt)(), eveningcourses: Math.random() < 0.5 ? "1" : "2", languages: "some-languages-" + (0, exports.randomInt)(), accessfordisabled: Math.random() < 0.5 ? "1" : "2", personalassist: Math.random() < 0.5 ? "1" : "2", childcare: Math.random() < 0.5 ? "1" : "2", assistobtainingchildcare: Math.random() < 0.5 ? "1" : "2" }, overrides);
};
exports.buildProgram = buildProgram;
const buildSocDefinition = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-soctitle-" + (0, exports.randomInt)(), definition: "some-socdefinition-" + (0, exports.randomInt)() }, overrides);
};
exports.buildSocDefinition = buildSocDefinition;
const buildNullableOccupation = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-soctitle-" + (0, exports.randomInt)() }, overrides);
};
exports.buildNullableOccupation = buildNullableOccupation;
const buildCipDefinition = (overrides) => {
    return Object.assign({ cipcode: "some-cipcode-" + (0, exports.randomInt)(), ciptitle: "some-ciptitle-" + (0, exports.randomInt)() }, overrides);
};
exports.buildCipDefinition = buildCipDefinition;
const buildLocalException = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-soctitle-" + (0, exports.randomInt)(), cipcode: "some-cipcode-" + (0, exports.randomInt)(), county: "some-county-" + (0, exports.randomInt)() }, overrides);
};
exports.buildLocalException = buildLocalException;
const randomCalendarLength = () => {
    const all = Object.keys(CalendarLength_1.CalendarLength)
        .filter((k) => typeof CalendarLength_1.CalendarLength[k] === "number")
        .map((key) => key);
    const randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex];
};
exports.randomCalendarLength = randomCalendarLength;
const randomCalendarLengthId = () => {
    const all = Object.values(CalendarLength_1.CalendarLength).filter((k) => typeof CalendarLength_1.CalendarLength[k] !== "number");
    const randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex].toString();
};
exports.randomCalendarLengthId = randomCalendarLengthId;
