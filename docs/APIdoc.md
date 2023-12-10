## Type declaration

```type Group = {
	groupId: string;
	name: string;
};

type EventPrivate (or PrivateEvent) = {
	eventId: string;
	userId: string;
	eventStart: Datetime;
	eventEnd: Datetime;
	name: string;
	description: string | Null;
};

type EventGroup (or GroupEvent) = {
	eventId: string;
	groupId: string;
	name: string;
	description: string;
	eventStart: Datetime | Null;
	eventEnd: Datetime | Null;
	status: string;
	organizerId: string;
	voteStart: Datetime;
	voteEnd: Datetime;
	voteDeadline: Datetime | Null;
	havePossibility: boolean;
};

type Vote (or availableTime) = {
	userId: string;
	name: string;
	availableStart: Datetime;
	possibility_level: string | Null;
};

type Todo = {
	todoId: string;
	groupId: string;
	assigneeId: string;
	assignerId: string;
	name: string;
	description: string;
	completed: boolean;
	deadline: Datetime;
};

type User = {
	userId: string;
	name: string;
	account: string;
	password: string;
	profile_pic_url: string | Null;
};

type GroupHasUser = {
	groupId: string;
	userId: string;
};

type GroupHasManager = {
	groupId: string;
	userId: string;
};

type IsAdmin = {
	groupId: string;
	userId: string;
};

type UserJoinEvent = {
	eventId: string;
	userId: string;
	isAccepted: boolean;
};

type Chat = {
	groupId: string;
	speakerId: string;
	timing: Datetime;
	content: string;
};

```
## For Manager
1. **新增團隊**
	```
	Type: Post
	Path: /createGroup/{managerId}
	Request Body: 
	{
		groupId:  string,
		name:  string
	}
	Response: Group (type)
	```
2. **新增團隊成員**
	```
	Type: Post
	Path: /insertUserToGroup
	Request Body:
	{
		groupId: string,
		userId: string
	}
	Response: GroupHasUser (type)
	```
3. **剔除團隊成員**
	```
	Type: Delete
	Path: /deleteUserFromGroup/{groupId}/{userId}
	Response: msg
	```
4. **指派團隊成員為團隊管理者**
	```
	Type: Post
	Path: /addManager
	Request Body:
	{
		groupId: string,
		userId: string
	}
	Response: GroupHasManager
	```
5. **各成員填寫「可能可以」最終參加的數量**
	```
	Type: Get
	Path: /maybeJoinRatio/{groupId}/{userId}
	Parameter:
	{
		groupId: string,
		userId: string,
	}
	Response:
	{
		ratio: number
	}
	```
6. **各成員在各時段填寫的可能性**
	```
	Type: Get
	Path: /userPeriodPossibility/{groupId}/{userId}/{period}
	Parameter:
	{
		groupId: string,
		userId: string,
		period: Datetime
	}
	Response:
	{
		definitely:  number,
		maybe:  number, 
		unavailable:  number	
	}
	```
7. **指派團隊成員代辦事項**
	```
	Type: Post
	Path: /assignTodo
	Request Body: Todo
	```
## For Organizer
1. **確認活動成立以及時間**
	```
	Type: Post
	Path: /setEventTime
	Request Body:
	{
		eventId:  string,
		eventStart: timestamp,
		eventEnd: timestamp
	}
	```
	**確認活動不成立 (刪除)**
	```
	Type: Delete
	Path: /deleteGroupEvent/{eventId}
	```
2. **新增活動參與者**
	```
	Type: Post
	Path: /insertUsetToEvent
	Request Body:
	{
		eventId: string,
		userId: string,
		isAccepted: bool
	}
	```
	**刪除活動參與者**
	```
	Type: Delete
	Path: /deleteUserFromEvent/{eventId}/{userId}
	```
## For Users
1. **發起團隊活動**
	```
	Type: Post
	Path: /createGroupEvent
	Request Body: EventGroup (Type) 沒有的填NULL
	```
2. **顯示某團隊活動的投票結果**
	```
	Type: Get
	Path: /voteResult/{eventId}
	Parameter:
	{
		eventId: string
	}
	Response: Vote[]
	```
3. **查詢他的所有團隊**
	```
	Type: Get
	Path: /allBelongGroups/{userId}
	Parameter:
	{
		userId: string
	}
	Response: Group[]
	```
4. **查詢自己所有確認參加的團隊活動**
	```
	Type: Get
	Path: /allGroupEvents/{userId}
	Parameter:
	{
		userId: string
	}
	Response: EventGroup[]
	```
5. **查詢自己所有  TODO**
	```
	Type: Get
	Path: /allTodos/{userId}
	Parameter:
	{
		userId: string
	}
	Response: Todo[]
	```
6. **查詢私人活動**
	```
	Type: Get
	Path: /allPrivateEvents/{userId}
	Parameter:
	{
		userId: string
	}
	Response: EventPrivate
	```
7. **特定團隊活動的可以時間以及可能程度**
	```
	Type: Get
	Path: /myVote/{userId}/{eventId}
	Parameter:
	{
		userId: string,
		eventId: string
	}
	Response: Vote[]
	```
8. **用戶在特定群組裡說的話**
	```
	Type: Get
	Path: /messages/{groupId}
	Parameter:
	{
		groupId: string
	}
	```
