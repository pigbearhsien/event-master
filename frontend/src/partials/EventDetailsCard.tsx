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
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { X } from "lucide-react";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import * as api from "@/api/api";
import { EventGroup, EventGroupCreate } from "@/typing/typing.d";

type EventDetails = {
  eventId: string | null;
  name: string | null;
  description: string | null;
  eventStart: Date | string | null;
  eventEnd: Date | string | null;
  voteStart: Date | string | null;
  voteEnd: Date | string | null;
  voteDeadline: Date | string | null;
  havePossibility: boolean ;
};

interface EventDetailsCradProps {
  eventDetails: EventDetails | undefined;
  setEventDetails: React.Dispatch<React.SetStateAction<EventDetails>>;
  mode: string;
  setMode: (mode: string) => void;
  setEvents: React.Dispatch<React.SetStateAction<EventGroup[]>>;
}

const EventDetailsCard = ({
  eventDetails,
  setEventDetails,
  mode,
  setMode,
  setEvents
}: EventDetailsCradProps) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
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

  const { groupId } = useParams();
  const { user } = useUser();
  const handleSaveEvent = async () => {
    console.log(eventDetails);
    if (!eventDetails || !groupId || !user) return;
    eventDetails.eventId = uuidv4();
    
    if (!eventDetails.voteStart || !eventDetails.voteEnd || !eventDetails.voteDeadline){
      setSnackBarOpen(true);
      return;
    }
    if (!(eventDetails.voteStart instanceof Date))
      eventDetails.voteStart = new Date(eventDetails.voteStart)
    if (!(eventDetails.voteEnd instanceof Date))
      eventDetails.voteEnd = new Date(eventDetails.voteEnd)
    if (!(eventDetails.voteDeadline instanceof Date))
      eventDetails.voteDeadline = new Date(eventDetails.voteDeadline)
    var data: EventGroupCreate = {
      eventId: uuidv4(),
      groupId: groupId,
      name: eventDetails.name?? "",
      description: eventDetails.description?? "",
      organizerId: user.id,
      voteStart: eventDetails.voteStart,
      voteEnd: eventDetails?.voteEnd,
      voteDeadline: eventDetails?.voteEnd,
      havePossibility: eventDetails.havePossibility,
    };
    const d = await api.createGroupEvent(data);
    const event = d.data
    // console.log(event)
    setEvents((events) => [...events, event]);
    
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
              <FormControlLabel
                label="Have Possibility"
                control={
                  <Checkbox
                    checked={eventDetails?.havePossibility}
                    onChange={(event)=>{handleChange("havePossibility", event.target.checked)}}
                  />
                }
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
              <Button variant="contained" onClick={handleSaveEvent}>
                Save
              </Button>
            </Grid>
          </>
        )}
      </Grid>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={() => {
          setSnackBarOpen(false);
        }}
      >
        <Alert severity="error">Please fill in everything</Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default EventDetailsCard;
