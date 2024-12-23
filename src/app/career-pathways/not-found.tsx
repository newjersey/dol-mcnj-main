import { SystemError } from "@components/modules/SystemError";
import { NOT_FOUND_PAGE_DATA as pageData } from "@data/not-found";

export const metadata = async () => {
  return {
    title: pageData.seo.title,
  };
};

export default async function RootLayout() {
  return (
    <div className="container">
      <SystemError {...pageData.systemError} />
    </div>
  );
}
