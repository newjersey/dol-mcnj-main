import { Drawer } from "./Drawer";
import { Heading } from "./Heading";

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
          Data is compiled from training providers to provide transparency about program outcomes and help prospective students make informed decisions.
        </p>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#DCE7F5', border: '2px dashed #DCE7F5' }}>
        <Heading level={4} className="text-gray-800 mb-2">
          Have a question about the data?
        </Heading>
        <p className="text-gray-700">
          <a href="/contact" className="text-primary hover:text-primaryDark underline">Contact our team</a> and we will do our best to help answer your question.
        </p>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          1. New Jersey State law (C:34:IA 86) mandates the collection and display of specific provider and program performance data on the Consumer Report Card.
        </p>
      </div>
    </Drawer>
  );
};