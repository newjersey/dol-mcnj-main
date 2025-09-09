"use client";
import { Button } from "@components/modules/Button";
import { Autocomplete, TextField } from "@mui/material";
import { client } from "@utils/client";
import { collectAllItemsNormalized, Option } from "@utils/collectAllItems";
import { OCCUPATIONS_QUERY } from "queries/occupationsQuery";
import { useEffect, useMemo, useState } from "react";

export const OccupationSelector = () => {
  const [data, setData] = useState<Option[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<Option | null>(null);

  async function getOccupations(slug: string) {
    const industry = await client({
      query: OCCUPATIONS_QUERY,
      variables: { slug },
    });
    return { ...industry };
  }

  useEffect(() => {
    (async () => {
      const d = (await getOccupations("manufacturing")) as any;
      setData(collectAllItemsNormalized(d));
      setLoading(false);
    })();
  }, []);

  const options = useMemo<Option[]>(() => data ?? [], [data]);

  return (
    <div className="flex w-full items-center gap-4 max-w-[800px]">
      <Autocomplete
        options={options}
        disabled={loading}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        getOptionLabel={(opt) =>
          typeof opt === "string" ? opt : opt?.label ?? ""
        }
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={
              loading ? "Loading..." : "Start typing to filter job titles"
            }
          />
        )}
        autoHighlight
        className="w-full bg-white"
        includeInputInList
        clearOnBlur={false}
      />
      <Button
        defaultStyle="tertiary"
        type="button"
        disabled={loading}
        style={{ height: "54px" }}
        onClick={() => {
          if (value) window.location.href = `/career-pathways/${value.value}`;
        }}
      >
        Select
      </Button>
    </div>
  );
};
