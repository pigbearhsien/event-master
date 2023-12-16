import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Grid, IconButton } from "@mui/material";
import moment from "moment";
import { Pencil, Trash } from "lucide-react";
import { EventGroupJoinUser } from "@/typing/typing.d";
import * as api from "@/api/api";
import { useUser } from "@clerk/clerk-react";

type StatusList = {
  [key: string]: {
    status: string;
    color: string;
    order: number;
  };
};

const statusList: StatusList = {
  In_Voting: { status: "Voting", color: "success", order: 4 },
  End_Voting: { status: "Voting End", color: "success", order: 3 },
  Not_Start_Yet: { status: "Incoming", color: "warning", order: 2 },
  On_Going: { status: "Ongoing", color: "error", order: 1 },
  Closure: { status: "End", color: "default", order: 5 },
};

interface EventCardProps {
  event: EventGroupJoinUser;
  handleSelectEvent: (event: any) => void;
  setMode: React.Dispatch<React.SetStateAction<"Editing" | "Creating" | "Viewing">>;
  handleViewVotingModal: (eventId: string) => void;
}

const EventCard = ({
  event,
  handleSelectEvent,
  setMode,
  handleViewVotingModal,
}: EventCardProps) => {
  const [isAccepted, setIsAccepted] = React.useState<boolean | null>(null);
  const { user } = useUser();
  // api: getUserJoinEvent
  const fetchUserJoinEvent = async () => {
    try {
      if(!user) return;
      const response = await api.getUserJoinEvent(event.eventId, user.id);
      console.log(response);
      setIsAccepted(response.data.isAccepted);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    fetchUserJoinEvent();
  }, [event]);

  return (
    <Grid item xs={6}>
      <Card
        sx={{ p: 2, ":hover": { boxShadow: 2, cursor: "pointer" } }}
        onClick={() => {
          handleSelectEvent(event);
          setMode("Viewing");
        }}
      >
        <CardContent sx={{ p: 0, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Chip
              size="small"
              color={statusList[event.status].color as any}
              label={statusList[event.status].status}
              variant="outlined"
            />

            <Box sx={{ marginLeft: "auto" }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectEvent(event);
                  setMode("Editing");
                }}
              >
                <Pencil size={15} />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Trash size={15} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            {event.status === "In_Voting" || event.status === "End_Voting" ? (
              <Typography sx={{ fontSize: 15 }} color="text.secondary">
                Deadline:{" "}
                {moment(event.voteDeadline).format("YYYY-MM-DD HH:mm")}
              </Typography>
            ) : (
              <Typography
                sx={{ fontSize: 15, fontWeight: "bold" }}
                color="text.primary"
                // sx={{ marginLeft: "auto" }}
              >
                {moment(event.eventStart).format("YYYY-MM-DD HH:mm")} -{" "}
                {moment(event.eventEnd).format("YYYY-MM-DD HH:mm")}
              </Typography>
            )}
          </Box>
          <Typography variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography color="text.secondary">
            organizer: {event.organizerName}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0,
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleViewVotingModal(event.eventId);
            }}
          >
            View Voting
          </Button>
          <Box sx={{ marginLeft: "auto" }}>
            {isAccepted !== null ? (
              isAccepted ? (
                <Typography
                  sx={{ fontSize: 15, fontWeight: "bold" }}
                  color="primary"
                >
                  Joined
                </Typography>
              ) : (
                <Typography
                  sx={{ fontSize: 15, fontWeight: "bold" }}
                  color="primary"
                >
                  Passed
                </Typography>
              )
            ) : (
              event.status === "Not_Start_Yet" && (
                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ marginRight: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Join
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Pass
                  </Button>
                </Box>
              )
            )}
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default EventCard;
