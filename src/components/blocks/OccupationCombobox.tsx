"use client";
import { Button } from "@components/modules/Button";
import { Autocomplete, TextField } from "@mui/material";
import { client } from "@utils/client";
import { collectAllItemsNormalized, Option } from "@utils/collectAllItems";
import { OCCUPATIONS_QUERY } from "queries/occupationsQuery";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const OccupationCombobox = ({
  style,
  className,
  compact = false,
  placeholder = "Start typing to filter job titles",
}: {
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
  placeholder?: string;
}) => {
  const router = useRouter();
  const [data, setData] = useState<Option[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<Option | null>(null);

  async function getOccupations() {
    const industry = await client({
      query: OCCUPATIONS_QUERY,
    });
    return { ...industry };
  }

  useEffect(() => {
    (async () => {
      const d = (await getOccupations()) as any;
      setData(collectAllItemsNormalized(d));
      setLoading(false);
    })();
  }, []);

  const options = useMemo<Option[]>(() => data ?? [], [data]);

  return (
    <div
      className={`occupationCombobox flex w-full items-center gap-4 max-w-[475px]${
        className ? ` ${className}` : ""
      }${compact ? " compact" : ""}`}
      style={style}
    >
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
            placeholder={loading ? "Loading..." : placeholder}
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
        style={{
          height: compact ? "44px" : "54px",
          marginRight: "0",
          width: "auto",
        }}
        onClick={() => {
          if (value) {
            // Use Next.js router for client-side navigation
            router.push(`/career-pathways/${value.value}`);
          }
        }}
      >
        Select
      </Button>
    </div>
  );
};
