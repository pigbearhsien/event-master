CREATE SCHEMA public;

CREATE TABLE public.USER(
    UserID varchar(10) NOT NULL,
    Name varchar(40) NOT NULL,
    Account varchar(40) NOT NULL,
    Password varchar(10) NOT NULL,
    Profile_pid_url text,
    PRIMARY KEY (UserID)
);

COPY public.USER(UserID, Name, Account, PASSWORD, Profile_pid_url) FROM'/Users/yeyouming/Desktop/DBMS_project/data/users.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.isAdmin(
    UserID varchar(10) NOT NULL,
    PRIMARY KEY (UserID),
    FOREIGN KEY (UserID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.isAdmin(UserID) FROM'/Users/yeyouming/Desktop/DBMS_project/data/isAdmin.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.PRIVATE_EVENT(
    EventID varchar(10) NOT NULL,
    UserID varchar(10) NOT NULL,
    Event_Start timestamp NOT NULL,
    Event_End timestamp NOT NULL,
    Name varchar(10) NOT NULL,
    Description text NOT NULL,
    PRIMARY KEY (EventID),
    FOREIGN KEY (UserID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.PRIVATE_EVENT(EventID, UserID, Event_Start, Event_End, Name, Description) FROM'/Users/yeyouming/Desktop/DBMS_project/data/private_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.GROUP(
    GroupID varchar(10) NOT NULL,
    name varchar(20) NOT NULL,
    PRIMARY KEY (GroupID)
);

COPY public.GROUP(GroupID, name) FROM'/Users/yeyouming/Desktop/DBMS_project/data/group.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.GROUP_HAS_USER(
    GroupID varchar(10) NOT NULL,
    UserID varchar(10) NOT NULL,
    PRIMARY KEY (GroupID, UserID),
    FOREIGN KEY (GroupID) REFERENCES public.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.GROUP_HAS_USER(GroupID, UserID) FROM'/Users/yeyouming/Desktop/DBMS_project/data/group_has_user.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.GROUP_HAS_MANAGER(
    GroupID varchar(10) NOT NULL,
    UserID varchar(10) NOT NULL,
    PRIMARY KEY (GroupID, UserID),
    FOREIGN KEY (GroupID) REFERENCES public.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.GROUP_HAS_MANAGER(GroupID, UserID) FROM'/Users/yeyouming/Desktop/DBMS_project/data/group_has_manager.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.GROUP_EVENT(
    EventID varchar(10) NOT NULL,
    GroupID varchar(20) NOT NULL,
    name varchar(20) NOT NULL,
    Description text NOT NULL,
    Event_Start timestamp,
    Event_End timestamp,
    Status varchar(13) NOT NULL CHECK (Status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')),
    OrganizerID varchar(10) NOT NULL,
    Vote_Start timestamp NOT NULL,
    Vote_End timestamp NOT NULL,
    VoteDeadline timestamp NOT NULL,
    HavePossibility bool NOT NULL,
    PRIMARY KEY (EventID),
    FOREIGN KEY (GroupID) REFERENCES public.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (OrganizerID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.GROUP_EVENT(EventID, GroupID, name, Description, Event_Start, Event_End, Status, OrganizerID, Vote_Start, Vote_End, VoteDeadline, HavePossibility) FROM'/Users/yeyouming/Desktop/DBMS_project/data/group_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.USER_JOIN_EVENT(
    UserID varchar(10) NOT NULL,
    EventID varchar(10) NOT NULL,
    IsAccepted bool NOT NULL,
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES public.GROUP_EVENT(EventID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.USER_JOIN_EVENT(UserID, EventID, IsAccepted) FROM'/Users/yeyouming/Desktop/DBMS_project/data/user_join_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.AVAILABLE_TIME(
    UserID varchar(10) NOT NULL,
    EventID varchar(10) NOT NULL,
    Available_Start timestamp NOT NULL,
    Possibility_level varchar(10) NOT NULL CHECK (Possibility_level IN ('Definitely', 'Maybe')),
    PRIMARY KEY (UserID, EventID, Available_Start),
    FOREIGN KEY (UserID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES public.GROUP_EVENT(EventID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.AVAILABLE_TIME(UserID, EventID, Available_Start, Possibility_level) FROM'/Users/yeyouming/Desktop/DBMS_project/data/available_time.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.TODO(
    TodoID varchar(10) NOT NULL,
    GroupID varchar(10) NOT NULL,
    AssigneeID varchar(10) NOT NULL,
    AssignerID varchar(10) NOT NULL,
    Name varchar(20) NOT NULL,
    Description text NOT NULL,
    Completed bool NOT NULL,
    Deadline timestamp NOT NULL,
    PRIMARY KEY (TodoID),
    FOREIGN KEY (GroupID) REFERENCES public.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (AssigneeID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (AssignerID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.TODO(TodoID, GroupID, AssigneeID, AssignerID, Name, Description, Completed, Deadline) FROM'/Users/yeyouming/Desktop/DBMS_project/data/todo.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE public.CHAT(
    GroupID varchar(10) NOT NULL,
    SpeakerID varchar(10) NOT NULL,
    Timing timestamp NOT NULL,
    Content text NOT NULL,
    PRIMARY KEY (GroupID, SpeakerID, Timing),
    FOREIGN KEY (GroupID) REFERENCES public.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (SpeakerID) REFERENCES public.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY public.CHAT(GroupID, SpeakerID, Timing, Content) FROM'/Users/yeyouming/Desktop/DBMS_project/data/chat.csv' DELIMITER ',' CSV HEADER;

