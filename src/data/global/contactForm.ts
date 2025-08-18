import { ButtonProps } from "@utils/types";

export const CONTACT_FORM = {
  en: {
    headerButton: {
      type: "button",
      outlined: true,
      className: "contact-us",
      label: "Contact Us",
    } as ButtonProps,
    heading: "Contact Form",
    message:
      "Please reach out to us with your questions or comments. Our staff at the Department of Labor and Workforce office will get back with you in 3-5 business days.",
    instruction: ["A red asterick", "indicates a required field"],
    form: {
      submitLabel: "Submit",
      footer:
        "Read about our [privacy policy](https://www.nj.gov/nj/privacy.html).",
      fields: {
        email: {
          label: "Email",
          requiredIndicator: true,
          placeholder: "Email",
        },
        topicSelect: {
          label: "Please select a topic",
          requiredIndicator: true,
          placeholder: "Select a topic",
          options: [
            {
              label: "In-demand Occupations",
              value: "in-demand-occupations",
            },
            {
              label: "Occupation Details",
              value: "occupation-details",
            },
            {
              label: "Support and Assistance",
              value: "support-and-assistance",
            },
            {
              label: "Training Details",
              value: "training-details",
            },
            {
              label: "Training Provider Resources",
              value: "training-provider-resources",
            },
            {
              label: "Tuition Assistance",
              value: "tuition-assistance",
            },
            {
              label: "Other / Not Listed",
              value: "other",
            },
          ],
        },
        yourMessage: {
          label: "Your message",
          placeholder: "Your message",
          requiredIndicator: true,
        },
      },
      submitButton: ["Submit form", "Submitting"],
      resetButton: "Reset form",
      success: {
        heading: "Success!",
        message:
          "Your message has been sent and we will do our best to respond within 3-5 business days. Be sure to check your spam folder for any communications.",
      },
      error: {
        heading: "Submission Error",
        message:
          "There was an error with your submission and our team has been alerted. You can reset the form and try your message again.",
        general: "There was an error submitting the form. Please try again.",
        server:
          "There was an error connecting to the server. Please try again later.",
        attention: "There are items that require your attention.",
        topicRequired: "Please select an option",
        emailRequired: "Email is required.",
        emailInvalid: "Please enter a valid email address",
        messageRequired: "Please enter a message",
        messageCount: "Cannot be more than 1000 characters",
      },
    },
  },
  es: {
    headerButton: {
      type: "button",
      outlined: true,
      className: "contact-us",
      label: "Contáctenos",
    },
    heading: "Formulario de contacto",
    message:
      "Comuníquese con nosotros con sus preguntas o comentarios. Nuestro personal del Departamento de Trabajo y Oficina de la Fuerza Laboral se comunicará con usted en 3 a 5 días hábiles.",
    instruction: ["Un asterisco rojo", "indica un campo obligatorio"],
    form: {
      submitLabel: "Enviar",
      footer:
        "Lea sobre nuestra [política de privacidad](https://www.nj.gov/nj/privacy.html).",
      fields: {
        email: {
          label: "Correo electrónico",
          requiredIndicator: true,
          placeholder: "Correo electrónico",
        },
        topicSelect: {
          label: "Seleccione un tema",
          requiredIndicator: true,
          placeholder: "Seleccione un tema",
          options: [
            {
              label: "Ocupaciones en demanda",
              value: "in-demand-occupations",
            },
            {
              label: "Detalles de la ocupación",
              value: "occupation-details",
            },
            {
              label: "Apoyo y asistencia",
              value: "support-and-assistance",
            },
            {
              label: "Detalles de la capacitación",
              value: "training-details",
            },
            {
              label: "Recursos para proveedores de capacitación",
              value: "training-provider-resources",
            },
            {
              label: "Asistencia con la matrícula",
              value: "tuition-assistance",
            },
            {
              label: "Otro / No en la lista",
              value: "other",
            },
          ],
        },
        yourMessage: {
          label: "Su mensaje",
          placeholder: "Su mensaje",
          requiredIndicator: true,
        },
      },
      submitButton: ["Enviar formulario", "Enviando"],
      resetButton: "Restablecer formulario",
      success: {
        heading: "¡Éxito!",
        message:
          "Su mensaje ha sido enviado y haremos todo lo posible para responder en un plazo de 3 a 5 días hábiles. Asegúrese de revisar su carpeta de correo no deseado para ver cualquier comunicación.",
      },
      error: {
        heading: "Error de envío",
        message:
          "Hubo un error con su envío y nuestro equipo ha sido alertado. Puede restablecer el formulario e intentar enviar su mensaje nuevamente.",
        general:
          "Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.",
        server:
          "Hubo un error al conectar con el servidor. Por favor, inténtelo de nuevo más tarde.",
        attention: "Hay elementos que requieren su atención.",
        topicRequired: "Por favor, seleccione una opción",
        emailRequired: "Se requiere un correo electrónico.",
        emailInvalid:
          "Por favor, introduzca una dirección de correo electrónico válida",
        messageRequired: "Por favor, introduzca un mensaje",
        messageCount: "No puede tener más de 1000 caracteres",
      },
    },
  },
};
