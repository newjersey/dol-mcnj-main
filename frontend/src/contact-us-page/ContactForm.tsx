import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from "@material-ui/core";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { checkValidEmail } from "../utils/checkValidEmail";
import { useTranslation } from "react-i18next";

const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("Please enter an email")
      .test("valid-email", "Please enter a valid email", (val) => {
        if (val?.length) return checkValidEmail(val);
      }),
    topic: yup.string().required("Please select an option"),
    message: yup
      .string()
      .required("Please enter a message")
      .test("len", "Cannot be more than 1000 characters", (val) => {
        if (val?.length) return val.length <= 1000;
      }),
  })
  .required();

const ContactForm = ({
  defaultValues,
  setFormSuccess,
}: {
  defaultValues: {
    email: string;
    topic: string;
    message: string;
  };
  setFormSuccess: Dispatch<SetStateAction<boolean | undefined>>;
}) => {
  const { t } = useTranslation();

  const topics = [
    { label: t("ContactPage.formTopic1"), value: "in-demand-occupations" },
    { label: t("ContactPage.formTopic2"), value: "occupation-details" },
    { label: t("ContactPage.formTopic3"), value: "support-and-assistance" },
    { label: t("ContactPage.formTopic4"), value: "training-details" },
    { label: t("ContactPage.formTopic5"), value: "training-provider-resources" },
    { label: t("ContactPage.formTopic6"), value: "tuition-assistance" },
    { label: t("ContactPage.formTopic7"), value: "career-navigator" },
    { label: t("ContactPage.formTopic8"), value: "other" },
  ];

  const getTopicFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get("topic")?.toLowerCase().replace(/\s+/g, "-");
    return topics.some((t) => t.value === topicParam) ? topicParam : "";
  };

  const [preselectedTopic] = useState(getTopicFromUrl());

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      ...defaultValues,
      topic: preselectedTopic || "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (preselectedTopic) {
      setValue("topic", preselectedTopic);
    }
  }, [preselectedTopic, setValue]);

  const watchMessage = watch("message");

  const onSubmit = async (data: { email: string; topic: string; message: string }) => {
    const formValues = JSON.stringify(data);
    console.log(formValues);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formValues,
    });

    if (response.ok) {
      setFormSuccess(true);
    } else {
      setFormSuccess(false);
    }
  };

  return (
    <>
      <h2>{t("ContactPage.formHeading")}</h2>
      <p>{t("ContactPage.formDescription")}</p>
      <div className="required-instructions">
        {t("ContactPage.formRequiredInstructions1")} (<span className="required">*</span>){" "}
        {t("ContactPage.formRequiredInstructions2")}
      </div>
      <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <div className="label-container">
            <label htmlFor="email">{t("ContactPage.formEmailLabel")}</label>{" "}
            <span className="required">*</span>
          </div>
          <TextField
            fullWidth
            id="email"
            type="text"
            variant="outlined"
            placeholder={t("ContactPage.formEmailLabel")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EnvelopeSimple />
                </InputAdornment>
              ),
            }}
            error={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <div className="form-error-message" id="email-error">{errors.email?.message}</div>
        </div>
        <div className={`input-container${errors.topic ? " radio-errors" : ""}`}>
          <div className="label-container">
            <span id="topic-label">{t("ContactPage.formTopicLabel")}</span>{" "}
            <span className="required">*</span>
          </div>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby="topic-label"
                aria-describedby={errors.topic ? "topic-error" : undefined}
                role="radiogroup"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {topics.map((topic, index) => (
                  <FormControlLabel
                    key={index}
                    value={topic.value}
                    data-testid={`topic-${index}`}
                    control={<Radio classes={{ root: errors.topic ? "radio-error" : undefined }} />}
                    label={topic.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <div className="form-error-message" id="topic-error">{errors.topic?.message}</div>
        </div>
        <div className="input-container">
          <div className="label-container">
            <label htmlFor="message">{t("ContactPage.formMessageLabel")}</label>{" "}
            <span className="required">*</span>
          </div>
          <textarea
            id="message"
            className={errors.message ? "error-textarea" : ""}
            placeholder={t("ContactPage.formMessageLabel")}
            aria-describedby={errors.message ? "message-error" : "message-count"}
            {...register("message")}
          />
          <div
            id="message-count"
            className={`message-count ${getValues("message")?.length > 1000 || !!errors.message ? "required" : undefined}`}
          >
            {watchMessage ? `${getValues("message").length}` : `0`} / 1000
          </div>
          <div className="form-error-message" id="message-error">{errors.message?.message}</div>
        </div>
        <div className="button-container">
          <button type="submit" data-testid="submit-button" className="usa-button">
            {t("ContactPage.formSubmitButton")}
          </button>
          <button type="button" className="clear-button" onClick={() => reset()}>
            {t("ContactPage.formClearButton")}
          </button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
