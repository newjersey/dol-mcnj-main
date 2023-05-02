export const CAREER_MAP_NODE_QUERY = `query MapNode($id:String!) {
  careerMapObject(id: $id) {
    title
    shortTitle
    description
    salaryRangeEnd
    salaryRangeStart
    extendsTo {
      sys {
        id
      }
    }
    nextItem: nextLevelItemsCollection {
      items {
        sys {
          id
        }
      }
    }
  }
}`;
