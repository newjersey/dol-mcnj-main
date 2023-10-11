import { Megaphone, X } from "@phosphor-icons/react";
import Image from "../tempImage.jpg";
import { useState } from "react";

interface UpdateNotifierProps {
  className?: string;
  isDrawer?: boolean;
}

const Content = ({
  fixed,
  open,
  setOpen,
}: {
  fixed?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <div className={`update-content${fixed ? " fixed" : ""}${open ? " open" : ""}`}>
      {fixed && (
        <button
          className="close-update-drawer"
          onClick={() => {
            setOpen && setOpen(false);
          }}
        >
          <span className="sr-only">Close</span>
          <X size={32} />
        </button>
      )}
      <div className="wrapper">
        <div className="content">
          <Megaphone size={32} />
          <p className="heading-tag">
            Want updates on new tools and features from New Jersey Career Central?
          </p>

          <form
            className="usa-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="input-email">
                Email (required)
              </label>

              <input
                className="usa-input"
                id="input-email"
                placeholder="Email"
                required
                name="input-email"
                type="email"
                aria-describedby="input-email-message"
              />
              <button type="submit" className="usa-button primary">
                <Megaphone size={22} />
                Sign Up for Updates
              </button>
              <p>
                Read about out{" "}
                <a
                  href="https://www.nj.gov/nj/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>
                .
              </p>
            </div>
          </form>
        </div>
        <div className="image">
          <img src={Image} alt="" />
        </div>
      </div>
    </div>
  );
};

const UpdateNotifier = ({ className, isDrawer }: UpdateNotifierProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`update-notifier${className ? ` ${className}` : ""}`}>
      {isDrawer ? (
        <>
          <button
            className="usa-button primary"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Megaphone size={22} />
            Sign Up for Updates
          </button>
          <Content fixed open={open} setOpen={setOpen} />
        </>
      ) : (
        <div className="container">
          <Content />
        </div>
      )}
    </div>
  );
};

export { UpdateNotifier };
