export const TRAINING_EXPLORER_PAGE_QUERY = `query TrainingExplorer {
  trainingExplorerPage(id: "1OyvEu9fWvW2xNDg8czb8a") {
    title
    pageBanner {
      title
      section
      breadcrumbsCollection(limit: 5) {
        items {
          sys {
            id
          }
          copy
          url
          screenReaderOnlyCopy
        }
      }
      message {
        json
      }
      ctaHeading
      ctaLinksCollection(limit: 2) {
        items {
          sys {
            id
          }
          copy
          url
        }
      }
    }
    demoVideoUrl
    stepOneIcon
    stepOneHeading
    stepOneText
    stepTwoIcon
    stepTwoHeading
    stepTwoText
    stepThreeIcon
    stepThreeHeading
    stepThreeText
    interrupterBannerHeading
    interrupterLinksCollection(limit: 2) {
      items {
        sys {
          id
        }
        copy
        url
      }
    }
    faqsCollection(limit: 10) {
      items {
        sys {
          id
        }
        question
        answer {
          json
        }
      }
    }
    footerCtaHeading
    footerCtaLinkCollection(limit: 3) {
      items {
        sys {
          id
        }
        copy
        url
      }
    }
  }
}`;
