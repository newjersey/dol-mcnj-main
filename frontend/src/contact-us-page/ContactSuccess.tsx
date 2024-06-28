import ResetFormBtn from "./ResetFormBtn"

const ContactSuccess = ({
  resetForm
}: {
  resetForm: () => void
}) => {

  const handleReset = () => { resetForm() };

  return (
    <>
      <h2>Success!</h2>
      <p>
        Your message has been sent and we will do our best to respond within 3-5 business days. Be sure to check your spam folder for any communications.
      </p>
      <ResetFormBtn handleReset={handleReset} />
    </>
  )
}

export default ContactSuccess