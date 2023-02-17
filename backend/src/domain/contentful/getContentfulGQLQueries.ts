export const faqQuery = `
  {
    faqTopicCollection {
      items {
        topic
        order
      }
    }
    faqItemCollection {
      items {
        question
        answer {
          json
        }
        order
        topic {
          topic
          order
        }
      }
    }
  }
`;

export const trainingProviderQuery = `
  {
    trainingProviderItemCollection {
      items {
        title
        description {
          json
        }
        order
      }
    }
  }
`;