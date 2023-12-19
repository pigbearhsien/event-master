import { useCallback, useState, useMemo, useEffect } from "react";

import ScheduleSelector from "react-schedule-selector";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  IconButton,
  DialogContentText,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import Calendar from "@/partials/Calendar";
import PropTypes from "prop-types";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import moment from "moment";
import { X } from "lucide-react";
// import { availbleHour } from "@/mockdata";
import "./VotingModal.css";
import { CreateAvailableTime } from "@/typing/typing.d";
import { useUser } from "@clerk/clerk-react";
import * as api from "@/api/api";

const VotingModal = ({ open, setOpen, event }) => {
  const { user } = useUser();
  function MyWeek({
    date,
    localizer,
    max = localizer.endOf(new Date(), "day"),
    min = localizer.startOf(new Date(), "day"),
    ...props
  }) {
    // console.log(date, localizer, max, min);
    const currRange = useMemo(
      () => MyWeek.range(date, { localizer }),
      [date, localizer]
    );

    return (
      <TimeGrid
        date={date}
        eventOffset={15}
        localizer={localizer}
        max={max}
        min={min}
        range={currRange}
        {...props}
      />
    );
  }

  MyWeek.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    localizer: PropTypes.object,
    max: PropTypes.instanceOf(Date),
    min: PropTypes.instanceOf(Date),
    scrollToTime: PropTypes.instanceOf(Date),
  };

  MyWeek.range = (date, { localizer }) => {
    const start = moment(event.voteStart).toDate();
    const end = moment(event.voteEnd).toDate();

    let current = start;
    const range = [];

    while (localizer.lte(current, end, "day")) {
      range.push(current);
      current = localizer.add(current, 1, "day");
    }

    return range;
  };

  MyWeek.title = (date) => {
    return `When to meet`;
  };

  const customDayPropGetter = (date) => {
    return {
      style: {
        width: "100%",
      },
    };
  };

  const [votingMode, setVotingMode] = useState("available"); // ["available", "maybeAvailable"]
  const [availableHour, setAvailableHour] = useState([]);
  const [maybeAvailableHour, setMaybeAvailableHour] = useState([]);
  const [showMabeAvailable, setShowMabeAvailable] = useState(false);
  const [resultHour, setResultHour] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectEvent = useCallback((event) => {
    console.log(event);
  }, []);

  const handleChange = (event) => {
    setShowMabeAvailable(event.target.checked);
  };

  const handleSave = async () => {
    var arr: CreateAvailableTime[] = [];
    availableHour.map((time: Date) => {
      if (!user) return;
      arr = [
        ...arr,
        {
          userId: user?.id,
          eventId: event.eventId,
          availableStart: time,
          possibilityLevel: "Definitely",
        },
      ];
    });

    maybeAvailableHour.map((time: Date) => {
      if (!user) return;
      arr = [
        ...arr,
        {
          userId: user.id,
          eventId: event.eventId,
          availableStart: time,
          possibilityLevel: "Maybe",
        },
      ];
    });
    console.log(arr);


    const res = await api.createAvailableTime(arr, user?.id as string, event.eventId);
    fetchResultHour()
    console.log(res);
  };

  const fetchResultHour = async () => {
    setLoading(true);
    try {
      const res = await api.getVoteResultCnt(event.eventId);
      console.log(res.data);
      var resultHourCpy: any[] = [];
      res.data.map((time) => {
        const mode = votingMode === "available" ? "Definitely" : "Maybe";
        if (time.possibilityLevel !== mode) return;
        const originalDate = new Date(time.availableStart);
        resultHourCpy = [
          ...resultHourCpy,
          {
            start: originalDate,
            end: new Date(originalDate.getTime() + 30 * 60000),
            title: "",
            availbleAmount: time.availableAmount,
          },
        ];
      });
      setAvailableHour(resultHourCpy.map((time) => time.start));
      setResultHour(resultHourCpy);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const eventPropGetter = useCallback(
    (event, start, end, isSelected) => ({
      ...{
        style: {
          backgroundColor: "green",
          opacity: event.availbleAmount / 5,
          borderRadius: "0px",
          border: "none",
          color: "green",
        },
      },
    }),
    []
  );

  const { formats } = useMemo(
    () => ({
      formats: {
        dayFormat: (date, culture, localizer) =>
          localizer.format(date, "MM/DD", culture),
      },
    }),
    []
  );

  function getDayGap(date1: string, date2: string) {
    // Convert both dates to milliseconds since the epoch
    const time1 = new Date(date1);
    const time2 = new Date(date2);

    // Calculate the difference in milliseconds
    const timeDiff = Math.abs(time2 - time1);

    // Convert the difference to days
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    return dayDiff + 1;
  }
  useEffect(() => {
    console.log("in voting modal", event);
    fetchResultHour();
  }, [event, votingMode]);
  return (
    <Dialog open={open} fullScreen>
      <DialogTitle className="flex justify-between">
        Participation Voting
        <IconButton
          onClick={() => {
            setOpen(false);
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContentText sx={{ paddingX: 3 }}>
        <Grid container className="flex justify-between">
          <Grid item xs={5.75}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Select your available hours</Typography>
              <FormControl sx={{ marginLeft: "auto" }}>
                <RadioGroup
                  row
                  aria-labelledby="choose-voting-mode"
                  name="choose-voting-mode"
                  value={votingMode}
                  onChange={(event) => setVotingMode(event.target.value)}
                >
                  <FormControlLabel
                    value="available"
                    control={<Radio />}
                    label="Available"
                  />
                  <FormControlLabel
                    value="maybeAvailable"
                    control={<Radio />}
                    label="Maybe Available"
                  />
                </RadioGroup>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Grid>
          <Grid item xs={5.75}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Group's Availability</Typography>
              <Checkbox
                checked={showMabeAvailable}
                onChange={handleChange}
                sx={{ marginLeft: "auto" }}
              />
              <Typography>Show Maybe Available</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContentText>
      <DialogContent>
        <Grid container className="flex justify-between">
          <Grid
            item
            xs={5.75}
            className=" overflow-scroll"
            sx={{ height: "80vh" }}
          >
            <ScheduleSelector
              selection={
                votingMode === "available" ? availableHour : maybeAvailableHour
              }
              startDate={event ? new Date(event.voteStart) : null}
              numDays={event ? getDayGap(event.voteStart, event.voteEnd) : 0}
              dateFormat="MM/DD (ddd)"
              timeFormat="HH:mm"
              minTime={0}
              maxTime={24}
              hourlyChunks={2}
              columnGap={"2px"}
              rowGap="2px"
              onChange={(newSelection) => {
                if (votingMode === "available") {
                  setAvailableHour(newSelection);
                } else {
                  setMaybeAvailableHour(newSelection);
                }
              }}
            />
          </Grid>
          <Grid item xs={5.75}>
            <Grid
              container
              className="overflow-y-scroll"
              sx={{ height: "18vh", mb: 2 }}
            >
              {/* <Grid item xs={4}>
                <Typography
                  sx={{ fontWeight: "bold", textDecorationLine: "underline" }}
                >
                  Available
                </Typography>
                <Typography>John</Typography>
                <Typography>Jack</Typography>
                <Typography>Tom</Typography>
                <Typography>Bob</Typography>
                <Typography>John</Typography>
                <Typography>Jack</Typography>
              </Grid> */}
              {/* <Grid item xs={4}>
                <Typography
                  sx={{ fontWeight: "bold", textDecorationLine: "underline" }}
                >
                  Unavailable
                </Typography>
                <Typography>John</Typography>
                <Typography>Jack</Typography>
                <Typography>Tom</Typography>
              </Grid> */}
              {showMabeAvailable && (
                <Grid item xs={4}>
                  <Typography
                    sx={{ fontWeight: "bold", textDecorationLine: "underline" }}
                  >
                    MaybeAvailable
                  </Typography>
                  <Typography>John</Typography>
                  <Typography>Jack</Typography>
                  <Typography>Tom</Typography>
                </Grid>
              )}
            </Grid>

            <Box className="overflow-scroll" sx={{ height: "60vh" }}>
              <Box sx={{ width: "fit-content" }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Calendar
                    //   onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventPropGetter}
                    events={resultHour}
                    dayPropGetter={customDayPropGetter}
                    toolbar={false}
                    defaultView="myweek"
                    views={{
                      myweek: MyWeek,
                    }}
                    formats={formats}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default VotingModal;
