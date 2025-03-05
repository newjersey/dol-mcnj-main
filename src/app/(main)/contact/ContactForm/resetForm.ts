export const resetForm = ({
  setEmail,
  setSelectedTopic,
  setMessage,
  setMessageCharacterCount,
  setEmailError,
  setTopicError,
  setSuccess,
  setLoading,
  setError,
  setMessageError,
}: {
  setEmail: (value: string) => void;
  setSelectedTopic: (value: string) => void;
  setMessage: (value: string) => void;
  setMessageCharacterCount: (value: number) => void;
  setEmailError: (value: boolean) => void;
  setTopicError: (value: boolean) => void;
  setMessageError: (value: string) => void;
  setSuccess: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (value: boolean) => void;
}) => {
  setEmail("");
  setSelectedTopic("");
  setMessage("");
  setMessageCharacterCount(0);
  setEmailError(false);
  setTopicError(false);
  setMessageError("");
  setSuccess(false);
  setLoading(false);
  setError(false);

  const allRadios = document.querySelectorAll(
    'input[type="radio"]',
  ) as NodeListOf<HTMLInputElement>;
  allRadios.forEach((radio) => {
    radio.checked = false;
  });

  const textarea = document.querySelector(
    'textarea[name="message"]',
  ) as HTMLTextAreaElement;

  if (textarea) {
    textarea.value = "";
  }

  const emailInput = document.querySelector(
    'input[type="email"]',
  ) as HTMLInputElement;

  if (emailInput) {
    emailInput.value = "";
  }
};
