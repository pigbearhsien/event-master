import moment from "moment";

export const groups = [
  { id: "1", name: "group1", info: "info1" },
  { id: "2", name: "group2", info: "info2" },
];

export const events = [
  {
    start: moment("2023-11-18T10:00:00").toDate(),
    end: moment("2023-11-18T11:00:00").toDate(),
    title: "MRI Registration",
  },
  {
    start: moment("2023-11-18T14:00:00").toDate(),
    end: moment("2023-11-18T15:30:00").toDate(),
    title: "ENT Appointment",
  },
];
