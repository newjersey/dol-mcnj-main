import { Megaphone, Warning, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import { checkValidEmail } from "../utils/checkValidEmail";

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
  // State hooks for email and error
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle the form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null); // Reset error message

    if (!email) {
      setTimeout(() => {
        setSubmitting(false);
        setError({ status: 400, message: "Please enter a valid email address" });
      }, 1000);
      return;
    }

    // Send the email to the backend
    try {
      const response = await fetch("/api/emails/submit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Handle success - maybe clear the form or display a thank-you message
          console.log("Success");
          setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setEmail(""); // Clear email input
          }, 1000);
        } else {
          // Handle failure - display an error message from the response
          console.log("Fail");
          setTimeout(() => {
            setSubmitting(false);
            setError({ status: 500, message: data.message });
          }, 1000);
        }
      } else {
        const text = await response.text(); // or use response.statusText
        setTimeout(() => {
          setSubmitting(false);
          setError({ status: 500, message: response.statusText });
        }, 1000);
        console.error("Failed to parse JSON response:", text);
        // ... handle the error
      }
    } catch (error) {
      // Handle network errors
      setTimeout(() => {
        setSubmitting(false);
        setError({
          status: 500,
          message: "An error occurred while sending your email.",
        });
      }, 1000);
    }
  };

  return (
    <div className={`update-content${fixed ? " fixed" : ""}${open ? " open" : ""}`}>
      {fixed && (
        <button className="close-update-drawer" onClick={() => setOpen && setOpen(false)}>
          <span className="sr-only">Close</span>
          <X size={32} />
        </button>
      )}
      <div className="wrapper">
        <div className="content">
          {success ? (
            <div className="heading-wrap status">
              <Megaphone size={32} />
              <p className="heading-tag">Success!</p>
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
            <div className="heading-wrap status">
              <Warning size={32} color="#d54309" />
              <p className="heading-tag">Uh Oh!</p>
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
            <>
              <div className="heading-wrap">
                <Megaphone size={32} />
                <p className="heading-tag">
                  Want updates on new tools and features from New Jersey Career Central?
                </p>
              </div>

              <form className="usa-form" onSubmit={handleSubmit}>
                <div className="usa-form-group">
                  <div className={`input-wrapper${error?.status === 400 ? " error" : ""}`}>
                    <label className="usa-label" htmlFor="input-email">
                      Email (required)
                    </label>
                    <input
                      className="usa-input"
                      id="input-email"
                      placeholder="Email"
                      name="input-email"
                      type="email"
                      aria-describedby="input-email-message"
                      value={email}
                      onBlur={(e) => {
                        if (!checkValidEmail(e.target.value)) {
                          setError({ status: 400, message: "Please enter a valid email address" });
                        } else {
                          setError(null);
                        }
                      }}
                      onChange={(e) => {
                        if (error?.status === 400) {
                          if (checkValidEmail(e.target.value)) {
                            setError(null);
                          }
                        }
                        setEmail(e.target.value);
                      }}
                    />
                    {error?.status === 400 && <div className="error-message">{error.message}</div>}
                  </div>
                  <button
                    disabled={error?.status === 400 || submitting}
                    type="submit"
                    className="usa-button primary"
                  >
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Megaphone size={22} />
                        Sign Up for Updates
                      </>
                    )}
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
            </>
          )}
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
          <div className={`overlay${open ? " open" : ""}`} />
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
