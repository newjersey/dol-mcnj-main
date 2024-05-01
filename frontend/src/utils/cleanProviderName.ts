export const cleanProviderName = (name: string): string => {
  const regex =
    /(\s-\s[A-Z]{2,}|[.][A-Z]{2,}|\s-[A-Z]{2,}|[.][A-Z]{2,}|_[A-Z]{2,}|_[A-Z]{2,}_[A-Z]{2,})/g;
  const fixedName = name.replace(regex, "");

  return fixedName;
};
