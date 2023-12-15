import { useCallback, useState } from "react";
import Calendar from "@/partials/Calendar";
import {
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { allEvents } from "@/mockdata";
import { X } from "lucide-react";
import moment from "moment";

type Props = {};

const DashboardCalendar = () => {
  const [mode, setMode] = useState<"Editing" | "Creating" | "Viewing">(
    "Creating"
  );
  const [eventDetails, setEventDetails] = useState({
    isPrivate: true,
    eventId: "",
    startTime: moment(),
    endTime: moment().add(1, "hours"),
    title: "",
    description: "",
  });

  const handleSelectEvent = useCallback(
    (event) => {
      console.log(event);
      setMode("Viewing");
      setEventDetails({
        isPrivate: event.isPrivate,
        eventId: event.eventId,
        startTime: moment(event.start),
        endTime: moment(event.end),
        title: event.title,
        description: event.description,
      });
    },
    [setEventDetails, setMode]
  );

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setMode("Creating");
      setEventDetails({
        isPrivate: true,
        eventId: "",
        startTime: moment(start),
        endTime: moment(end),
        title: "",
        description: "",
      });
    },
    [setEventDetails, setMode]
  );

  const handleCloseEvent = () => {
    setMode("Creating");
    setEventDetails({
      isPrivate: true,
      eventId: "",
      startTime: moment(),
      endTime: moment().add(1, "hours"),
      title: "",
      description: "",
    });
  };

  const handleChange = (key, value) => {
    setEventDetails((prev) => ({ ...prev, [key]: value }));
  };

  const eventPropGetter = useCallback(
    (event, start, end, isSelected) => ({
      ...(!event.isPrivate && {
        style: {
          backgroundColor: "red",
        },
      }),
    }),
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box>
        <Grid container alignItems="start" columnSpacing={3}>
          <Grid item xs={9} className="h-screen overflow-y-scroll">
            <Calendar
              selectable
              dayLayoutAlgorithm="no-overlap"
              showMultiDayTimes
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              events={allEvents}
              views={{ month: true, week: true, day: true }}
              eventPropGetter={eventPropGetter}
            />
          </Grid>
          {mode !== "Viewing" ? (
            <Grid
              container
              item
              xs={3}
              columnSpacing={1}
              rowSpacing={2}
              justifyContent={"end"}
            >
              <Grid item xs={12}>
                <Typography variant="h6">
                  {mode === "Creating" ? "New Event" : "Edit Event"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="standard"
                  value={eventDetails.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  className="w-full"
                  label="Start Time"
                  value={eventDetails.startTime}
                  onChange={(newValue) => handleChange("startTime", newValue)}
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  className="w-full"
                  label="End Time"
                  value={eventDetails.endTime}
                  onChange={(newValue) => handleChange("endTime", newValue)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={eventDetails.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  minRows={5}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={handleCloseEvent}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Save</Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container item xs={3} rowSpacing={2} columnSpacing={1}>
              <Grid item xs={12}>
                <IconButton onClick={handleCloseEvent} sx={{ float: "right" }}>
                  <X />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">{eventDetails.title}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {eventDetails.startTime.format("dddd, MMM DD h:mm a")} -{" "}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {eventDetails.endTime.format("dddd, MMM DD h:mm a")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {eventDetails.description}
                </Typography>
              </Grid>
              {eventDetails.isPrivate && (
                <>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setMode("Editing");
                      }}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" className=" ml-1">
                      Delete
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default DashboardCalendar;
