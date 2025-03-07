import { Drawer } from "@components/modules/Drawer";
import { Heading } from "@components/modules/Heading";

export const CipDrawer = ({
  cipDrawerOpen,
  setCipDrawerOpen,
}: {
  cipDrawerOpen: boolean;
  setCipDrawerOpen: (value: boolean) => void;
}) => {
  return (
    <Drawer open={cipDrawerOpen} setOpen={setCipDrawerOpen}>
      <Heading level={3}>
        Classification of Instructional Programs (CIP) codes
      </Heading>
      <p>
        Classification of Instructional Programs (CIP) codes, are standardized
        codes used to categorize academic programs and courses. Each program or
        course is assigned a CIP code based on its content and subject matter.
        <sup>1.</sup> <sup>2.</sup>
      </p>
      <p>
        You can find a list of CIP codes{" "}
        <a
          href="https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=56"
          target="_blank"
          rel="noopener noreferrer"
        >
          here.
        </a>
      </p>
      <br />
      <div className="small sources">
        <span>
          <sup>1.</sup> Sources
          <ul>
            <li>
              National Center for Education Statistics (NCES):
              <br />
              <a
                href="https://nces.ed.gov/ipeds/cipcode/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://nces.ed.gov/ipeds/cipcode/
              </a>
            </li>
            <li>
              U.S. Department of Education:
              <br />
              <a
                href="https://www.ed.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.ed.gov/
              </a>
            </li>
          </ul>
        </span>
        <p>
          <sup>2.</sup> This definition was generated with the help of{" "}
          <a
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            chatGPT(3.5)
          </a>
        </p>
      </div>
    </Drawer>
  );
};
