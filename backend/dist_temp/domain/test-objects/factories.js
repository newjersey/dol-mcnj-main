"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCalendarLengthId = exports.randomCalendarLength = exports.buildLocalException = exports.buildCipDefinition = exports.buildNullableOccupation = exports.buildSocDefinition = exports.buildProgram = exports.buildOccupationDetailPartial = exports.buildOccupationDetail = exports.buildInDemandOccupation = exports.buildOccupation = exports.buildContactPoint = exports.buildAddress = exports.buildProvider = exports.buildTraining = exports.buildTrainingResult = exports.randomLanguageTag = exports.randomBool = exports.randomInt = void 0;
const CalendarLength_1 = require("../CalendarLength");
const CredentialEngineUtils_1 = require("../../credentialengine/CredentialEngineUtils");
const DeliveryType_1 = require("../DeliveryType");
const randomInt = () => Math.floor(Math.random() * Math.floor(10000000));
exports.randomInt = randomInt;
const randomBool = () => !!Math.round(Math.random());
exports.randomBool = randomBool;
const randomLanguageTag = () => {
    const languageTags = Object.keys(CredentialEngineUtils_1.DATA_VALUE_TO_LANGUAGE);
    const randomIndex = Math.floor(Math.random() * languageTags.length);
    return languageTags[randomIndex];
};
exports.randomLanguageTag = randomLanguageTag;
function randomDeliveryTypes(minLen = 0, maxLen = 3) {
    const values = Object.values(DeliveryType_1.DeliveryType);
    const randomLength = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    return Array.from({ length: randomLength }, () => values[Math.floor(Math.random() * values.length)]);
}
const buildTrainingResult = (overrides) => {
    return Object.assign({ ctid: "some-ctid-" + (0, exports.randomInt)(), name: "some-name-" + (0, exports.randomInt)(), cipDefinition: {
            cipcode: "some-cipcode-" + (0, exports.randomInt)(),
            ciptitle: "some-ciptitle-" + (0, exports.randomInt)(),
        }, totalCost: (0, exports.randomInt)(), percentEmployed: (0, exports.randomInt)(), calendarLength: (0, exports.randomCalendarLength)(), totalClockHours: (0, exports.randomInt)(), inDemand: (0, exports.randomBool)(), deliveryTypes: randomDeliveryTypes(), localExceptionCounty: [], highlight: "some-hightlight-" + (0, exports.randomInt)(), rank: (0, exports.randomInt)(), cities: ["some-city-" + (0, exports.randomInt)(), "some-city-" + (0, exports.randomInt)()], zipCodes: [(0, exports.randomInt)().toString(), (0, exports.randomInt)().toString()], providerId: "some-id-" + (0, exports.randomInt)(), providerName: "some-provider-name-" + (0, exports.randomInt)(), socCodes: ["some-soc-" + (0, exports.randomInt)()], hasEveningCourses: (0, exports.randomBool)(), languages: [(0, exports.randomLanguageTag)(), (0, exports.randomLanguageTag)(), (0, exports.randomLanguageTag)()], isWheelchairAccessible: (0, exports.randomBool)(), hasJobPlacementAssistance: (0, exports.randomBool)(), hasChildcareAssistance: (0, exports.randomBool)(), availableAt: [] }, overrides);
};
exports.buildTrainingResult = buildTrainingResult;
const buildTraining = (overrides) => {
    return Object.assign({ ctid: "some-ctid-" + (0, exports.randomInt)(), name: "some-name-" + (0, exports.randomInt)(), cipDefinition: {
            cipcode: "some-cipcode-" + (0, exports.randomInt)(),
            ciptitle: "some-ciptitle-" + (0, exports.randomInt)(),
        }, provider: (0, exports.buildProvider)({}), description: "some-description-" + (0, exports.randomInt)(), credentials: "some-credentials-" + (0, exports.randomInt)(), prerequisites: ["some-prerequisites-" + (0, exports.randomInt)()], occupations: [(0, exports.buildOccupation)({})], calendarLength: (0, exports.randomCalendarLength)(), totalClockHours: (0, exports.randomInt)(), inDemand: (0, exports.randomBool)(), localExceptionCounty: [], tuitionCost: (0, exports.randomInt)(), feesCost: (0, exports.randomInt)(), booksMaterialsCost: (0, exports.randomInt)(), suppliesToolsCost: (0, exports.randomInt)(), otherCost: (0, exports.randomInt)(), totalCost: (0, exports.randomInt)(), deliveryTypes: randomDeliveryTypes(), percentEmployed: (0, exports.randomInt)(), averageSalary: (0, exports.randomInt)(), hasEveningCourses: (0, exports.randomBool)(), languages: [(0, exports.randomLanguageTag)(), (0, exports.randomLanguageTag)(), (0, exports.randomLanguageTag)()], isWheelchairAccessible: (0, exports.randomBool)(), hasJobPlacementAssistance: (0, exports.randomBool)(), hasChildcareAssistance: (0, exports.randomBool)(), availableAt: [(0, exports.buildAddress)({})] }, overrides);
};
exports.buildTraining = buildTraining;
const buildProvider = (overrides) => {
    return Object.assign({ ctid: "some-ctid-" + (0, exports.randomInt)(), providerId: "some-id-" + (0, exports.randomInt)(), url: "some-url-" + (0, exports.randomInt)(), addresses: [(0, exports.buildAddress)({})], name: "some-name-" + (0, exports.randomInt)() }, overrides);
};
exports.buildProvider = buildProvider;
const buildAddress = (overrides) => {
    return Object.assign({ "@type": "ceterms:Place", street_address: "some-name-" + (0, exports.randomInt)(), city: "some-street1-" + (0, exports.randomInt)(), zipCode: "some-zipCode-" + (0, exports.randomInt)(), county: "some-county-" + (0, exports.randomInt)() }, overrides);
};
exports.buildAddress = buildAddress;
const buildContactPoint = (overrides) => {
    return Object.assign({ name: "some-name-" + (0, exports.randomInt)(), alternateName: "some-alternateName-" + (0, exports.randomInt)(), contactType: "some-contactType-" + (0, exports.randomInt)(), email: ["some-email@a" + (0, exports.randomInt)() + ".com"], telephone: ["(973) 555-5555"] }, overrides);
};
exports.buildContactPoint = buildContactPoint;
const buildOccupation = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)() }, overrides);
};
exports.buildOccupation = buildOccupation;
const buildInDemandOccupation = (overrides) => {
    return Object.assign({ soc: "some-soc-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)(), majorGroup: "some-group-" + (0, exports.randomInt)() }, overrides);
};
exports.buildInDemandOccupation = buildInDemandOccupation;
const buildOccupationDetail = (overrides) => {
    return Object.assign({ soc: "some-soc-code-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)(), description: "some-description-" + (0, exports.randomInt)(), tasks: ["some-tasks-" + (0, exports.randomInt)()], education: "some-education-" + (0, exports.randomInt)(), inDemand: (0, exports.randomBool)(), counties: [], medianSalary: (0, exports.randomInt)(), openJobsCount: (0, exports.randomInt)(), relatedOccupations: [(0, exports.buildOccupation)({})] }, overrides);
};
exports.buildOccupationDetail = buildOccupationDetail;
const buildOccupationDetailPartial = (overrides) => {
    return Object.assign({ soc: "some-soc-code-" + (0, exports.randomInt)(), title: "some-title-" + (0, exports.randomInt)(), description: "some-description-" + (0, exports.randomInt)(), tasks: ["some-tasks-" + (0, exports.randomInt)()], relatedOccupations: [(0, exports.buildOccupation)({})] }, overrides);
};
exports.buildOccupationDetailPartial = buildOccupationDetailPartial;
const buildProgram = (overrides) => {
    return Object.assign({ programid: "some-programid-" + (0, exports.randomInt)(), cipcode: "some-cipcode-" + (0, exports.randomInt)(), ciptitle: "some-ciptitle-" + (0, exports.randomInt)(), officialname: "some-officialname-" + (0, exports.randomInt)(), description: "some-description-" + (0, exports.randomInt)(), industrycredentialname: "tree identifier", prerequisites: "High School Diploma/G.E.D. or Ability To Benefit", providerid: "some-providerid-" + (0, exports.randomInt)(), tuition: (0, exports.randomInt)().toString(), fees: (0, exports.randomInt)().toString(), booksmaterialscost: (0, exports.randomInt)().toString(), suppliestoolscost: (0, exports.randomInt)().toString(), othercosts: (0, exports.randomInt)().toString(), totalcost: (0, exports.randomInt)().toString(), providername: "some-providername-" + (0, exports.randomInt)(), calendarlengthid: (0, exports.randomCalendarLengthId)(), totalclockhours: (0, exports.randomInt)().toString(), website: "some-website-" + (0, exports.randomInt)(), street_address: { "en-US": "some-street-" + (0, exports.randomInt)() }, city: { "en-US": "some-city-" + (0, exports.randomInt)() }, state: { "en-US": "some-state-" + (0, exports.randomInt)() }, zip: "some-zip-" + (0, exports.randomInt)(), county: "some-county-" + (0, exports.randomInt)(), contactfirstname: "some-contactfirstname-" + (0, exports.randomInt)(), contactlastname: "some-contactlastname-" + (0, exports.randomInt)(), contacttitle: "some-contacttitle-" + (0, exports.randomInt)(), phone: "some-phone-" + (0, exports.randomInt)(), phoneextension: "some-phoneextension-" + (0, exports.randomInt)(), indemandcip: "some-indemandcip-" + (0, exports.randomInt)(), peremployed2: (0, exports.randomInt)().toString(), avgquarterlywage2: (0, exports.randomInt)().toString(), onlineprogramid: "some-onlineprogramid-" + (0, exports.randomInt)(), eveningcourses: Math.random() < 0.5 ? "1" : "2", languages: "some-languages-" + (0, exports.randomInt)(), accessfordisabled: Math.random() < 0.5 ? "1" : "2", personalassist: Math.random() < 0.5 ? "1" : "2", childcare: Math.random() < 0.5 ? "1" : "2", assistobtainingchildcare: Math.random() < 0.5 ? "1" : "2" }, overrides);
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
