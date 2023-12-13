type Group = {
  groupId: string;
  name: string;
};

type EventGroup = {
  eventId: string;
  groupId: string;
  name: string;
  description: string;
  eventStart: Date;
  eventEnd: Date;
  status: string;
  organizer: string;
  vote_start: Date;
  vote_end: Date;
  vote_deadline: Date;
  havePossibility: boolean;
};

type EventPrivate = {
  eventId: string;
  userId: string;
  eventStart: Date;
  eventEnd: Date;
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
  voteStart: string;
  voteEnd: string;
  voteDeadline: string;
  havePossibility: string;
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

type User = {
  userId: string;
  name: string;
  account: string;
  password: string;
  profilePicUrl: string | null;
};

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
};
