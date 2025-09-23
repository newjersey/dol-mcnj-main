"use client";
import { Button } from "@components/modules/Button";
import { Autocomplete, TextField } from "@mui/material";
import { client } from "@utils/client";
import { collectAllItemsNormalized, Option } from "@utils/collectAllItems";
import { slugify } from "@utils/slugify";
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
      data-testid="occupation-combobox"
      className={`occupationCombobox flex w-full items-center gap-4 max-w-[475px]${
        className ? ` ${className}` : ""
      }${compact ? " compact" : ""}`}
      style={style}
    >
      <Autocomplete
        data-testid="occupation-autocomplete"
        options={options}
        disabled={loading}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        onInputChange={(_, inputValue) => {
          const match = options.find(
            (o) => o.label.toLowerCase() === inputValue.toLowerCase()
          );
            if (match) setValue(match);
        }}
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
        data-testid="occupation-select-button"
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
            // Get current URL params
            const url = new URL(window.location.href);
            // Get current industry from pathname
            const pathParts = url.pathname.split("/");
            // Derive industry slug either from current path or option value pattern 'industry?occupation=slug'
            let industry = pathParts[2];
            if (!industry) {
              industry = value.value.split('?')[0];
            }
            // Replace occupation and field params
            const params = new URLSearchParams(url.search);
            // Remove occupation so we can add it last
            params.delete("occupation");
            // If a field is selected elsewhere, preserve it
            // Otherwise, remove field param
            if (!params.get("field")) {
              params.delete("field");
            }
            // Build the new query string with occupation last
            let query = params.toString();
            const occSlug = slugify(value.label);
            query = query ? `${query}&occupation=${occSlug}` : `occupation=${occSlug}`;
            const newUrl = `/career-pathways/${industry}?${query}`;
            router.push(newUrl);
          }
        }}
      >
        Select
      </Button>
    </div>
  );
};
