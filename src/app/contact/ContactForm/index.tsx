"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Heading } from "@components/modules/Heading";
import { LinkObject } from "@components/modules/LinkObject";
import { Flex } from "@components/utility/Flex";
import { useEffect, useState } from "react";
import { topics } from "./topics";
import { resetForm } from "./resetForm";
import { Box } from "@components/utility/Box";
import { Spinner } from "@components/modules/Spinner";

export const ContactForm = () => {
  const [messageCharacterCount, setMessageCharacterCount] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [topicError, setTopicError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageError, setMessageError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFormSubmit = async () => {
    const formValues = JSON.stringify({ email, topic: selectedTopic, message });
    const response = await fetch(
      `${process.env.REACT_APP_SITE_URL}/api/sendEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formValues,
      },
    );

    if (response.ok) {
      setSuccess(true);
      setError(false);
      setLoading(false);
    } else {
      setError(true);
      setSuccess(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messageCharacterCount > 1000) {
      setMessageError("Cannot be more than 1000 characters");
    } else {
      setMessageError("");
    }
  }, [messageCharacterCount]);

  const resetObject = {
    setEmail,
    setSelectedTopic,
    setMessage,
    setMessageCharacterCount,
    setEmailError,
    setTopicError,
    setMessageError,
    setSuccess,
    setError,
    setLoading,
  };

  return (
    <Box
      radius={5}
      className={`bg-${success ? "success-lighter" : error ? "error-lighter" : "info-lighter"} form-container`}
    >
      {success ? (
        <>
          <h2>Success!</h2>
          <p>
            Your message has been sent and we will do our best to respond within
            3-5 business days. Be sure to check your spam folder for any
            communications.
          </p>
          <Button
            type="button"
            disabled={loading}
            className="reset-button"
            onClick={() => {
              // refresh window
              window.location.reload();
            }}
          >
            <strong>Reset Form</strong>
          </Button>
        </>
      ) : error ? (
        <>
          <h2>Submission Error</h2>
          <p>
            There was an error with your submission and our team has been
            alerted. You can reset the form and try your message again.
          </p>
          <Button
            type="button"
            disabled={loading}
            className="reset-button"
            onClick={() => {
              // refresh window
              window.location.reload();
            }}
          >
            <strong>Reset Form</strong>
          </Button>
        </>
      ) : (
        <form
          className="contactForm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Flex direction="column" className="inner" fill>
            <div className="heading-content">
              <Heading level={3}>Contact Form</Heading>
              <p>
                Please reach out to us with your questions or comments. Our
                staff at the Department of Labor and Workforce office will get
                back with you in 3-5 business days.
                <br />
                <br />
                <small>
                  A red asterisk (<span className="text-error">*</span>)
                  indicates a required field.
                </small>
              </p>
            </div>

            <Flex gap="lg" direction="column" className="inner" fill>
              <FormInput
                label="Email"
                required
                disabled={loading}
                inputId="email"
                error={
                  emailError ? "Please enter a valid email address" : undefined
                }
                onChange={(e) => {
                  setEmailError(false);
                  setEmail(e.target.value);

                  if (emailError) {
                    setEmailError(!validateEmail(email));
                  }
                }}
                onBlur={() => {
                  setEmailError(!validateEmail(email));
                }}
                type="email"
                placeholder="Email"
              />
              <Flex direction="column" gap="xs">
                <p className="label">
                  <strong>
                    Please select a topic <span className="text-error">*</span>
                  </strong>
                </p>
                {topics.map((topic, index) => {
                  const isLast = index === topics.length - 1;
                  return (
                    <FormInput
                      label={topic.label}
                      type="radio"
                      name="topics"
                      disabled={loading}
                      error={
                        topicError && isLast
                          ? "Please select an option"
                          : undefined
                      }
                      inputId={topic.value}
                      className={topicError && !isLast ? "error" : ""}
                      onChange={() => {
                        setTopicError(false);
                        setSelectedTopic(topic.value);
                      }}
                      key={topic.value}
                    />
                  );
                })}
              </Flex>
              <FormInput
                label="Your message"
                required
                inputId="message"
                type="textarea"
                disabled={loading}
                error={messageError || undefined}
                onChangeArea={(e) => {
                  setMessageError("");
                  setMessageCharacterCount(e.target.value.length);
                  setMessage(e.target.value);
                }}
                counter={{
                  limit: 1000,
                  count: messageCharacterCount,
                }}
                placeholder="Your message"
              />
              <Flex gap="xs" alignItems="center">
                <Button
                  type="button"
                  className="submit-button"
                  disabled={
                    loading || emailError || topicError || messageError !== ""
                  }
                  onClick={() => {
                    setLoading(true);
                    if (!selectedTopic) {
                      setTopicError(true);
                      setLoading(false);
                    }

                    if (!email || !validateEmail(email)) {
                      setEmailError(true);
                      setLoading(false);
                    }

                    if (!message) {
                      setMessageError("Please enter a message.");
                      setLoading(false);
                    }

                    if (
                      !emailError &&
                      !topicError &&
                      !messageError &&
                      email &&
                      selectedTopic &&
                      message
                    ) {
                      handleFormSubmit();
                    }
                  }}
                >
                  Submit
                  {loading && <Spinner size={16} />}
                </Button>
                <Button
                  type="button"
                  unstyled
                  disabled={loading}
                  className="reset-button"
                  onClick={() => {
                    resetForm(resetObject);
                  }}
                >
                  <strong>Clear Form</strong>
                </Button>
              </Flex>
            </Flex>
            <p>
              Read about our{" "}
              <LinkObject url="https://www.nj.gov/nj/privacy.html">
                privacy policy.
              </LinkObject>
            </p>
          </Flex>
        </form>
      )}
    </Box>
  );
};
