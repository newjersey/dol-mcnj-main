export const updateUrlParams = ({
  key,
  value,
  valid,
}: {
  key: string;
  value: string;
  valid: boolean;
}): void => {
  const urlParams = new URLSearchParams(window.location.search);
  if (valid) urlParams.set(key, value);
  window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
};
