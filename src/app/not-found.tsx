import { SystemError } from "@components/modules/SystemError";

export const metadata = async () => {
  return {
    title: `404 Not Found | ${process.env.REACT_APP_SITE_NAME}`,
  };
};

export default async function RootLayout() {
  return (
    <div className="container">
      <SystemError
        heading="Sorry, we can't seem to find that page"
        copy='<p>Try one of these instead:</p><ul><li><a href="/training/search">Search for a training opportunity</a></li><li><a href="https://www.careeronestop.org/" target="_blank" rel="noopener noreferrer">Look up your local One-Stop Career Center</a></li></ul>'
        color="green"
      />
    </div>
  );
}
