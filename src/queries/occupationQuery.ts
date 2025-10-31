export const OCCUPATION_QUERY = `query Occupation($id: String!) {
  careerMapObject(id: $id) {
    sys {
      id
    }
    level
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
