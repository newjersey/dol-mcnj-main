export const removeSearchParams = (keyArray: { key: string }[]) => {
  const q = new URL(window.location.href);
  const sParams = q.searchParams;

  keyArray.forEach((key) => {
    sParams.delete(key.key);
  });

  window.history.pushState({}, "", `${window.location.pathname}?${sParams}`);
};

export const updateSearchParamsNavigate = async (
  keyValueArray: { key: string; value: string }[],
  getSearchData: (searchParams: any) => Promise<any>,
  setResults?: (results: any) => void
) => {
  const q = new URL(window.location.href);
  const sParams = q.searchParams;

  keyValueArray.forEach((keyValue) => {
    if (
      !keyValue.value ||
      keyValue.value === "" ||
      keyValue.value === "false"
    ) {
      sParams.delete(keyValue.key);
    } else {
      sParams.set(keyValue.key, keyValue.value);
    }
  });

  window.history.pushState({}, "", `${window.location.pathname}?${sParams}`);

  const searchParamObject = {
    searchParams: Object.fromEntries(sParams.entries()),
  };

  const searchProps = await getSearchData(searchParamObject as any);

  if (setResults) {
    setResults(searchProps);
  }
};

export const updateSearchParams = (key: string, value: string) => {
  const q = new URL(window.location.href);
  const sParams = q.searchParams;

  if (!value || value === "" || value === "false") {
    sParams.delete(key);
  } else {
    sParams.set(key, value);
  }
};

export const extractParam = (param: string, results: any) => {
  const q = new URLSearchParams(results.searchParams);
  return q.get(param);
};
