import { useState, useEffect } from "react";
import { groupEvents } from "@/mockdata";
import { Grid } from "@mui/material";
import EventCard from "@/partials/EventCard";
import EventDetailsCard from "@/partials/EventDetailsCard";
import VotingModal from "@/partials/VotingModal";

type Props = {};

const GroupEvent = (props: Props) => {
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [voteModalEventId, setVoteModalEventId] = useState("");
  const [eventDetails, setEventDetails] = useState({
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

  const handleViewVotingModal = (eventId) => {
    setVoteModalOpen(true);
    setVoteModalEventId(eventId);
  };

  return (
    <>
      <VotingModal
        open={voteModalOpen}
        setOpen={setVoteModalOpen}
        eventId={voteModalEventId}
      />
      <Grid container xs={12} spacing={1}>
        <Grid container item xs={9} spacing={1}>
          {groupEvents.sort().map((event) => (
            <EventCard
              key={event.eventId} // 添加 key prop
              event={event}
              handleSelectEvent={handleSelectEvent}
              handleViewVotingModal={handleViewVotingModal}
              setMode={setMode}
            />
          ))}
        </Grid>
        <Grid item xs={3}>
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
