export const OCCUPATION_QUERY = `query Occupation($id: String!) {
  careerMapObject(id: $id) {
    sys {
      id
    }
    title
    inDemand
    shortTitle
    salaryRangeStart
    salaryRangeEnd
    description
    advancement
    tasks
    education
    credentials
    skills
    experience
  }
}`;
