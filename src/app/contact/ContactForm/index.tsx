"use client";
import { Button } from "@components/modules/Button";
import { FormInput } from "@components/modules/FormInput";
import { Flex } from "@components/utility/Flex";
import { useEffect, useState } from "react";
import { resetForm } from "./resetForm";
import { Box } from "@components/utility/Box";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { CONTACT_FORM as contentData } from "@data/global/contactForm";
import { SupportedLanguages } from "@utils/types/types";
import { Alert } from "@components/modules/Alert";
import { CircleNotchIcon } from "@phosphor-icons/react";

export const ContactForm = ({
  lang = "en",
  content,
}: {
  lang: SupportedLanguages;
  content?: {
    path?: string;
    title?: string;
  };
}) => {
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
      `/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formValues,
      }
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
      setMessageError(contentData[lang].form.error.messageCount);
    } else {
      setMessageError("");
    }
  }, [messageCharacterCount]);

  useEffect(() => {
    if (content?.path) {
      setSelectedTopic("training-details");
      setMessage(
        content?.path
          ? `Issue Report - Training Details Page: ${content.path}, ${content.title}
---
Please provide a description of the issue.`
          : ""
      );
    }
  }, [content]);

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
    <Box radius={5}>
      {success ? (
        <>
          <p className="heading text-success">
            {contentData[lang].form.success.heading}
          </p>
          <p>{contentData[lang].form.success.message}</p>
          <div className="buttons">
            <Button
              type="button"
              disabled={loading}
              className="reset-button"
              onClick={() => {
                window.location.reload();
              }}
            >
              <strong>{contentData[lang].form.resetButton}</strong>
            </Button>
          </div>
        </>
      ) : error ? (
        <>
          <p className="heading text-error">
            {contentData[lang].form.error.heading}
          </p>
          <p>{contentData[lang].form.error.general}</p>
          <div className="buttons">
            <Button
              type="button"
              disabled={loading}
              className="reset-button"
              onClick={() => {
                window.location.reload();
              }}
            >
              <strong>{contentData[lang].form.resetButton}</strong>
            </Button>
          </div>
        </>
      ) : (
        <form
          className="contactForm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Flex direction="column" gap="xs" className="inner" fill>
            <div className="heading-content">
              <p className="heading">{contentData[lang].heading}</p>
              <p>{contentData[lang].message}</p>
              <span className="instruction">
                {contentData[lang].instruction[0]} (
                <span className="text-error">*</span>){" "}
                {contentData[lang].instruction[1]}
              </span>
            </div>

            <Flex gap="md" direction="column" className="inner" fill>
              <FormInput
                label={contentData[lang].form.fields.email.label}
                required
                disabled={loading}
                inputId="email"
                error={
                  emailError
                    ? contentData[lang].form.error.emailInvalid
                    : undefined
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
                placeholder={contentData[lang].form.fields.email.placeholder}
              />
              <Flex direction="column" gap="xs">
                <FormInput
                  label={contentData[lang].form.fields.topicSelect.label}
                  type="select"
                  required
                  placeholder="Select an option"
                  options={[
                    ...contentData[lang].form.fields.topicSelect.options.map(
                      (topic) => ({
                        value: topic.value,
                        key: topic.label,
                      })
                    ),
                  ]}
                  name="topics"
                  disabled={loading}
                  error={
                    topicError
                      ? contentData[lang].form.error.topicRequired
                      : undefined
                  }
                  inputId="topic-select"
                  value={selectedTopic}
                  className={topicError ? "error" : ""}
                  onChangeSelect={(e) => {
                    setTopicError(false);
                    setSelectedTopic(e.target.value);
                  }}
                />
              </Flex>

              <FormInput
                label={contentData[lang].form.fields.yourMessage.label}
                required
                inputId="message"
                type="textarea"
                disabled={loading}
                defaultValue={message}
                error={
                  messageError
                    ? contentData[lang].form.error.messageRequired
                    : undefined
                }
                onChangeArea={(e) => {
                  setMessageError("");
                  setMessageCharacterCount(e.target.value.length);
                  setMessage(e.target.value);
                }}
                counter={{
                  limit: 1000,
                  count: messageCharacterCount,
                }}
                placeholder={
                  contentData[lang].form.fields.yourMessage.placeholder
                }
              />
              {(emailError || topicError || messageError) && (
                <Alert
                  type="error"
                  copy={contentData[lang].form.error.attention}
                />
              )}
              <div className="buttons">
                <Button
                  type="button"
                  className="submit-button"
                  // disabled={
                  //   loading || emailError || topicError || messageError !== ""
                  // }
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
                      setMessageError(
                        contentData[lang].form.error.messageRequired
                      );
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
                  {loading
                    ? contentData[lang].form.submitButton[1]
                    : contentData[lang].form.submitButton[0]}
                  {loading && (
                    <div className="spinner">
                      <CircleNotchIcon size={20} weight="bold" />
                    </div>
                  )}
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
                  <strong>{contentData[lang].form.resetButton}</strong>
                </Button>
              </div>
            </Flex>
            <span
              className="footerCopy"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(contentData[lang].form.footer),
              }}
            />
          </Flex>
        </form>
      )}
      <hr className="bg-[#CAC4D0] my-4 w-[calc(100%-2rem)] mx-auto" />
      <div
        className="address"
        dangerouslySetInnerHTML={{
          __html: parseMarkdownToHTML(contentData[lang].address),
        }}
      />
    </Box>
  );
};
