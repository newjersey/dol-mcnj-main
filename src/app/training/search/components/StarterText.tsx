import { Heading } from "@components/modules/Heading";

export const StarterText = () => {
  return (
    <div>
      <Heading level={3}>What is the Training Explorer?</Heading>
      <p>
        The Training Explorer is a comprehensive listing of all schools and
        organizations offering education and job training that may be eligible
        to receive funding assistance.
      </p>
      <Heading level={3}>What Can I Search for?</Heading>
      <p>Here are some examples that may improve your search results:</p>
      <p>
        <strong>Training Providers:</strong> If you&apos;re searching for a
        training provider, try using only the provider&apos;s name and exclude
        words like &quot;university&quot; or &quot;college&quot;.
      </p>
      <p>
        <strong>Occupations:</strong> If you&apos;re looking for training for a
        job, you can type the job directly into the search box.
      </p>
      <p>
        <strong>License:</strong> If you know the name of the license
        you&apos;re training for, use the acronym to see more results. For
        example, for the commercial driving license, try searching for
        &quot;CDL&quot;.
      </p>
    </div>
  );
};
