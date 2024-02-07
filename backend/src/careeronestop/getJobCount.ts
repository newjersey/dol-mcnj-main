export const getJobCount = async (term: string) => {
  const data = await fetch(
    `${process.env.CAREER_ONESTOP_BASEURL}/v1/jobsearch/${process.env.CAREER_ONESTOP_USERID}/${term}/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CAREER_ONESTOP_AUTH_TOKEN}`,
      },
    },
  );

  const { Jobcount } = await data.json();

  return Jobcount;
};
