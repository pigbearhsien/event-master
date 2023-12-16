import { useCallback, useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import * as api from "../../api/api";
import { useUser } from "@clerk/clerk-react";
import { EventPrivate } from "../typing/typing.d";

type Props = {};
const DashboardCalendar = () => {
  const { user } = useUser();
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

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<any>([]);
  const [fetched, setFetched] = useState(false);
  const fetchDashboard = async () => {
    setFetched(true);
    console.log("fetch");
    var data_events: any;
    try {
      if (!user) return;
      data_events = await api.getGroupEvents(user?.id);
      console.log(data_events.data);
    } catch (e: any) {
      console.log(e);
    }
    var data_private_events: any;
    try {
      if (!user) return;
      data_private_events = await api.getPrivateEvents(user?.id);
      console.log(data_private_events);
    } catch (e: any) {
      console.log(e);
    }

    let newEventData: any[] = [];
    await data_events?.data.map((event) => {
      var eventWithIsPrivate: any = {
        description: event.description,
        end: new Date(event.event_end),
        eventId: event.eventid,
        isPrivate: false,
        start: new Date(event.event_start),
        title: event.name,
      };
      newEventData.push(eventWithIsPrivate);
    });

    await data_private_events?.data.map((event) => {
      var eventWithIsPrivate: any = {
        description: event.description,
        end: new Date(event.event_end),
        eventId: event.eventid,
        isPrivate: true,
        start: new Date(event.event_start),
        title: event.name,
      };
      newEventData.push(eventWithIsPrivate);
    });

    setEventData(newEventData);
    setLoading(false);
  };
  if (fetched == false) fetchDashboard();


  const handleSaveEvent = async () => {
    if (mode === "Creating") {
      try {
        var newData: EventPrivate = {
          eventid: uuidv4(),
          userid: user?.id,
          name: eventDetails.title,
          description: eventDetails.description,
          event_start: eventDetails.startTime,
          event_end: eventDetails.endTime,
        };
        const response = await api.createPrivateEvent(newData);
        console.log(response.data);
        setEventData([...eventData, newData]);
      } catch (error) {
        console.error(error);
      }
    }
    if (mode === "Editing") {
      try {
        console.log(eventDetails.eventId);
        var data: EventPrivate = {
          eventid: eventDetails.eventId,
          userid: user?.id,
          name: eventDetails.title,
          description: eventDetails.description,
          event_start: eventDetails.startTime,
          event_end: eventDetails.endTime,
        };
        console.log(data);
        const response = await api.updatePrivateEvent(data, eventDetails.eventId);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    console.log(eventData);
  }, [eventData]);

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
              // events={allEvents}
              events={eventData}
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
                <Button variant="contained" onClick={handleSaveEvent}>Save</Button>
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
                    <Button variant="contained" className=" ml-1"
                      onClick={async () => {
                        try {
                          await api.deletePrivateEvent(eventDetails.eventId);
                          setEventData(eventData.filter((event) => event.eventId !== eventDetails.eventId));
                          handleCloseEvent();
                        } catch (error) {
                          console.error(error);
                        }
                      }}>
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
