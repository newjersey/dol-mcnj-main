import { RESOURCE_CATEGORY_QUERY } from "../queries/resourceCategory";
import { ResourceListProps, TagProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";

interface ResourceTagListProps {
  tags: TagProps[];
  audience: TagProps[];
}

export const ResourceList = ({ tags, audience }: ResourceTagListProps) => {
  // get the title from all tags and audience and map them to a single array
  const allTags = [...tags, ...audience].map((tag) => tag.title);

  const data: ResourceListProps = useContentfulClient({
    query: RESOURCE_CATEGORY_QUERY,
    variables: { tags: ["Career Guidance"] },
  });

  return (
    <code>
      <pre
        style={{
          fontFamily: "monospace",
          display: "block",
          padding: "50px",
          color: "#88ffbf",
          backgroundColor: "black",
          textAlign: "left",
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(data, null, "    ")}
      </pre>
    </code>
  );
};
