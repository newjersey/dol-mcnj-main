"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCCUPATION_QUERY = void 0;
exports.OCCUPATION_QUERY = `query Occupation($id: String!) {
  careerMapObject(id: $id) {
    sys {
      id
    }
    title
    inDemand
    shortTitle
    medianSalary
    numberOfAvailableJobs
    salaryRangeStart
    salaryRangeEnd
    description
    advancement
    trainingSearchTerms
    tasks
    howToGetStarted
    howToGetHere
    education
    credentials
    skills
    experience
  }
}`;
