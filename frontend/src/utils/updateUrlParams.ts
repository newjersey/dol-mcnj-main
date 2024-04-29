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

export const removeUrlParams = ({ keys }: { keys: string[] }): void => {
  const urlParams = new URLSearchParams(window.location.search);
  keys.forEach((key) => urlParams.delete(key));
  window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
};

export const toggleParams = ({
  condition,
  value,
  key,
  valid,
}: {
  condition: string | boolean | number;
  value: string;
  key: string;
  valid: boolean;
}): void => {
  if (condition) {
    updateUrlParams({ key, value, valid });
  } else {
    removeUrlParams({
      keys: [key],
    });
  }
};
