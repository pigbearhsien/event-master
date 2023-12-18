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
import {
  EventGroup,
  EventGroupCreate,
  EventGroupJoinUser,
} from "@/typing/typing.d";

interface EventDetailsCradProps {
  eventDetails: EventGroupJoinUser;
  setEventDetails: React.Dispatch<React.SetStateAction<EventGroupJoinUser>>;
  mode: string;
  setMode: React.Dispatch<
    React.SetStateAction<"Editing" | "Creating" | "Viewing">
  >;
  setEvents: React.Dispatch<React.SetStateAction<EventGroupJoinUser[]>>;
}

const EventDetailsCard = ({
  eventDetails,
  setEventDetails,
  mode,
  setMode,
  setEvents,
}: EventDetailsCradProps) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [warnMsg, setWarnMsg] = useState("")

  useEffect(() => {
    if (warnMsg !== "")
      setSnackBarOpen(true)
  }, [warnMsg])

  const handleChange = (key: any, value: any) => {
    setEventDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleCloseEvent = () => {
    setMode("Creating");
    const new_empty_event: EventGroupJoinUser = {
      eventId: "",
      groupId: "",
      name: "",
      organizerId: "",
      organizerName: "",
      description: "",
      status: "",
      eventStart: null,
      eventEnd: null,
      voteStart: new Date(),
      voteEnd: new Date(),
      voteDeadline: new Date(),
      havePossibility: false,
      organizerAccount: "",
      organizerProfilePicUrl: null,
    };

    setEventDetails(new_empty_event);
  };

  const { groupId } = useParams();
  const { user } = useUser();
  const handleSaveEvent = async () => {
    if (mode === "Viewing") return;
    if (mode === "Editing") {
      if (eventDetails.organizerId != user?.id) {
        setWarnMsg("You are not organizer")
        return
      }
      const new_event: EventGroup = eventDetails as EventGroup;
      const d = await api.updateGroupEvent(new_event);
      console.log(d);
      setEvents((events) =>
        events.map((event) => {
          if (event.eventId === eventDetails.eventId) {
            return eventDetails as EventGroupJoinUser;
          }
          return event;
        })
      );

      setMode("Viewing");
      return;
    }
    console.log(eventDetails);
    if (!eventDetails || !groupId || !user) return;
    eventDetails.eventId = uuidv4();

    if (
      !eventDetails.name ||
      !eventDetails.voteStart ||
      !eventDetails.voteEnd ||
      !eventDetails.voteDeadline
    ) {
      setWarnMsg("Please fill in everything");
      return;
    }
    if (!(eventDetails.voteStart instanceof Date))
      eventDetails.voteStart = new Date(eventDetails.voteStart);
    if (!(eventDetails.voteEnd instanceof Date))
      eventDetails.voteEnd = new Date(eventDetails.voteEnd);
    if (!(eventDetails.voteDeadline instanceof Date))
      eventDetails.voteDeadline = new Date(eventDetails.voteDeadline);
    var data: EventGroupCreate = {
      eventId: uuidv4(),
      groupId: groupId,
      name: eventDetails.name ?? "",
      description: eventDetails.description ?? "",
      organizerId: user.id,
      voteStart: eventDetails.voteStart,
      voteEnd: eventDetails?.voteEnd,
      voteDeadline: eventDetails?.voteEnd,
      havePossibility: eventDetails.havePossibility,
    };
    const d = await api.createGroupEvent(data);
    const event = d.data;
    // console.log(event)
    // setEvents(()=>)
    setEvents((events) => [...events, event]);
    setMode("Viewing");
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
          {mode !== "Creating" && (
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
          {mode !== "Viewing" ? (
            <>
              <Typography sx={{ fontWeight: "bold" }}>Possibility?</Typography>
              <FormControlLabel
                label="Have Possibility"
                control={
                  <Checkbox
                    checked={eventDetails?.havePossibility}
                    onChange={(event) => {
                      handleChange("havePossibility", event.target.checked);
                    }}
                  />
                }
              />
              {mode === "Editing" ? (
                <>
                  <Typography sx={{ fontWeight: "bold" }}>Decide event time</Typography>
                  <DateTimePicker
                    minutesStep={30}
                    sx={{ mt: 1, width: "100%" }}
                    label="Event Start Time"
                    value={
                      eventDetails?.voteDeadline !== null
                        ? moment(eventDetails?.voteDeadline)
                        : null
                    }
                    onChange={(newValue) =>
                      handleChange("eventStart", newValue)
                    }
                  />
                  <DateTimePicker
                    minutesStep={30}
                    sx={{ mt: 1, width: "100%" }}
                    label="Event End Time"
                    value={
                      eventDetails?.voteDeadline !== null
                        ? moment(eventDetails?.voteDeadline)
                        : null
                    }
                    onChange={(newValue) =>
                      handleChange("eventEnd", newValue)
                    }
                  />
                </>
              ) : (
                <></>
              )}
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
                minutesStep={30}
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
                minutesStep={30}
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
                minutesStep={30}
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
        <Alert severity="error">{warnMsg}</Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default EventDetailsCard;
