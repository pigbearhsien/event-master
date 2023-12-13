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

export const messages = [
  {
    speakerName: "John",
    content: "Hello",
    timing: "2023-12-18 10:00",
  },
  {
    speakerName: "John",
    content: "Hi",
    timing: "2023-12-18 10:01",
  },
  {
    speakerName: "John",
    content: "How are you?",
    timing: "2023-12-18 10:02",
  },
  {
    speakerName: "John",
    content: "I'm fine, thank you",
    timing: "2023-12-18 10:03",
  },
  {
    speakerName: "John",
    content: "And you?",
    timing: "2023-12-18 10:04",
  },
  {
    speakerName: "John",
    content: "I'm fine too",
    timing: "2023-12-18 10:05",
  },
  {
    speakerName: "John",
    // content: "Hello",
    // 很長的 content
    content:
      "Simple dialogs can provide additional details or actions about a list item. For example, they can display avatars, icons, clarifying subtext, or orthogonal actions (such as adding an account).",
    timing: "2023-12-18 10:00",
  },
  {
    speakerName: "John",
    content: "Hi",
    timing: "2023-12-18 10:01",
  },
  {
    speakerName: "John",
    content: "How are you?",
    timing: "2023-12-18 10:02",
  },
  {
    speakerName: "John",
    content: "I'm fine, thank you",
    timing: "2023-12-18 10:03",
  },
  {
    speakerName: "John",
    content: "And you?",
    timing: "2023-12-18 10:04",
  },
  {
    speakerName: "John",
    content: "I'm fine too",
    timing: "2023-12-18 10:05",
  },
  {
    speakerName: "John",
    content: "Hello",
    timing: "2023-12-18 10:00",
  },
  {
    speakerName: "John",
    content: "Hi",
    timing: "2023-12-18 10:01",
  },
  {
    speakerName: "John",
    content: "How are you?",
    timing: "2023-12-18 10:02",
  },
  {
    speakerName: "John",
    content: "I'm fine, thank you",
    timing: "2023-12-18 10:03",
  },
  {
    speakerName: "John",
    content: "And you?",
    timing: "2023-12-18 10:04",
  },
  {
    speakerName: "John",
    content: "I'm fine too",
    timing: "2023-12-18 10:05",
  },
];
