const ContactInfo = () => {
  return (
    <div className="contact-info-container">
      <div className="contact-container contact-info">
        <h2>Contact Information</h2>
        <div className="address-line">
          <strong>
            NJ Department of Labor and Workforce Development
          </strong>
        </div>
        <div className="address-line">
          Center for Occupational Employment Information (COEI)
        </div>
        <div className="address-line">
          PO Box 057, 5th Floor, Trenton, New Jersey 08625-0057
        </div>
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
    </div>
  )
}

export default ContactInfo