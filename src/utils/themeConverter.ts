export const themeConverter = (theme: string) => {
  const buttonStyle =
    theme === "blue"
      ? "primary"
      : theme === "green"
        ? "secondary"
        : theme === "purple"
          ? "tertiary"
          : theme === "navy"
            ? "quaternary"
            : "quinary";
  return buttonStyle;
};
