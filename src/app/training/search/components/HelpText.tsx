import { ShowMore } from "./ShowMore";

export const HelpText = () => (
  <div>
    <ShowMore
      hidden={
        <>
          <p>Here are some examples that may improve your search results:</p>
          <p>
            <strong>Training Providers:</strong> If you&apos;re searching for a
            training provider, try using only the provider&apos;s name and
            exclude words like &quot;university&quot; or &quot;college&quot;.
          </p>
          <p>
            <strong>Occupations:</strong> If you&apos;re looking for training
            for a job, you can type the job directly into the search box.
          </p>
          <p>
            <strong>License:</strong> If you know the name of the license
            you&apos;re training for, use the acronym to see more results. For
            example, for the commercial driving license, try searching for
            &quot;CDL&quot;.
          </p>
        </>
      }
    >
      <p>
        Are you not seeing the results you were looking for? We recommend that
        you try these search tips to enhance your results:
      </p>
      <p>Check your spelling to ensure it is correct.</p>
      <p>
        Verify and adjust any filters that you might have applied to your
        search.
      </p>
      <p>
        Are your search results too small? Your search may be too specific. Try
        searching with less words.
      </p>
      <p>
        Are your search results too long? Your search results may be too broad,
        so try using more terms that describe what you are searching for.
      </p>
    </ShowMore>
  </div>
);
