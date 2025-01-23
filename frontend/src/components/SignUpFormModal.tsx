import { useEffect, useState } from "react";
import { Button } from "./Button";
import { CircleNotch, EnvelopeSimple, X } from "@phosphor-icons/react";

export const SignUpFormModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [resetForm, setResetForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  // const [submissionError, setSubmissionError] = useState<string>("");

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resetForm) return;

    const allErrorCheck = () => {
      if (
        (firstName.length !== 0 && firstName.length < 2) ||
        (lastName.length !== 0 && lastName.length < 2) ||
        !email ||
        (email && !email.includes("@")) ||
        (phone && phone.length < 12)
      ) {
        return true;
      } else {
        return false;
      }
    };

    // check if first name has 2 or more characters
    if (firstName.length !== 0 && firstName.length < 2) {
      setFirstNameError("First name must be 2 or more characters.");
    } else {
      setFirstNameError("");
    }

    // check if last name has 2 or more characters
    if (lastName.length !== 0 && lastName.length < 2) {
      setLastNameError("Last name must be 2 or more characters.");
    } else {
      setLastNameError("");
    }

    // check if there is entered email and is valid
    if (!email) {
      setEmailError("Email is required.");
    } else if (email && !email.includes("@")) {
      setEmailError("Email invalid.");
    } else {
      setEmailError("");
    }

    // check if phone number is valid
    if (phone && phone.length < 12) {
      setPhoneError("Phone number invalid.");
    } else {
      setPhoneError("");
    }

    if (allErrorCheck()) {
      console.error("ERROR:", "Please check the form and try again.");
      setSubmitting(false);
    } else {
      setSubmitting(true);

      setTimeout(() => {
        setSuccess(true);
        console.info("SUCCESS: Form submitted successfully.", {
          firstName,
          lastName,
          email,
          phone,
        });
        setSubmitting(false);
      }, 2000);
    }
  };

  function formatPhoneNumber(input: string): string {
    const cleaned = input.replace(/\D/g, "");

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    if (firstNameError || lastNameError || emailError || phoneError) {
      if (!resetForm) {
        setHasErrors(true);
      } else {
        setHasErrors(false);
      }
    } else {
      setHasErrors(false);
    }
  }, [firstNameError, lastNameError, emailError, phoneError]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    const overlay = document.querySelector(".overlay");
    overlay?.addEventListener("click", () => {
      setIsOpen(false);
    });
  }, []);

  return (
    <>
      <Button
        variant="custom"
        className="sign-up-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Sign up for updates
      </Button>

      <div className={`signUpModal${isOpen ? " open" : ""}`}>
        <div className="overlay" />
        <div className="modal">
          <button onClick={() => setIsOpen(false)} className="close">
            <X size={20} weight="bold" />
            <div className="sr-only">Close</div>
          </button>
          <p className="heading">My Career NJ User Sign Up Form</p>
          <p>
            Sign-up to stay up to date on the latest new features, news, and resources from My
            Career NJ.
          </p>
          {success ? (
            <>
              <div className="usa-alert usa-alert--success" role="alert">
                <div className="usa-alert__body">
                  <p className="usa-alert__heading">For submission successful.</p>
                  <p className="usa-alert__text">
                    Please check your email for confirmation. Lorem ipsum.
                  </p>
                </div>
              </div>
              <div className="buttons" style={{ marginTop: "1.5rem" }}>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Back to My Career NJ
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="instruction">
                A red asterick (<span className="red">*</span>) indicates a required field.
              </span>
              <form onSubmit={handleSubmission} onChange={() => setResetForm(false)}>
                <div className="row">
                  <label htmlFor="firstName" className={firstNameError ? "error" : ""}>
                    <span>First Name</span>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => {
                        if (firstName.length > 2) {
                          setFirstNameError("");
                        }
                        setFirstName(e.target.value);
                      }}
                    />
                    {firstNameError && <div className="errorMessage">{firstNameError}</div>}
                  </label>
                  <label htmlFor="lastName" className={lastNameError ? "error" : ""}>
                    <span>Last Name</span>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      placeholder="Smith"
                      onChange={(e) => {
                        if (lastName.length > 2) {
                          setLastNameError("");
                        }
                        setLastName(e.target.value);
                      }}
                    />
                    {lastNameError && <div className="errorMessage">{lastNameError}</div>}
                  </label>
                </div>
                <label htmlFor="email" className={`email${emailError ? " error" : ""}`}>
                  <span>
                    Email <span className="red">*</span>
                  </span>
                  <div>
                    <EnvelopeSimple size={20} weight="bold" />
                    <input
                      type="text"
                      value={email}
                      id="email"
                      placeholder="example@email.com"
                      onChange={(e) => {
                        if (email && email.includes("@")) {
                          setEmailError("");
                        }

                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  {emailError && <div className="errorMessage">{emailError}</div>}
                </label>
                <label htmlFor="phone" className={phoneError ? "error" : ""}>
                  <span>Mobile phone number</span>
                  US phone numbers only
                  <input
                    type="text"
                    value={formatPhoneNumber(phone)}
                    id="phone"
                    placeholder="___-___-____"
                    onChange={(e) => {
                      if (e.target.value.length > 11) {
                        setPhoneError("");
                      }
                      setPhone(formatPhoneNumber(e.target.value));
                    }}
                  />
                  {phoneError && <div className="errorMessage">{phoneError}</div>}
                </label>
                {hasErrors && (
                  <div className="usa-alert usa-alert--error" role="alert">
                    <div className="usa-alert__body">
                      <p className="usa-alert__text">
                        There are items that require your attention.
                      </p>
                    </div>
                  </div>
                )}
                <div className="buttons">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setResetForm(false);
                    }}
                  >
                    {submitting && (
                      <div className="spinner">
                        <CircleNotch size={20} weight="bold" />
                      </div>
                    )}
                    {submitting ? "Submitting" : "Submit form"}
                  </Button>
                  <button
                    className="usa-button usa-button--unstyled"
                    onClick={() => {
                      setFirstName("");
                      setLastName("");
                      setEmail("");
                      setPhone("");
                      setFirstNameError("");
                      setLastNameError("");
                      setPhoneError("");
                      setEmailError("");
                      setHasErrors(false);
                      setResetForm(true);
                      setSubmitting(false);
                    }}
                  >
                    Reset form
                  </button>
                </div>
              </form>
              <p>
                Read about our <a href="/privacy-policy">privacy policy</a> and our{" "}
                <a href="/terms-of-use">terms of use</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};
