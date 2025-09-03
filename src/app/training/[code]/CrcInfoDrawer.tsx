import { Drawer } from "@components/modules/Drawer";
import { Heading } from "@components/modules/Heading";

export const CrcInfoDrawer = ({
  crcInfoDrawerOpen,
  setCrcInfoDrawerOpen,
}: {
  crcInfoDrawerOpen: boolean;
  setCrcInfoDrawerOpen: (value: boolean) => void;
}) => {
  return (
    <Drawer open={crcInfoDrawerOpen} setOpen={setCrcInfoDrawerOpen} title="Consumer Report Card">
      <Heading level={3}>
        About the Consumer Report Card
      </Heading>
      <p>
        The Consumer Report Card provides key performance metrics for training programs
        to help you make informed decisions about your education and career path.
      </p>
      
      <div className="metric-explanation">
        <h4>Percent of employed graduates</h4>
        <p>
          This shows what percentage of graduates found employment after completing
          the program, measured at 6 months and 12 months after graduation.
        </p>
      </div>

      <div className="metric-explanation">
        <h4>Median wage</h4>
        <p>
          This represents the middle income earned by graduates who found employment,
          measured at 6 months and 12 months after graduation.
        </p>
      </div>

      <div className="metric-explanation">
        <h4>Completion percentage</h4>
        <p>
          This shows what percentage of students who enrolled in the program
          successfully completed it.
        </p>
      </div>

      <div className="metric-explanation">
        <h4>Top three industries for completers</h4>
        <p>
          This lists the most common industries where graduates find employment
          after completing the program.
        </p>
      </div>

      <div className="small sources">
        <p>
          Data is compiled from training providers  to provide transparency about program outcomes and help prospective students make informed decisions.
        </p>
      </div>
    </Drawer>
  );
};
