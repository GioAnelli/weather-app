import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { setTemperature, setWind } from "../../../utils/redux/unitsSlice";

export default function SettingSelector() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const temperatureUnit = useSelector((state) => state.units.temperature);
  const windSpeedUnit = useSelector((state) => state.units.wind);
  const [tempUnitTemporary, setTempUnitTemporary] = useState(temperatureUnit);
  const [windUnitTemporary, setWindUnitTemporary] = useState(windSpeedUnit);

  const handleTempChange = (event) => {
    setTempUnitTemporary(event.target.value);
  };
  const handleWindChange = (event) => {
    setWindUnitTemporary(event.target.value);
  };

  const handleClickOpen = () => {
    setWindUnitTemporary(windSpeedUnit);
    setTempUnitTemporary(temperatureUnit);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const handleSave = () => {
    dispatch(setTemperature(tempUnitTemporary));
    dispatch(setWind(windUnitTemporary));
    setOpen(false);
  };

  return (
    <div>
      <Button sx={{ color: "var(--black)" }} onClick={handleClickOpen}>
        Settings
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Select Units</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <p>Temperature</p>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={tempUnitTemporary}
                onChange={handleTempChange}
                input={<OutlinedInput />}
              >
                <MenuItem value={"C°"}>Celsius</MenuItem>
                <MenuItem value={"F°"}>Fahrenheit</MenuItem>
                <MenuItem value={"K°"}>Kelvin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <p>Wind Speed</p>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={windUnitTemporary}
                onChange={handleWindChange}
                input={<OutlinedInput />}
              >
                <MenuItem value={"kn"}>Knots</MenuItem>
                <MenuItem value={"km/h"}>Km/Hour</MenuItem>
                <MenuItem value={"m/s"}>Metres/Second</MenuItem>
                <MenuItem value={"mph"}>Miles/Hour</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
