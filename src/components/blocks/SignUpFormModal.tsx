import { useEffect, useRef, useState } from "react";

import { CircleNotch, X } from "@phosphor-icons/react";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Alert } from "@components/modules/Alert";
import { SIGNUP_FORM as contentData } from "@data/global/signupForm";
import { SupportedLanguages } from "@utils/types/types";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export const SignUpFormModal = ({ lang }: { lang: SupportedLanguages }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [hasErrors, setHasErrors] = useState<string>("");
  const [resetForm, setResetForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const modalRef = useRef<HTMLDivElement | null>(null);

  const updateTabIndex = (enable: boolean) => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach((element) => {
        element.setAttribute("tabindex", enable ? "0" : "-1");
      });
    }
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resetForm) return;

    const allErrorCheck = () => {
      if (
        (firstName.length !== 0 && firstName.length < 2) ||
        (lastName.length !== 0 && lastName.length < 2) ||
        !email ||
        (email && !emailRegex.test(email)) ||
        (phone && phone.length < 12)
      ) {
        return true;
      } else {
        return false;
      }
    };

    // check if first name has 2 or more characters
    if (firstName.length !== 0 && firstName.length < 2) {
      setFirstNameError(contentData[lang].form.error.firstName);
    } else {
      setFirstNameError("");
    }

    // check if last name has 2 or more characters
    if (lastName.length !== 0 && lastName.length < 2) {
      setLastNameError(contentData[lang].form.error.lastName);
    } else {
      setLastNameError("");
    }

    // check if there is entered email and is valid
    if (!email) {
      setEmailError(contentData[lang].form.error.emailRequired);
    } else if (email && !email.includes("@")) {
      setEmailError(contentData[lang].form.error.emailInvalid);
    } else {
      setEmailError("");
    }

    // check if phone number is valid
    if (phone && phone.length < 12) {
      setPhoneError(contentData[lang].form.error.phone);
    } else {
      setPhoneError("");
    }

    if (allErrorCheck()) {
      setSubmitting(false);
      setHasErrors(contentData[lang].form.error.attention);
      return;
    }

    const formData = {
      firstName,
      lastName,
      email,
      phone,
    };

    try {
      setSubmitting(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setHasErrors("");
      } else {
        setSuccess(false);
        setHasErrors(
          result.error ||
            "There was an error submitting the form. Please try again."
        );
      }
    } catch (error) {
      console.error("ERROR:", error);
      setSuccess(false);
      setHasErrors(
        "There was an error connecting to the server. Please try again later."
      );
    }

    setSubmitting(false);
  };

  function formatPhoneNumber(input: string): string {
    const cleaned = input.replace(/\D/g, "");

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    updateTabIndex(isOpen);
    return () => updateTabIndex(false);
  }, [isOpen]);

  useEffect(() => {
    if (firstNameError || lastNameError || emailError || phoneError) {
      if (!resetForm) {
        setHasErrors("There are items that require your attention.");
      } else {
        setHasErrors("");
      }
    } else {
      setHasErrors("");
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
        {...contentData[lang].headerButton}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />

      <div
        ref={modalRef}
        className={`signUpModal${isOpen ? " open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="overlay" />
        <div className="modal">
          <button onClick={() => setIsOpen(false)} className="close">
            <X size={20} weight="bold" />
            <div className="sr-only">Close</div>
          </button>
          <p className="heading">{contentData[lang].heading}</p>

          <p>{contentData[lang].message}</p>
          {success ? (
            <>
              <Alert
                heading="For submission successful."
                copy="Please check your email for confirmation."
                type="success"
              />
              <div className="buttons" style={{ marginTop: "1.5rem" }}>
                <Button
                  type="button"
                  defaultStyle="primary"
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
                {contentData[lang].instruction[0]} (
                <span className="require-mark text-error">*</span>){" "}
                {contentData[lang].instruction[1]}
              </span>
              <form
                onSubmit={handleSubmission}
                onChange={() => setResetForm(false)}
              >
                <div className="row">
                  <FormInput
                    type="text"
                    label={contentData[lang].form.fields.firstName.label}
                    inputId="firstName"
                    value={firstName}
                    placeholder={
                      contentData[lang].form.fields.firstName.placeholder
                    }
                    error={firstNameError}
                    onChange={(e) => {
                      if (firstName.length > 2) {
                        setFirstNameError("");
                      }
                      setFirstName(e.target.value);
                    }}
                  />
                  <FormInput
                    type="text"
                    label={contentData[lang].form.fields.lastName.label}
                    inputId="lastName"
                    value={lastName}
                    placeholder={
                      contentData[lang].form.fields.lastName.placeholder
                    }
                    error={lastNameError}
                    onChange={(e) => {
                      if (lastName.length > 2) {
                        setLastNameError("");
                      }
                      setLastName(e.target.value);
                    }}
                  />
                </div>

                <FormInput
                  type="text"
                  label={contentData[lang].form.fields.email.label}
                  inputId="email"
                  value={email}
                  requiredIndicator
                  placeholder={contentData[lang].form.fields.email.placeholder}
                  error={emailError}
                  onChange={(e) => {
                    if (email && email.includes("@")) {
                      setEmailError("");
                    }

                    setEmail(e.target.value);
                  }}
                />
                <label htmlFor="phone" className={phoneError ? "error" : ""}>
                  <span>{contentData[lang].form.fields.email.label}</span>
                  {contentData[lang].form.fields.phone.description}
                  <input
                    type="text"
                    value={formatPhoneNumber(phone)}
                    id="phone"
                    placeholder={
                      contentData[lang].form.fields.phone.placeholder
                    }
                    onChange={(e) => {
                      if (e.target.value.length > 11) {
                        setPhoneError("");
                      }
                      setPhone(formatPhoneNumber(e.target.value));
                    }}
                  />
                  {phoneError && (
                    <div className="errorMessage">{phoneError}</div>
                  )}
                </label>
                {hasErrors && <Alert copy={hasErrors} type="error" />}
                <div className="buttons">
                  <Button
                    type="submit"
                    defaultStyle="primary"
                    onClick={() => {
                      setResetForm(false);
                    }}
                  >
                    {submitting && (
                      <div className="spinner">
                        <CircleNotch size={20} weight="bold" />
                      </div>
                    )}
                    {submitting
                      ? contentData[lang].form.submitButton[1]
                      : contentData[lang].form.submitButton[0]}
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
                      setHasErrors("");
                      setResetForm(true);
                      setSubmitting(false);
                    }}
                  >
                    {contentData[lang].form.resetButton}
                  </button>
                </div>
              </form>
              <span
                className="footerCopy"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHTML(contentData[lang].form.footer),
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
