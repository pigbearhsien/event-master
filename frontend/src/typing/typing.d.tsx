type Group = {
  groupId: string;
  name: string;
};

type EventGroup = {
  eventId: string;
  groupId: string;
  name: string;
  description: string;
  eventStart: Date | null;
  eventEnd: Date | null;
  status: string;
  organizerId: string;
  voteStart: Date;
  voteEnd: Date;
  voteDeadline: Date;
  havePossibility: boolean;
};

type EventPrivate = {
  eventid: string;
  userid: string;
  event_start: Date;
  event_end: Date;
  name: string;
  description: string;
};

type Chat = {
  groupId: string;
  speakerId: string;
  speakerName: string;
  timing: Date;
  content: string;
};

type EventGroupCreate = {
  groupId: string;
  eventId: string;
  name: string;
  description: string;
  organizerId: string;
  voteStart: Date;
  voteEnd: Date;
  voteDeadline: Date;
  havePossibility: boolean;
};

type Todo = {
  todoId: string;
  groupId: string;
  assigneeId: string;
  assignerId: string;
  name: string;
  description: string;
  completed: boolean;
  deadline: Date;
};

type UserJoinEvent = {
  userId: string;
  eventId: string;
  isAccepted: boolean;
};

type TodoJoinUser = Todo & {
  assigneeName: string,
  assigneeAccount: string,
  assigneeProfilePicUrl: string | null,
  assignerName: string,
  assignerAccount: string,
  assignerProfilePicUrl: string | null,
}

type EventGroupJoinUser = EventGroup & {
  organizerName: string,
  organizerAccount: string,
  organizerProfilePicUrl: string | null,
}

type User = {
  userId: string;
  name: string;
  account: string;
  profilePicUrl: string | null;
};

type CreateAvailableTime = {
  userId: string;
  eventId: string;
  availableStart: Date;
  possibilityLevel: string;
}

type Vote = {
  userId: string;
  name: string;
  available_start: Date;
  possibilityLevel: string;
};

export type {
  Group,
  Todo,
  EventGroup,
  User,
  EventGroupCreate,
  Vote,
  EventPrivate,
  Chat,
  TodoJoinUser,
  EventGroupJoinUser,
  UserJoinEvent,
  CreateAvailableTime
};
