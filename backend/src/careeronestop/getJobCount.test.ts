import { getJobCount } from "./getJobCount";

// Mock the fetch function
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ Jobcount: 5 }), // Adjust the response data as needed
  }),
) as jest.Mock;

describe("getJobCount", () => {
  beforeEach(() => {
    // Clear the fetch mock call count before each test
    (fetch as jest.Mock).mockClear();
  });

  it("should fetch job count correctly", async () => {
    // Mock environment variables
    process.env.CAREER_ONESTOP_BASEURL = "mocked-base-url";
    process.env.CAREER_ONESTOP_USERID = "mocked-user-id";
    process.env.CAREER_ONESTOP_AUTH_TOKEN = "mocked-auth-token";

    const term = "mocked-term";
    const expectedUrl = `${process.env.CAREER_ONESTOP_BASEURL}/v1/jobsearch/${process.env.CAREER_ONESTOP_USERID}/${term}/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false`;

    const jobCount = await getJobCount(term);

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CAREER_ONESTOP_AUTH_TOKEN}`,
      },
    });

    expect(jobCount).toEqual(5); // Adjust the expected job count as needed
  });
});
