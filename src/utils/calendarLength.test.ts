import { calendarLength } from "./calendarLength";

describe("calendarLength Function", () => {
  it("returns 'Less than 1 day' for input 1", () => {
    expect(calendarLength(1)).toBe("Less than 1 day");
  });

  it("returns '1-2 days' for input 2", () => {
    expect(calendarLength(2)).toBe("1-2 days");
  });

  it("returns '3-7 days' for input 3", () => {
    expect(calendarLength(3)).toBe("3-7 days");
  });

  it("returns '2-3 weeks' for input 4", () => {
    expect(calendarLength(4)).toBe("2-3 weeks");
  });

  it("returns '4-11 weeks' for input 5", () => {
    expect(calendarLength(5)).toBe("4-11 weeks");
  });

  it("returns '3-5 months' for input 6", () => {
    expect(calendarLength(6)).toBe("3-5 months");
  });

  it("returns '6-12 months' for input 7", () => {
    expect(calendarLength(7)).toBe("6-12 months");
  });

  it("returns '13 months - 2 years' for input 8", () => {
    expect(calendarLength(8)).toBe("13 months - 2 years");
  });

  it("returns '3-4 years' for input 9", () => {
    expect(calendarLength(9)).toBe("3-4 years");
  });

  it("returns 'More than 4 years' for input 10", () => {
    expect(calendarLength(10)).toBe("More than 4 years");
  });

  it("returns '--' for undefined input", () => {
    expect(calendarLength()).toBe("--");
  });

  it("returns '--' for non-matching input", () => {
    expect(calendarLength(0)).toBe("--");
    expect(calendarLength(11)).toBe("--");
  });
});
