import axios, {  AxiosInstance, AxiosResponse } from "axios";
import {
  Group,
  EventGroupCreate,
  Todo,
  EventGroup,
  User,
  Vote,
  EventPrivate,
  Chat,
} from "../typing/typing.d";

export const request: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Get

export const getAllUser = async (): Promise<void> => {
  try{
    const result : AxiosResponse<User[]> = await request.get<User[]>("/users")
    console.log(result)
  } catch (error) {
    throw error as Error
  }
}

export const getUser = async (): Promise<void> => {
  try{
    const userId = "23182"
    const result : AxiosResponse<User> = await request.get<User>(`/users/${userId}`)
    console.log(result)
  } catch (error) {
    throw error as Error
  }
}

export const getGroupEvents = async (
  userId: string
): Promise<AxiosResponse<EventGroup[]>> => {
  try {
    return await request.get<EventGroup[]>(`/allGroupEvents/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getTodos = async (userId: string): Promise<AxiosResponse<Todo[]>> => {
  try {
    return await request.get<Todo[]>(`/allTodos/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getMaybeJoinRatio = async (
  groupId: string,
  userId: string
): Promise<AxiosResponse<{ ratio: number }>> => {
  try {
    return await request.get(`/maybeJoinRatio/${groupId}/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getUserPeriodPossibility = async (
  groupId: string,
  userId: string,
  period: Date
): Promise<
  AxiosResponse<{ definitely: number; maybe: number; unavailable: number }>
> => {
  try {
    return await request.get(`/userPeriodPossibility/${groupId}/${userId}/${period}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getVoteResult = async (
  eventId: string
): Promise<AxiosResponse<Vote[]>> => {
  try {
    return await request.get(`/voteResult/${eventId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getAllBelongGroups = async (
  userId: string
): Promise<AxiosResponse<Group[]>> => {
  try {
    return await request.get(`/allBelongGroups/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getPrivateEvents = async (
  userId: string
): Promise<AxiosResponse<EventPrivate[]>> => {
  try {
    return await request.get(`/allPrivateEvents/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getMyVote = async (
  userId: string,
  eventId: string
): Promise<AxiosResponse<Vote[]>> => {
  try {
    return await request.get(`/myVote/${userId}/${eventId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getMessages = async (groupId: string): Promise<AxiosResponse<Chat[]>> => {
  try {
    return await request.get(`/messages/${groupId}`);
  } catch (error) {
    throw error as Error;
  }
};

// Post
export const createGroup = async (
  groupId: string,
  userId: string,
  name: string
): Promise<AxiosResponse<Group>> => {
  try {
    return await request.post<Group>("/createGroup", { groupId, userId, name });
  } catch (error) {
    throw error as Error;
  }
};

export const createUser = async (userInfo: User): Promise<AxiosResponse<User>> => {
  try {
    return await request.post<User>("/createUser", userInfo);
  } catch (error) {
    throw error as Error;
  }
};

export const insertUserToGroup = async (
  groupId: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    return await request.post("/insertUserToGroup", { groupId, userId });
  } catch (error) {
    throw error as Error;
  }
};

export const deleteUserFromGroup = async (
  groupId: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    return await request.post("/deleteUserToGroup", { groupId, userId });
  } catch (error) {
    throw error as Error;
  }
};

export const addAdmin = async (groupId: string, userId: string) => {
  try {
    return await request.post("/addAdmin", { groupId, userId });
  } catch (error) {
    throw error as Error;
  }
};

export const assignTodo = async (
  groupId: string,
  assigneeId: string,
  assignerId: string
): Promise<AxiosResponse> => {
  try {
    return await request.post("/assignTodo", {
      groupId,
      assigneeId,
      assignerId,
    });
  } catch (error) {
    throw error as Error;
  }
};

export const setEventTime = async (
  eventId: string,
  startTime: Date,
  endTime: Date
): Promise<AxiosResponse> => {
  try {
    return await request.post("/setEventTime", { eventId, startTime, endTime });
  } catch (error) {
    throw error as Error;
  }
};

export const deleteEvent = async (eventId: string): Promise<AxiosResponse> => {
  try {
    return await request.post("/deleteEvent", { eventId });
  } catch (error) {
    throw error as Error;
  }
};

export const insertUserToEvent = async (
  eventId: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    return await request.post("/insertUsetToEvent", { eventId, userId });
  } catch (error) {
    throw error as Error;
  }
};

export const deleteUserFromEvent = async (
  eventId: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    return await request.post("/deleteUserFromEvent", { eventId, userId });
  } catch (error) {
    throw error as Error;
  }
};

export const createGroupEvent = async (param: EventGroupCreate): Promise<AxiosResponse> =>{
  try{
  return await request.post("/createGroupEvent", param);
  } catch (error){
    throw error as Error
  }
}
