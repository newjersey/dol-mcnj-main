// Import necessary icons and libraries
import { EnvelopeSimple, MegaphoneSimple, Warning, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import { checkValidEmail } from "../utils/checkValidEmail";

// Interface for UpdateNotifierProps
interface UpdateNotifierProps {
  className?: string;
  isDrawer?: boolean;
}

// Array of descriptions for the dropdown
const descriptions = [
  "Advocate",
  "Business",
  "CBO/NGO",
  "Intermediary",
  "Labor Organization / Union",
  "Library",
  "Literacy Consortium Member",
  "NJ Government",
  "Workforce Provider (OneStop, etc.)",
];

// Content component containing the form and status messages
const Content = ({
  fixed,
  open,
  setOpen,
}: {
  fixed?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  // State variables for form handling
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeDescription, setActiveDescription] = useState("Select an option");

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate email and description
    if (!email || activeDescription === "Select an option") {
      setTimeout(() => {
        setSubmitting(false);
        setError({ status: 400, message: "Input error" });
      }, 1000);
      return;
    }

    // Perform API call for email submission
    try {
      const response = await fetch("/api/emails/submit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Handle API response
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Handle success case
          console.log("Success");
          setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setEmail("");
          }, 1000);
        } else {
          // Handle failure case
          console.log("Fail");
          setTimeout(() => {
            setSubmitting(false);
            setError({ status: 500, message: data.message });
          }, 1000);
        }
      } else {
        // Handle non-OK response
        const text = await response.text();
        setTimeout(() => {
          setSubmitting(false);
          setError({ status: 500, message: response.statusText });
        }, 1000);
        console.error("Failed to parse JSON response:", text);
      }
    } catch (error) {
      // Handle general error
      setTimeout(() => {
        setSubmitting(false);
        setError({
          status: 500,
          message: "An error occurred while sending your email.",
        });
      }, 1000);
    }
  };

  // JSX structure for the content component
  return (
    // Content wrapper
    <div className={`update-content${fixed ? " fixed" : ""}${open ? " open" : ""}`}>
      {fixed && (
        // Close button for fixed version
        <button className="close-update-drawer" onClick={() => setOpen && setOpen(false)}>
          <span className="sr-only">Close</span>
          <X size={32} />
        </button>
      )}
      {/* Main content */}
      <div className="wrapper">
        <div className="content">
          {/* Check success state */}
          {success ? (
            // Success message
            <div className="heading-wrap status">
              <MegaphoneSimple size={32} />
              <p className="heading-tag">Success!</p>
              {/* Success details */}
              <p className="status-message">
                If this is the first time you've subscribed to New Jersey Career Central, you'll see
                a confirmation email in your inbox to confirm your subscription. If you don't see
                that email, be sure to check your spam and junk folders.
              </p>
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
          ) : error?.status === 500 ? (
            // Error message for status 500
            <div className="heading-wrap status">
              <Warning size={32} color="#d54309" />
              <p className="heading-tag">Uh Oh!</p>
              {/* Error details */}
              <p className="status-message">
                It looks like the submission didn’t work. Our team has been alerted but if you would
                like to try again you can{" "}
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setError(null);
                    setEmail("");
                  }}
                >
                  reset this form
                </a>
                .
              </p>
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
          ) : (
            // Main form and description selection
            <>
              <div className="heading-wrap">
                <MegaphoneSimple size={32} />
                <p className="heading-tag">
                  Want updates on new tools and features from New Jersey Career Central?
                </p>
              </div>

              {/* Email subscription form */}
              <form className="usa-form" onSubmit={handleSubmit}>
                <div className="usa-form-group">
                  <div className="input-row">
                    {/* Email input */}
                    <div
                      className={`input-wrapper${error?.status === 400 && !checkValidEmail(email) ? " error" : ""}`}
                    >
                      <label className="usa-label" htmlFor="input-email">
                        Email<span className="require-mark">*</span>
                      </label>
                      <EnvelopeSimple size={25} />
                      <input
                        className="usa-input"
                        id="input-email"
                        placeholder="Email"
                        name="input-email"
                        type="email"
                        aria-describedby="input-email-message"
                        value={email}
                        onBlur={(e) => {
                          setError(
                            !checkValidEmail(e.target.value) ||
                              activeDescription === "Select an option"
                              ? {
                                  status: 400,
                                  message: "Input error",
                                }
                              : null,
                          );
                        }}
                        onChange={(e) => {
                          if (error?.status === 400) {
                            if (
                              checkValidEmail(e.target.value) &&
                              activeDescription !== "Select an option"
                            ) {
                              setError(null);
                            }
                          }
                          setEmail(e.target.value);
                        }}
                      />
                      {error?.status === 400 && !checkValidEmail(email) && (
                        <div className="error-message">Please enter a valid email address</div>
                      )}
                    </div>

                    {/* Description selection dropdown */}
                    <div
                      className={`input-wrapper${error?.status === 400 && activeDescription === "Select an option" ? " error" : ""}`}
                    >
                      <label className="usa-label" htmlFor="input-select">
                        Which best describes you?<span className="require-mark">*</span>
                      </label>

                      {/* Dropdown selector */}
                      <div className="description-selector">
                        <button
                          type="button"
                          aria-label="description selector"
                          id="description-select"
                          className="select-button greyed-out"
                          onClick={() => {
                            setOpenDropdown(!openDropdown);
                          }}
                        >
                          {activeDescription}
                        </button>

                        {/* Dropdown items */}
                        {openDropdown && (
                          <div className="dropdown-select">
                            {descriptions.map((desc) => (
                              <button
                                aria-label="description-item"
                                type="button"
                                key={desc}
                                className="description"
                                onClick={() => {
                                  const selectButton = document.getElementById(
                                    "description-select",
                                  ) as HTMLButtonElement;
                                  selectButton.classList.remove("greyed-out");
                                  setOpenDropdown(false);
                                  setActiveDescription(desc);
                                  if (checkValidEmail(email)) {
                                    setError(null);
                                  } else {
                                    setError({
                                      status: 400,
                                      message: "Input error",
                                    });
                                  }
                                }}
                              >
                                {desc}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {error?.status === 400 && activeDescription === "Select an option" && (
                        <div className="error-message">Please select an option</div>
                      )}
                    </div>
                  </div>
                  {/* Submit button */}
                  <button
                    disabled={error?.status === 400 || submitting}
                    type="submit"
                    className="usa-button primary"
                  >
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <MegaphoneSimple size={22} />
                        Sign Up for Updates
                      </>
                    )}
                  </button>
                  {/* Privacy policy link */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main UpdateNotifier component
export const UpdateNotifier = ({ className, isDrawer }: UpdateNotifierProps) => {
  // State variable for drawer open/close
  const [open, setOpen] = useState(false);

  // JSX structure for UpdateNotifier component
  return (
    <div className={`update-notifier${className ? ` ${className}` : ""}`}>
      {/* Check if it's a drawer or not */}
      {isDrawer ? (
        <>
          {/* Overlay and open button for drawer */}
          <div className={`overlay${open ? " open" : ""}`} />
          <button
            className="usa-button primary"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <MegaphoneSimple size={22} />
            Sign Up for Updates
          </button>
          {/* Content component within the drawer */}
          <Content fixed open={open} setOpen={setOpen} />
        </>
      ) : (
        // Main container for non-drawer version
        <div className="container">
          <Content />
        </div>
      )}
    </div>
  );
};
