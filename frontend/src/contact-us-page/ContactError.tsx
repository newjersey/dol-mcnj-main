import ResetFormBtn from "./ResetFormBtn"

const ContactError = ({
  resetForm
}: {
  resetForm: () => void
}) => {

  const handleReset = () => { resetForm() };

  return (
    <>
      <h2>Submission Error</h2>
      <p>
        There was an error with your submission and our team has been alerted. You can reset the form and try your message again.
      </p>
      <ResetFormBtn handleReset={handleReset} />
    </>
  )
}

export default ContactError