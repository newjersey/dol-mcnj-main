export const calendarLength = (num?: number) => {
  switch (num) {
    case 1:
      return "Less than 1 day";
    case 2:
      return "1-2 days";
    case 3:
      return "3-7 days";
    case 4:
      return "2-3 weeks";
    case 5:
      return "4-11 weeks";
    case 6:
      return "3-5 months";
    case 7:
      return "6-12 months";
    case 8:
      return "13 months - 2 years";
    case 9:
      return "3-4 years";
    case 10:
      return "More than 4 years";
    default:
      return "--";
  }
};
