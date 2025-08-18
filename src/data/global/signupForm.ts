import { ButtonProps } from "@utils/types";

export const SIGNUP_FORM = {
  en: {
    headerButton: {
      type: "button",
      outlined: true,
      className: "sign-up-toggle",
      label: "Sign Up for Updates",
    } as ButtonProps,
    heading: "My Career NJ User Sign-Up Form",
    message:
      "Sign up for emails to learn about tools and resources to help you advance your career.",
    instruction: ["A red asterick", "indicates a required field"],
    languageMessage: [
      "Esta form está disponible en español.",
      "Haga clic aquí para traducirla.",
    ],
    form: {
      submitLabel: "Submit",
      footer:
        "Read about our [privacy policy](https://www.nj.gov/nj/privacy.html).",
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
    heading: "Formulario de Registro de Usuario de Mi Carrera NJ",
    languageMessage: [
      "This form is available in English.",
      "Click here to translate.",
    ],
    message:
      "Regístrese para recibir correos electrónicos y conocer las herramientas y recursos  que le ayudarán a avanzar en su carrera.",
    instruction: ["Un asterisco rojo", "indica un campo obligatorio"],
    form: {
      submitLabel: "Enviar",
      footer:
        "Lea sobre nuestra [política de privacidad](https://www.nj.gov/nj/privacy.html).",
      fields: {
        firstName: {
          label: "Primer Nomb",
          placeholder: "Jane",
        },
        lastName: {
          label: "Apellido",
          placeholder: "Smith",
        },
        email: {
          label: "Correo electrónico",
          placeholder: "email@example.com",
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
