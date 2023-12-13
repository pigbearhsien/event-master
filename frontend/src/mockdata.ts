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
const statusList = [
  "In_Voting",
  "End_Voting",
  "Not_Start_Yet",
  "On_Going",
  "Closure",
];
export const groupEvents = [
  // 時間還沒確認的 event：投票中
  {
    eventId: "1",
    name: "event1",
    description: "description1",
    eventStart: null,
    eventEnd: null,
    status: "In_Voting",
    organizerName: "organizerName1",
    voteDeadline: moment().add(1, "hour").toDate(),
    isAccepted: null,
  },
  // 時間還沒確認的 event：投票已結束
  {
    eventId: "2",
    name: "event2",
    description: "description2",
    eventStart: null,
    eventEnd: null,
    status: "End_Voting",
    organizerName: "organizerName2",
    voteDeadline: moment().subtract(1, "hour").toDate(),
    isAccepted: null,
  },
  // 時間已確認但還沒開始的 event：user 還沒確認要不要參加
  {
    eventId: "3",
    name: "event3",
    description:
      "While included here as a standalone component, the most common use will be in some form of input, so some of the behavior demonstrated here is not shown in context.",
    eventStart: moment().add(1, "hour").toDate(),
    eventEnd: moment().add(2, "hour").toDate(),
    status: "Not_Start_Yet",
    organizerName: "organizerName3",
    voteDeadline: moment().subtract(1, "hour").toDate(),
    isAccepted: null,
  },
  // 時間已確認但還沒開始的 event：user 已確認要參加
  {
    eventId: "4",
    name: "event4",
    description: "description4",
    eventStart: moment().add(1, "hour").toDate(),
    eventEnd: moment().add(2, "hour").toDate(),
    status: "Not_Start_Yet",
    organizerName: "organizerName4",
    voteDeadline: moment().subtract(1, "hour").toDate(),
    isAccepted: true,
  },
  // 時間已確認但還沒開始的 event：user 已確認不參加
  {
    eventId: "5",
    name: "event5",
    description: "description5",
    eventStart: moment().add(1, "hour").toDate(),
    eventEnd: moment().add(2, "hour").toDate(),
    status: "Not_Start_Yet",
    organizerName: "organizerName5",
    voteDeadline: moment().subtract(1, "hour").toDate(),
    isAccepted: false,
  },
  // 已開使且正在進行的 event
  {
    eventId: "6",
    name: "event6",
    description: "description6",
    eventStart: moment().subtract(1, "hour").toDate(),
    eventEnd: moment().add(1, "hour").toDate(),
    status: "On_Going",
    organizerName: "organizerName6",
    voteDeadline: moment().subtract(3, "hour").toDate(),
    isAccepted: true,
  },
  // 已結束的 event
  {
    eventId: "7",
    name: "event7",
    description: "description7",
    eventStart: moment().subtract(2, "hour").toDate(),
    eventEnd: moment().subtract(1, "hour").toDate(),
    status: "Closure",
    organizerName: "organizerName7",
    voteDeadline: moment().subtract(3, "hour").toDate(),
    isAccepted: true,
  },
];
