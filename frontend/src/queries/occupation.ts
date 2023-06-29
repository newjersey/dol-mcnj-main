export const OCCUPATION_QUERY = `query Occupation($id: String!) {
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
    education
    credentials
    skills
    experience
  }
}`;
