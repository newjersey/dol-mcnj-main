export function getAppBaseUrl(): string {
  // allow an explicit override first
  const override = process.env.APP_BASEURL?.replace(/\/$/, "");
  if (override) return override;

  // map your existing NODE_ENVs
  switch (process.env.NODE_ENV) {
    case "awsprod":
      return "https://mycareer.nj.gov";
    case "awstest":
      return "https://test.mycareer.nj.gov";
    case "awsdev":
      return "https://dev.mycareer.nj.gov";
    // local/dev servers
    case "dev":
    case "test":
    default: {
      const port = process.env.APP_PORT || process.env.PORT || 3000;
      return `http://localhost:${port}`;
    }
  }
}