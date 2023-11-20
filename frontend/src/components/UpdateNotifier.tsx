import { Megaphone, X } from "@phosphor-icons/react";
import React, { useState } from "react";

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
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handle the form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error message

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    // TODO: Add proper email validation

    // Send the email to the backend
    try {
      const response = await fetch('/api/emails/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });


      if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
        const data = await response.json();
        if (data.success) {
          // Handle success - maybe clear the form or display a thank-you message
          console.log("Success");
          setEmail(''); // Clear email input
        } else {
          // Handle failure - display an error message from the response
          console.log("Fail");
          setError(data.message);
        }
      } else {
        const text = await response.text(); // or use response.statusText
        console.error('Failed to parse JSON response:', text);
        // ... handle the error
      }

    } catch (error: any) {
      // Handle network errors
      setError(error.message || 'An error occurred while sending your email.');
    }
  };

  return (
      <div className={`update-content${fixed ? " fixed" : ""}${open ? " open" : ""}`}>
        {fixed && (
            <button
                className="close-update-drawer"
                onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <X size={32} />
            </button>
        )}
        <div className="wrapper">
          <div className="content">
            <div className="heading-wrap">
              <Megaphone size={32} />
              <p className="heading-tag">
                Want updates on new tools and features from New Jersey Career Central?
              </p>
            </div>

            <form
                className="usa-form"
                onSubmit={handleSubmit}
            >
              <div className="usa-form-group">
                <div className="input-wrapper">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="usa-button primary">
                  <Megaphone size={22} />
                  Sign Up for Updates
                </button>
                {error && <div className="error-message">{error}</div>}
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
