import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { initGoogleAPI } from "./locationAutoComplete.js";
import { getPosition } from "../../apis/google/placeApi.js";
import { useDispatch } from "react-redux";
import { updatePositionAndWeather } from "../../utils/redux/positionSlice.js";

const autocompleteService = { current: null };

export default function MyLocationAutoComplete() {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const loaded = useRef(false);
  const dispatch = useDispatch();

  const setPosition = (position) => {
    dispatch(updatePositionAndWeather(position));
  };

  initGoogleAPI(loaded);

  const _fetch = useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(
          { ...request, types: ["(cities)"] },
          callback
        );
      }, 400),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    _fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, _fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        getPosition(newValue, setPosition);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a city"
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...restProps } = props; // Extract key

        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li key={key} {...restProps}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
