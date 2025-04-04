import { ButtonProps } from "@utils/types";

export const SIGNUP_FORM = {
  en: {
    headerButton: {
      type: "button",
      outlined: true,
      className: "sign-up-toggle",
      label: "Sign Up for Updates",
    } as ButtonProps,
    heading: "My Career NJ User Sign Up Form",
    message:
      "Sign-up to stay up to date on the latest new features, news, and resources from My Career NJ.",
    instruction: ["A red asterick", "indicates a required field"],
    form: {
      submitLabel: "Submit",
      footer:
        "Read about our [privacy policy](/privacy-policy) and our [SMS use policy](/sms-use-policy).",
      fields: {
        firstName: {
          label: "First Name",
          placeholder: "Jane",
        },
        lastName: {
          label: "Last Name",
          placeholder: "Smith",
        },
        email: {
          label: "Email",
          placeholder: "email@example.com",
          requiredIndicator: true,
        },
        phone: {
          label: "Mobile phone number",
          placeholder: "___-___-____",
          description: "US phone numbers only",
        },
      },
      submitButton: ["Submit form", "Submitting"],
      resetButton: "Reset form",
      error: {
        general: "There was an error submitting the form. Please try again.",
        server:
          "There was an error connecting to the server. Please try again later.",
        attention: "There are items that require your attention.",
        phone: "Phone number invalid.",
        emailRequired: "Email is required.",
        emailInvalid: "Email is invalid.",
        firstName: "First name must be 2 or more characters.",
        lastName: "Last name must be 2 or more characters.",
      },
    },
  },
  es: {
    headerButton: {
      type: "button",
      outlined: true,
      className: "sign-up-toggle",
      label: "Regístrate para recibir actualizaciones",
    } as ButtonProps,
    heading: "Formulario de inscripción de usuario de My Career NJ",
    message:
      "Regístrate para mantenerte al día con las últimas funciones, noticias y recursos de My Career NJ.",
    instruction: ["Un asterisco rojo", "indica un campo obligatorio"],
    form: {
      submitLabel: "Enviar",
      footer:
        "Lee nuestra [política de privacidad](/privacy-policy) y nuestra [política de uso de SMS](/sms-use-policy).",
      fields: {
        firstName: {
          label: "Nombre",
          placeholder: "Jane",
        },
        lastName: {
          label: "Apellido",
          placeholder: "Smith",
        },
        email: {
          label: "Correo electrónico",
          placeholder: "correo@ejemplo.com",
          requiredIndicator: true,
        },
        phone: {
          label: "Número de teléfono móvil",
          placeholder: "___-___-____",
          description: "Solo números de teléfono de EE.UU.",
        },
      },
      submitButton: ["Enviar formulario", "Enviando"],
      resetButton: "Restablecer formulario",
      error: {
        general:
          "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
        server:
          "Hubo un error al conectar con el servidor. Por favor, inténtalo más tarde.",
        attention: "Hay elementos que requieren tu atención.",
        phone: "Número de teléfono no válido.",
        emailRequired: "El correo electrónico es obligatorio.",
        emailInvalid: "El correo electrónico no es válido.",
        firstName: "El nombre debe tener 2 o más caracteres.",
        lastName: "El apellido debe tener 2 o más caracteres.",
      },
    },
  },
};
