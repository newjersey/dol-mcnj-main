import ResetFormBtn from "./ResetFormBtn"

const ContactError = () => {
  return (
    <section>
      <h2>Submission Error</h2>
      <p>
        There was an error with your submission and our team has been alerted. You can reset the form and try your message again.
      </p>
      <ResetFormBtn />
    </section>
  )
}

export default ContactError