import { useState, useEffect } from "react";
import { groupEvents } from "@/mockdata";
import { Grid } from "@mui/material";
import EventCard from "@/partials/EventCard";
import EventDetailsCard from "@/partials/EventDetailsCard";
import VotingModal from "@/partials/VotingModal";
import * as api from "../../api/api";
import { useParams } from "react-router-dom";
import { EventGroup, EventGroupJoinUser } from "@/typing/typing.d";
import { AxiosResponse } from "axios";

type Props = {};

const GroupEvent = (props: Props) => {
  const { groupId } = useParams();
  const [events, setEvents] = useState<EventGroupJoinUser[]>([]);
  // const [fetched, setFetched] = useState(false);

  const fetchThisGroupEvent = async () => {
    let thisGroupEvent: AxiosResponse;
    try {
      if (!groupId) return;
      thisGroupEvent = await api.getGroupEventsWithId(groupId);
      // console.log(thisGroupEvent);
      // setEvents([])
      setEvents(thisGroupEvent.data);
      // thisGroupEvent.data.map((event) => {
      //   setEvents([...events, event]);
      // });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchThisGroupEvent();
  }, [groupId]);

  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [voteModalEvent, setVoteModalEvent] = useState<EventGroup | null>(null);
  
  const [eventDetails, setEventDetails] = useState<EventGroupJoinUser>({
    eventId: "",
    groupId: groupId,
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
  } as EventGroupJoinUser);
  const [mode, setMode] = useState<"Editing" | "Creating" | "Viewing">(
    "Creating"
  );

  const handleSelectEvent = (event: any) => {
    console.log(event);
    setMode("Viewing");
    setEventDetails({
      eventId: event.eventId,
      groupId: event.groupId,
      organizerId: event.organizerId,
      organizerName: event.organizerName,
      name: event.name,
      status: event.status,
      description: event.description,
      eventStart: event.eventStart,
      eventEnd: event.eventEnd,
      voteStart: event.voteStart,
      voteEnd: event.voteEnd,
      voteDeadline: event.voteDeadline,
      havePossibility: event.havePossibility,
    } as EventGroupJoinUser);
  };

  const handleViewVotingModal = (event: EventGroupJoinUser) => {
    // force casting into EventGroup
    event = event as Omit<EventGroup, 'organizerName' | 'organizerAccount' | 'organizerProfilePicUrl'> & {
      organizerName: string;
      organizerAccount: string;
      organizerProfilePicUrl: string | null;
    };

    setVoteModalOpen(true);
    setVoteModalEvent(event);
  };

  return (
    <>
      <VotingModal
        open={voteModalOpen}
        setOpen={setVoteModalOpen}
        event={voteModalEvent}
      />
      <Grid container xs={12} spacing={1}>
        <Grid container item xs={9} spacing={1}>
          {events.sort().map((event) => (
            <EventCard
              key={event.eventId} // 添加 key prop
              event={event}
              handleSelectEvent={handleSelectEvent}
              handleViewVotingModal={()=> {handleViewVotingModal(event)}}
              setMode={setMode}
            />
          ))}
        </Grid>
        <Grid item xs={3}>
          <EventDetailsCard
            setEvents={setEvents}
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
