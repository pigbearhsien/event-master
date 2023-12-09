import moment from "moment";

export const groups = [
  { id: "1", name: "DBMS-1", info: "info1" },
  { id: "2", name: "DBMS-2", info: "info2" },
];

export const allEvents = [
  {
    start: moment("2023-12-18T10:00:00").toDate(),
    end: moment("2023-12-18T11:00:00").toDate(),
    title: "MRI Registration",
    eventId: "1",
    description: "gogogo",
    isPrivate: true,
  },
  {
    start: moment("2023-12-18T14:00:00").toDate(),
    end: moment("2023-12-18T15:30:00").toDate(),
    title: "ENT Appointment",
    eventId: "2",
    description: "gogogo",
    isPrivate: true,
  },
  {
    start: moment("2023-12-19T10:00:00").toDate(),
    end: moment("2023-12-19T11:00:00").toDate(),
    title: "MRI Registration",
    eventId: "3",
    description: "gogogo",
    isPrivate: false,
  },
  {
    start: moment("2023-12-20T14:00:00").toDate(),
    end: moment("2023-12-20T15:30:00").toDate(),
    title: "ENT Appointment",
    eventId: "4",
    description: "gogogo",
    isPrivate: false,
  },
];
