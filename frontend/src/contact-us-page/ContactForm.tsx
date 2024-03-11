import { Dispatch, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField
} from "@material-ui/core";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { checkValidEmail } from "../utils/checkValidEmail";

const schema = yup.object()
  .shape({
    email: yup.string().required('Please enter an email').test('valid-email', 'Please enter a valid email', val => {
      if (val?.length) return checkValidEmail(val);
    }),
    topic: yup.string().required('Please select an option'),
    message: yup.string().required('Please enter a message').test('len', 'Cannot be more than 1000 characters', val => {
      if (val?.length) return val.length <= 1000;
    }),
  })
  .required();

const topics = [
  {
    label: 'In-demand Occupations',
    value: 'in-demand-occupations'
  },
  {
    label: 'Occupation Details',
    value: 'occupation-details'
  },
  {
    label: 'Support and Assistance',
    value: 'support-and-assistance'
  },
  {
    label: 'Training Details',
    value: 'training-details'
  },
  {
    label: 'Training Provider Resources',
    value: 'training-provider-resources'
  },
  {
    label: 'Tuition Assistance',
    value: 'tuition-assistance'
  },
  {
    label: 'Other / Not Listed',
    value: 'other'
  }
]

const ContactForm = ({
  defaultValues,
  setFormSuccess
}: {
  defaultValues: {
    email: string;
    topic: string;
    message: string;
  },
  setFormSuccess: Dispatch<SetStateAction<boolean | undefined>>
}) => {

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    watch
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchMessage = watch("message");

  // @ts-expect-error - TS doesn't know that the formValues state is being set
  const onSubmit = async (data) => {
    const formValues = JSON.stringify(data);
    console.log(formValues);
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      <h2>Contact Form</h2>
      <p>
        Please reach out to us with your questions or comments. Our staff at the Department of Labor and Workforce office will get back with you in 3-5 business days.
      </p>
      <div className="required-instructions">
        A red asterisk (<span className="required">*</span>) indicates a required field.
      </div>
      <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <div className="label-container">
            <label htmlFor="email">Email</label> <span className="required">*</span>
          </div>
          <TextField
            fullWidth
            id="email"
            type="text"
            variant="outlined"
            placeholder="Email"
            InputProps={{
              startAdornment: <InputAdornment position="start"><EnvelopeSimple /></InputAdornment>,
            }}
            error={!!errors.email}
            {...register("email")}
            onBlur={() => {

            }}
          />
          <div className="form-error-message">
            {errors.email?.message}
          </div>
        </div>
        <div className={`input-container${errors.topic ? ' radio-erros' : ''}`}>
          <div className="label-container">
            <label htmlFor="topic">Please select a topic</label> <span className="required">*</span>
          </div>
          <Controller
            name="topic"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-label="topic"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {topics.map((topic, index) => (
                  <FormControlLabel
                    key={index}
                    value={topic.value}
                    data-testid={`topic-${index}`}
                    control={
                      <Radio classes={{root: errors.topic ? 'radio-error' : undefined} } />
                    }
                    label={topic.label} />
                ))}
              </RadioGroup>
            )}
          />
          <div className="form-error-message">
            {errors.topic?.message}
          </div>
        </div>
        <div className="input-container">
          <div className="label-container">
            <label htmlFor="message">Your message</label> <span className="required">*</span>
          </div>
          <textarea
            id="message"
            className={errors.message ? 'error-textarea' : ''}
            placeholder="Your message"
            {...register("message")}
          />
          <div className={`message-count ${getValues("message")?.length > 1000 || !!errors.message ? 'required' : undefined}`}>
            {watchMessage ? `${getValues("message").length}` : `0`} / 1000
          </div>
          <div className="form-error-message">
            {errors.message?.message}
          </div>
        </div>
        <div className="button-container">
          <button type="submit" data-testid="submit-button" className="usa-button">Submit</button>
          <button type="button" className="clear-button" onClick={() => reset()}>
            Clear Form
          </button>
        </div>
      </form>
    </>
  )
}

export default ContactForm