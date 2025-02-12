import { useEffect, useState } from "react";
import { Button } from "./Button";
import { CircleNotch, EnvelopeSimple, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export const SignUpFormModal = () => {
  const { t } = useTranslation();

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

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resetForm) return;
  
    setSubmitting(true);
    setHasErrors("");
  
    const allErrorCheck = () => {
      if (
        (firstName.length !== 0 && firstName.length < 2) ||
        (lastName.length !== 0 && lastName.length < 2) ||
        !email ||
        (email && !emailRegex.test(email)) ||
        (phone && phone.length < 12)
      ) {
        return true;
      }
      return false;
    };
  
    // Perform validations
    if (firstName.length !== 0 && firstName.length < 2) {
      setFirstNameError(t("SignUpFormModal.firstNameError"));
    } else {
      setFirstNameError("");
    }
  
    if (lastName.length !== 0 && lastName.length < 2) {
      setLastNameError(t("SignUpFormModal.lastNameError"));
    } else {
      setLastNameError("");
    }
  
    if (!email) {
      setEmailError(t("SignUpFormModal.emailRequired"));
    } else if (!emailRegex.test(email)) {  
      setEmailError(t("SignUpFormModal.emailError"));
    } else {
      setEmailError("");
    }
  
    if (phone && phone.length < 12) {
      setPhoneError(t("SignUpFormModal.phoneError"));
    } else {
      setPhoneError("");
    }
  
    if (allErrorCheck()) {
      setSubmitting(false);
      setHasErrors(t("SignUpFormModal.attentionRequired"));
      return;
    }
  
    // Construct payload
    const formData = {
      firstName,
      lastName,
      email,
      phone,
    };
  
    try {
      const response = await fetch("/api/signup", {
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
      } else {
        setSuccess(false);
        setHasErrors(result.error || t("SignUpFormModal.errorMessage"));
      }
    } catch (error) {
      console.error("ERROR:", error);
      setSuccess(false);
      setHasErrors(t("SignUpFormModal.serverErrorMessage"));
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
        setHasErrors(t(""));
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
        variant="custom"
        className="sign-up-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {t("SignUpFormModal.buttonText")}
      </Button>

      <div className={`signUpModal${isOpen ? " open" : ""}`}>
        <div className="overlay" />
        <div className="modal">
          <button onClick={() => setIsOpen(false)} className="close">
            <X size={20} weight="bold" />
            <div className="sr-only">{t("SignUpFormModal.close")}</div>
          </button>
          {!success && (
            <>
              <p className="heading">{t("SignUpFormModal.formTitle")}</p>
              <p>
                {t("SignUpFormModal.formDescription")}
              </p>
            </>
          )}
          {success ? (
            <>
              <div className="usa-alert usa-alert--success" role="alert">
                <div className="usa-alert__body">
                  <p className="usa-alert__heading">{t("SignUpFormModal.successMessage")}</p>
                  <p className="usa-alert__text">{t("SignUpFormModal.confirmationMessage")}</p>
                </div>
              </div>
              <div className="buttons" style={{ marginTop: "1.5rem" }}>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  {t("SignUpFormModal.backToHomepage")}
                </Button>
              </div>
            </>
          ) : (
              <>
              <span className="instruction">
                <p>
                  {t("SignUpFormModal.requiredFieldIndicator.part1")}
                  (<span className="red">*</span>)
                  {t("SignUpFormModal.requiredFieldIndicator.part2")}
                </p>
              </span>
                <form onSubmit={handleSubmission} onChange={() => setResetForm(false)}>
                  <div className="row">
                    <label htmlFor="firstName" className={firstNameError ? "error" : ""}>
                      <span>{t("SignUpFormModal.firstNameLabel")}</span>
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
                      <span>{t("SignUpFormModal.lastNameLabel")}</span>
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
                    {t("SignUpFormModal.emailLabel")} <span className="red">*</span>
                  </span>
                    <div>
                      <EnvelopeSimple size={20} weight="bold"/>
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
                    <span>{t("SignUpFormModal.phoneLabel")}</span>
                    {t("SignUpFormModal.usPhoneOnlyLabel")}
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
                          <p className="usa-alert__text">{hasErrors}</p>
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
                            <CircleNotch size={20} weight="bold"/>
                          </div>
                      )}
                      {submitting ? t("SignUpFormModal.loadingMessage") : t("SignUpFormModal.submitButton")}
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
                      {t("SignUpFormModal.resetForm")}
                    </button>
                  </div>
                </form>
                <p>
                  {t("SignUpFormModal.readAboutOur")}{" "}
                  <a href="/privacy-policy" target="_blank"
                     rel="noopener noreferrer">{t("SignUpFormModal.privacyPolicy")}</a>{" "}
                  {t("SignUpFormModal.andOur")}{" "}
                  <a href="/sms-use-policy" target="_blank"
                     rel="noopener noreferrer">{t("SignUpFormModal.smsUsePolicy")}</a>.
                </p>
              </>
          )}
        </div>
      </div>
    </>
  );
};
