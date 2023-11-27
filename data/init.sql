CREATE SCHEMA event_master;

CREATE TABLE event_master.USER(
    UserID varchar(10) NOT NULL,
    Name varchar(40) NOT NULL,
    Account varchar(40) NOT NULL,
    Password varchar(10) NOT NULL,
    Profile_pid_url text,
    PRIMARY KEY (UserID)
);

COPY event_master.USER(UserID, Name, Account, PASSWORD, Profile_pid_url) FROM'/Users/xin/coding/DBMS/users.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.isAdmin(
    UserID varchar(10) NOT NULL,
    PRIMARY KEY (UserID),
    FOREIGN KEY (UserID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.isAdmin(UserID) FROM'/Users/xin/coding/DBMS/isAdmin.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.PRIVATE_EVENT(
    EventID varchar(10) NOT NULL,
    UserID varchar(10) NOT NULL,
    Event_Start timestamp NOT NULL,
    Event_End timestamp NOT NULL,
    Name varchar(10) NOT NULL,
    Description text NOT NULL,
    PRIMARY KEY (EventID),
    FOREIGN KEY (UserID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.PRIVATE_EVENT(EventID, UserID, Event_Start, Event_End, Name, Description) FROM'/Users/xin/coding/DBMS/private_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.GROUP(
    GroupID varchar(10) NOT NULL,
    name varchar(20) NOT NULL,
    PRIMARY KEY (GroupID)
);

COPY event_master.GROUP(GroupID, name) FROM'/Users/xin/coding/DBMS/group.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.GROUP_HAS_USER(
    GroupID varchar(10) NOT NULL,
    UserID varchar(10) NOT NULL,
    PRIMARY KEY (GroupID, UserID),
    FOREIGN KEY (GroupID) REFERENCES event_master.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.GROUP_HAS_USER(GroupID, UserID) FROM'/Users/xin/coding/DBMS/group_has_user.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.GROUP_HAS_MANAGER(
    GroupID varchar(10) NOT NULL,
    UserID varchar(10) NOT NULL,
    PRIMARY KEY (GroupID, UserID),
    FOREIGN KEY (GroupID) REFERENCES event_master.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.GROUP_HAS_MANAGER(GroupID, UserID) FROM'/Users/xin/coding/DBMS/group_has_manager.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.GROUP_EVENT(
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
    FOREIGN KEY (GroupID) REFERENCES event_master.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (OrganizerID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.GROUP_EVENT(EventID, GroupID, name, Description, Event_Start, Event_End, Status, OrganizerID, Vote_Start, Vote_End, VoteDeadline, HavePossibility) FROM'/Users/xin/coding/DBMS/group_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.USER_JOIN_EVENT(
    UserID varchar(10) NOT NULL,
    EventID varchar(10) NOT NULL,
    IsAccepted bool NOT NULL,
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES event_master.GROUP_EVENT(EventID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.USER_JOIN_EVENT(UserID, EventID, IsAccepted) FROM'/Users/xin/coding/DBMS/user_join_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.AVAILABLE_TIME(
    UserID varchar(10) NOT NULL,
    EventID varchar(10) NOT NULL,
    Available_Start timestamp NOT NULL,
    Possibility_level varchar(10) NOT NULL CHECK (Possibility_level IN ('Definitely', 'Maybe')),
    PRIMARY KEY (UserID, EventID, Available_Start),
    FOREIGN KEY (UserID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES event_master.GROUP_EVENT(EventID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.AVAILABLE_TIME(UserID, EventID, Available_Start, Possibility_level) FROM'/Users/xin/coding/DBMS/available_time.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.TODO(
    TodoID varchar(10) NOT NULL,
    GroupID varchar(10) NOT NULL,
    AssigneeID varchar(10) NOT NULL,
    AssignerID varchar(10) NOT NULL,
    Name varchar(20) NOT NULL,
    Description text NOT NULL,
    Completed bool NOT NULL,
    Deadline timestamp NOT NULL,
    PRIMARY KEY (TodoID),
    FOREIGN KEY (GroupID) REFERENCES event_master.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (AssigneeID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (AssignerID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.TODO(TodoID, GroupID, AssigneeID, AssignerID, Name, Description, Completed, Deadline) FROM'/Users/xin/coding/DBMS/todo.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE event_master.CHAT(
    GroupID varchar(10) NOT NULL,
    SpeakerID varchar(10) NOT NULL,
    Timing timestamp NOT NULL,
    Content text NOT NULL,
    PRIMARY KEY (GroupID, SpeakerID, Timing),
    FOREIGN KEY (GroupID) REFERENCES event_master.GROUP(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (SpeakerID) REFERENCES event_master.USER(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY event_master.CHAT(GroupID, SpeakerID, Timing, Content) FROM'/Users/xin/coding/DBMS/chat.csv' DELIMITER ',' CSV HEADER;

