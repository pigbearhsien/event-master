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
  eventStart: Date | string | undefined;
  eventEnd: Date | string | undefined;
  voteStart: Date | string | undefined;
  voteEnd: Date | string | undefined;
  voteDeadline: Date | string | undefined;
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
  const handleChange = (key, value) => {
    setEventDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleCloseEvent = () => {
    setMode("Creating");
    setEventDetails({
      eventId: "",
      name: "",
      description: "",
      eventStart: null,
      eventEnd: null,
      voteStart: null,
      voteEnd: null,
      voteDeadline: null,
      havePossibility: false,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container paddingLeft={2} rowSpacing={2}>
        {/* 标题 */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h6">
            {mode === "Creating"
              ? "New Event"
              : mode === "Editing"
              ? "Edit Event"
              : "Event Details"}
          </Typography>
          {mode === "Viewing" && (
            <IconButton onClick={handleCloseEvent}>
              <X />
            </IconButton>
          )}
        </Grid>

        {/* 名称 */}
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: "bold" }}>Name</Typography>
          {mode !== "Viewing" ? (
            <TextField
              label="Name"
              variant="standard"
              value={eventDetails?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
            />
          ) : (
            <Typography>{eventDetails?.name}</Typography>
          )}
        </Grid>

        {/* 活動时间 */}
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: "bold" }}>Time</Typography>
          {mode !== "Viewing" ? (
            <>
              <DateTimePicker
                sx={{ mt: 1, width: "100%" }}
                label="Start Time"
                value={
                  eventDetails?.eventStart !== null
                    ? moment(eventDetails?.eventStart)
                    : null
                }
                onChange={(newValue) => handleChange("eventStart", newValue)}
              />
              <DateTimePicker
                sx={{ mt: 1, width: "100%" }}
                label="End Time"
                value={
                  eventDetails?.eventEnd !== null
                    ? moment(eventDetails?.eventEnd)
                    : null
                }
                onChange={(newValue) => handleChange("eventEnd", newValue)}
              />
            </>
          ) : eventDetails.eventStart && eventDetails.eventEnd ? (
            <>
              <Typography>
                {moment(eventDetails.eventStart).format("dddd, MMM DD h:mm a")}{" "}
                -{" "}
              </Typography>
              <Typography>
                {moment(eventDetails.eventEnd).format("dddd, MMM DD h:mm a")}
              </Typography>
            </>
          ) : (
            <Typography>Not Decided</Typography>
          )}
        </Grid>

        {/* 投票 */}
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: "bold" }}>Vote</Typography>
          {mode !== "Viewing" ? (
            <>
              <DateTimePicker
                sx={{ mt: 1, width: "100%" }}
                label="Vote Deadline"
                value={
                  eventDetails?.voteDeadline !== null
                    ? moment(eventDetails?.voteDeadline)
                    : null
                }
                onChange={(newValue) => handleChange("voteDeadline", newValue)}
              />
              <DateTimePicker
                sx={{ mt: 1, width: "100%" }}
                label="Vote Start Time"
                value={
                  eventDetails?.voteStart !== null
                    ? moment(eventDetails?.voteStart)
                    : null
                }
                onChange={(newValue) => handleChange("voteStart", newValue)}
              />
              <DateTimePicker
                sx={{ mt: 1, width: "100%" }}
                label="Vote End Time"
                value={
                  eventDetails?.voteEnd !== null
                    ? moment(eventDetails?.voteEnd)
                    : null
                }
                onChange={(newValue) => handleChange("voteEnd", newValue)}
              />
            </>
          ) : (
            <>
              <Typography>
                {moment(eventDetails?.voteStart).format("dddd, MMM DD h:mm a")}{" "}
                -{" "}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                {moment(eventDetails?.voteEnd).format("dddd, MMM DD h:mm a")}
              </Typography>
              <Typography>
                {"("}
                Deadline:{" "}
                {moment(eventDetails?.voteDeadline).format("MMM DD , h:mm a")}
                {")"}
              </Typography>
            </>
          )}
        </Grid>

        {/* 描述 */}
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: "bold" }}>Description</Typography>
          {mode !== "Viewing" ? (
            <TextField
              label="Description"
              value={eventDetails?.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              minRows={3}
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
            <Grid item sx={{ marginLeft: "auto", marginRight: 1 }}>
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
