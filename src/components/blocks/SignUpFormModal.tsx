import { useEffect, useRef, useState } from "react";

import { CircleNotchIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Alert } from "@components/modules/Alert";
import { SIGNUP_FORM as contentData } from "@data/global/signupForm";
import { SupportedLanguages } from "@utils/types/types";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { errorService } from "../../services/ErrorService";

export const SignUpFormModal = () => {
  const [lang, setLang] = useState<SupportedLanguages>("en");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
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
        (email && !emailRegex.test(email))
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

    if (allErrorCheck()) {
      setSubmitting(false);
      setHasErrors(contentData[lang].form.error.attention);
      return;
    }

    const formData = {
      firstName,
      lastName,
      email,
    };

    try {
      setSubmitting(true);
      const response = await fetch(`/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setHasErrors("");
        
        // Log successful signup
        errorService.logInfo('User signup completed successfully', {
          page: 'signup_modal',
          component: 'SignUpFormModal',
          action: 'form_submission',
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${result.error || 'Signup failed'}`);
      }
    } catch (error) {
      // Use ErrorService to handle the error
      const userMessage = errorService.handleApiError(error, '/api/signup', {
        page: 'signup_modal',
        component: 'SignUpFormModal',
        action: 'form_submission',
      });

      setSuccess(false);
      setHasErrors(userMessage || contentData[lang].form.error.server);
    }

    setSubmitting(false);
  };

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
    if (firstNameError || lastNameError || emailError) {
      if (!resetForm) {
        setHasErrors(contentData[lang].form.error.attention);
      } else {
        setHasErrors("");
      }
    } else {
      setHasErrors("");
    }
  }, [firstNameError, lastNameError, emailError, lang]);

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
        {...contentData.en.headerButton}
        iconPrefix="Megaphone"
        iconWeight="bold"
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
          <Alert type="global" className="langAlert">
            <>
              {contentData[lang].languageMessage[0]}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setLang(lang === "en" ? "es" : "en");
                }}
              >
                <>{contentData[lang].languageMessage[1]}</>
              </a>
            </>
          </Alert>
          <div className="inner">
            <button onClick={() => setIsOpen(false)} className="close">
              <XIcon size={20} weight="bold" />
              <div className="sr-only">Close</div>
            </button>
            <p className="heading">{contentData[lang].heading}</p>

            <p>{contentData[lang].message}</p>
            {success ? (
              <>
                <Alert
                  heading={contentData[lang].form.success.heading}
                  copy={contentData[lang].form.success.message}
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
                    {contentData[lang].form.success.button}
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
                    type="email"
                    label={contentData[lang].form.fields.email.label}
                    inputId="email"
                    value={email}
                    requiredIndicator
                    placeholder={
                      contentData[lang].form.fields.email.placeholder
                    }
                    error={
                      emailError
                        ? contentData[lang].form.error.emailInvalid
                        : undefined
                    }
                    onChange={(e) => {
                      if (email && email.includes("@")) {
                        setEmailError("");
                      }

                      setEmail(e.target.value);
                    }}
                  />
                  {hasErrors && (
                    <Alert
                      copy={
                        hasErrors === "alreadyExists"
                          ? `${contentData[lang].form.error.emailExists[0]} ${email} ${contentData[lang].form.error.emailExists[1]}`
                          : hasErrors
                      }
                      type="error"
                    />
                  )}
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
                          <CircleNotchIcon size={20} weight="bold" />
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
                        setFirstNameError("");
                        setLastNameError("");
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
      </div>
    </>
  );
};
