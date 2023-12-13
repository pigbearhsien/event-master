import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import moment from "moment";

type EventDetails = {
  eventId: string | undefined;
  name: string | undefined;
  description: string | undefined;
  eventStart: Date | undefined;
  eventEnd: Date | undefined;
  voteStart: Date | undefined;
  voteEnd: Date | undefined;
  voteDeadline: Date | undefined;
  havePossibility: boolean | undefined;
};

interface EventDetailsCradProps {
  eventDetails: EventDetails | undefined;
  setEventDetails: React.Dispatch<React.SetStateAction<EventDetails>>;
  mode: string;
  setMode: (mode: string) => void;
}

const EventDetailsCard = ({
  eventDetails,
  setEventDetails,
  mode,
  setMode,
}: EventDetailsCradProps) => {
  useEffect(() => {
    console.log(mode);
  }, [mode]);
  const handleChange = (field: keyof EventDetails, value: any) => {
    if (eventDetails) {
      setEventDetails({ ...eventDetails, [field]: value });
    }
  };

  const handleCloseEvent = () => {
    setMode("Viewing");
  };

  const renderDateTime = (date: Date | undefined) => {
    return date ? moment(date).format("MMM DD, h:mm a") : "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container padding={2} rowSpacing={2}>
        {/* 标题 */}
        <Grid item xs={12}>
          <Typography variant="h6">
            {mode === "Creating"
              ? "New Event"
              : mode === "Editing"
              ? "Edit Event"
              : "Event Details"}
          </Typography>
        </Grid>

        {/* 名称 */}
        <Grid item xs={12}>
          {mode !== "Viewing" ? (
            <TextField
              label="Title"
              variant="standard"
              value={eventDetails?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
            />
          ) : (
            <Typography>{eventDetails?.name}</Typography>
          )}
        </Grid>

        {/* 开始时间 */}
        {/* <Grid item xs={12}>
          {mode !== "Viewing" ? (
            <DateTimePicker
              label="Start Time"
              value={eventDetails?.eventStart}
              onChange={(newValue) => handleChange("eventStart", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          ) : (
            <Typography>{renderDateTime(eventDetails?.eventStart)}</Typography>
          )}
        </Grid> */}

        {/* 结束时间 */}
        {/* <Grid item xs={12}>
          {mode !== "Viewing" ? (
            <DateTimePicker
              label="End Time"
              value={eventDetails?.eventEnd}
              onChange={(newValue) => handleChange("eventEnd", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          ) : (
            <Typography>{renderDateTime(eventDetails?.eventEnd)}</Typography>
          )}
        </Grid> */}

        {/* 描述 */}
        <Grid item xs={12}>
          {mode !== "Viewing" ? (
            <TextField
              label="Description"
              value={eventDetails?.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              minRows={5}
              fullWidth
              multiline
            />
          ) : (
            <Typography>{eventDetails?.description}</Typography>
          )}
        </Grid>

        {/* 操作按钮 */}
        {mode !== "Viewing" && (
          <>
            <Grid item>
              <Button variant="outlined" onClick={handleCloseEvent}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained">Save</Button>
            </Grid>
          </>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default EventDetailsCard;
