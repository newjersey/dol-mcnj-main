export const PATHWAY_QUERY = `query Pathway($id: String!) {
  pathway(id: $id) {
    title
    sys {
      id
    }
    occupationsCollection {
      items {
        sys {
          id
        }
        title
        level
        educationLevel
        salaryRangeStart
        salaryRangeEnd
      }
    }
  }
}`;
