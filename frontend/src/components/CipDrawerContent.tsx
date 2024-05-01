import React from 'react';
import { X } from '@phosphor-icons/react';

export const CipDrawerContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="copy">
      <button
        aria-label="Close"
        title="Close"
        className="close"
        onClick={() => onClose}
        type="button"
      >
        <X size={28}/>
        <div className="sr-only">Close</div>
      </button>
      <h3>Classification of Instructional Programs (CIP) codes</h3>
      <p>
        Classification of Instructional Programs (CIP) codes, are standardized codes used to
        categorize academic programs and courses. Each program or course is assigned a CIP
        code based on its content and subject matter.<sup>1.</sup> <sup>2.</sup>
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
      <br/>
      <br/>
      <small className="sources">
        <p>
          <sup>1.</sup> Sources
          <ul>
            <li>
              National Center for Education Statistics (NCES):
              <br/>
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
              <br/>
              <a href="https://www.ed.gov/" target="_blank" rel="noopener noreferrer">
                https://www.ed.gov/
              </a>
            </li>
          </ul>
        </p>
        <p>
          <sup>2.</sup> This definition was generated with the help of{" "}
          <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">
            chatGPT(3.5)
          </a>
        </p>
      </small>
    </div>
  );
};
