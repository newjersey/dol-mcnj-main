import { SystemError } from "@components/modules/SystemError";
import { OCCUPATION_NOT_FOUND_PAGE_DATA as pageData } from "@data/occupation-not-found";

export const revalidate = 86400;

export const metadata = async () => {
  return {
    title: pageData.seo.title,
  };
};

export default async function NotFound() {
  return (
    <div className="container">
      <SystemError {...pageData.systemError} />
    </div>
  );
}
