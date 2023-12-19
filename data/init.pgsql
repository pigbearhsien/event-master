CREATE TABLE USER_table(
    UserID varchar(50) NOT NULL,
    Name varchar(50) NOT NULL,
    Account varchar(50) NOT NULL,
    Password varchar(20) NOT NULL,
    Profile_pic_url text,
    PRIMARY KEY (UserID)
);

COPY USER_table(UserID, Name, Account, PASSWORD, Profile_pic_url)
FROM
    '/Users/xin/coding/DBMS_project/data/users.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE isAdmin(
    UserID varchar(50) NOT NULL,
    PRIMARY KEY (UserID),
    FOREIGN KEY (UserID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY isAdmin(UserID) FROM'/Users/xin/coding/DBMS_project/data/isAdmin.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE PRIVATE_EVENT(
    EventID varchar(50) NOT NULL,
    UserID varchar(50) NOT NULL,
    Event_Start timestamp,
    Event_End timestamp,
    Name varchar(50) NOT NULL,
    Description text NOT NULL,
    PRIMARY KEY (EventID),
    FOREIGN KEY (UserID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY PRIVATE_EVENT(EventID, UserID, Event_Start, Event_End, Name, Description) FROM'/Users/xin/coding/DBMS_project/data/private_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE GROUP_table(
    GroupID varchar(50) NOT NULL,
    name varchar(50) NOT NULL,
    PRIMARY KEY (GroupID)
);

COPY GROUP_table(GroupID, name) FROM'/Users/xin/coding/DBMS_project/data/group.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE GROUP_HAS_USER(
    GroupID varchar(50) NOT NULL,
    UserID varchar(50) NOT NULL,
    PRIMARY KEY (GroupID, UserID),
    FOREIGN KEY (GroupID) REFERENCES GROUP_table(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY GROUP_HAS_USER(GroupID, UserID) FROM'/Users/xin/coding/DBMS_project/data/group_has_user.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE GROUP_HAS_MANAGER(
    GroupID varchar(50) NOT NULL,
    UserID varchar(50) NOT NULL,
    PRIMARY KEY (GroupID, UserID),
    FOREIGN KEY (GroupID) REFERENCES GROUP_table(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY GROUP_HAS_MANAGER(GroupID, UserID) FROM'/Users/xin/coding/DBMS_project/data/group_has_manager.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE GROUP_EVENT(
    EventID varchar(50) NOT NULL,
    GroupID varchar(50) NOT NULL,
    name varchar(50) NOT NULL,
    Description text NOT NULL,
    Event_Start timestamp,
    Event_End timestamp,
    Status varchar(13) NOT NULL CHECK (Status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')),
    OrganizerID varchar(50) NOT NULL,
    Vote_Start timestamp NOT NULL,
    Vote_End timestamp NOT NULL,
    VoteDeadline timestamp NOT NULL,
    HavePossibility bool NOT NULL,
    PRIMARY KEY (EventID),
    FOREIGN KEY (GroupID) REFERENCES GROUP_table(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (OrganizerID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY GROUP_EVENT(EventID, GroupID, name, Description, Event_Start, Event_End, Status, OrganizerID, Vote_Start, Vote_End, VoteDeadline, HavePossibility) FROM'/Users/xin/coding/DBMS_project/data/group_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE USER_JOIN_EVENT(
    UserID varchar(50) NOT NULL,
    EventID varchar(50) NOT NULL,
    IsAccepted bool,
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES GROUP_EVENT(EventID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY USER_JOIN_EVENT(UserID, EventID, IsAccepted) FROM'/Users/xin/coding/DBMS_project/data/user_join_event.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE AVAILABLE_TIME(
    UserID varchar(50) NOT NULL,
    EventID varchar(50) NOT NULL,
    Available_Start timestamp NOT NULL,
    Possibility_level varchar(20) NOT NULL CHECK (Possibility_level IN ('Definitely', 'Maybe')),
    PRIMARY KEY (UserID, EventID, Available_Start),
    FOREIGN KEY (UserID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES GROUP_EVENT(EventID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY AVAILABLE_TIME(UserID, EventID, Available_Start, Possibility_level) FROM'/Users/xin/coding/DBMS_project/data/available_time.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE TODO(
    TodoID varchar(50) NOT NULL,
    GroupID varchar(50) NOT NULL,
    AssigneeID varchar(50) NOT NULL,
    AssignerID varchar(50) NOT NULL,
    Name varchar(50) NOT NULL,
    Description text NOT NULL,
    Completed bool NOT NULL,
    Deadline timestamp NOT NULL,
    PRIMARY KEY (TodoID),
    FOREIGN KEY (GroupID) REFERENCES GROUP_table(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (AssigneeID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (AssignerID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY TODO(TodoID, GroupID, AssigneeID, AssignerID, Name, Description, Completed, Deadline) FROM'/Users/xin/coding/DBMS_project/data/todo.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE CHAT(
    GroupID varchar(50) NOT NULL,
    SpeakerID varchar(50) NOT NULL,
    Timing timestamp NOT NULL,
    Content text NOT NULL,
    PRIMARY KEY (GroupID, SpeakerID, Timing),
    FOREIGN KEY (GroupID) REFERENCES GROUP_table(GroupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (SpeakerID) REFERENCES USER_table(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

COPY CHAT(GroupID, SpeakerID, Timing, Content) FROM'/Users/xin/coding/DBMS_project/data/chat.csv' DELIMITER ',' CSV HEADER;

