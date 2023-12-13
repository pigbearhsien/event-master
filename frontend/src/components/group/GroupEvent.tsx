import { useState, useEffect } from "react";
import { groupEvents } from "@/mockdata";
import { Grid } from "@mui/material";
import EventCard from "@/partials/EventCard";
import EventDetailsCard from "@/partials/EventDetailsCard";

type Props = {};

const GroupEvent = (props: Props) => {
  const [eventDetails, setEventDetails] = useState({
    eventId: "",
    name: "",
    description: "",
    eventStart: "",
    eventEnd: "",
    voteStart: "",
    voteEnd: "",
    voteDeadline: "",
    havePossibility: false,
  });
  const [mode, setMode] = useState<"Editing" | "Creating" | "Viewing">(
    "Creating"
  );

  const handleSelectEvent = (event) => {
    console.log(event);
    setMode("Viewing");
    setEventDetails({
      eventId: event.eventId,
      name: event.name,
      description: event.description,
      eventStart: event.eventStart,
      eventEnd: event.eventEnd,
      voteStart: event.voteStart,
      voteEnd: event.voteEnd,
      voteDeadline: event.voteDeadline,
      havePossibility: event.havePossibility,
    });
  };

  useEffect(() => {
    console.log(eventDetails);
  }, [eventDetails]);

  return (
    <>
      <Grid container xs={12} spacing={1}>
        <Grid container item xs={8} spacing={1}>
          {groupEvents.sort().map((event) => (
            <EventCard
              key={event.eventId} // 添加 key prop
              event={event}
              handleSelectEvent={handleSelectEvent}
              setMode={setMode}
            />
          ))}
        </Grid>
        <Grid item xs={4}>
          <EventDetailsCard
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            mode={mode}
            setMode={setMode}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default GroupEvent;
