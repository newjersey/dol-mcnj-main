const ContactInfo = () => {
  return (
    <>
      <div className="contact-container contact-info">
        <h2>Contact Information</h2>
        <p>
          <strong>
            NJ Department of Labor and Workforce Development
          </strong>
        </p>
        <p>
          Center for Occupational Employment Information (COEI)
        </p>
        <p>
          PO Box 057, 5th Floor, Trenton, New Jersey 08625-0057
        </p>
      </div>

      <div className="contact-container contact-info">
        <h2>How to report an issue with a training page:</h2>
        <p>
          <strong>If you are the owner of this training:</strong><br />
          Log in to IGX and update any information.
        </p>
        <p>
          <strong>If you are NOT the owner of this trainging:</strong><br />
          Reach out to us via our contact form. Please include the url of the training and any information that needs investigating.
        </p>
      </div>
    </>
  )
}

export default ContactInfo