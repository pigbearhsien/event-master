import axios, { AxiosInstance, AxiosResponse } from "axios";
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
  withCredentials: true,
});

// Get

export const getAllUser = async (): Promise<void> => {
  try {
    const result: AxiosResponse<User[]> = await request.get<User[]>("/users");
    console.log(result);
  } catch (error) {
    throw error as Error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const result: AxiosResponse<User> = await request.get<User>(
      `/getUser/${userId}`
    );
    console.log(result);
    return result.data;
  } catch (error) {
    throw error as Error;
  }
};

export const getGroupEvents = async (
  userId: string
): Promise<AxiosResponse<EventGroup[]>> => {
  try {
    return await request.get<EventGroup[]>(`/getUserJoinEvents/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getUserTodos = async (
  userId: string
): Promise<AxiosResponse> => {
  try {
    return await request.get<any[]>(`/getUserTodos/${userId}`);
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
    return await request.get(
      `/userPeriodPossibility/${groupId}/${userId}/${period}`
    );
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
    return await request.get(`/getUserGroups/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getPrivateEvents = async (
  userId: string
): Promise<AxiosResponse<EventPrivate[]>> => {
  try {
    return await request.get(`/getUserPrivateEvents/${userId}`);
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

export const getMessages = async (
  groupId: string
): Promise<AxiosResponse<Chat[]>> => {
  try {
    return await request.get(`/getMessages/${groupId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getGroupEventsWithId = async (
  groupId: string
): Promise<AxiosResponse<EventGroup[]> | any> => {
  try {
    return await request.get(`/listGroupEventByGroupId/${groupId}`);
  } catch (error: any) {
    if (error.response.status === 404) {
        
        return { data: [] as EventGroup[]};
    }
    throw error as Error;
  }
};

export const getGroupManagerWithId = async (
  groupId: string
): Promise<AxiosResponse<User[]>> => {
  try {
    return await request.get(`/listGroupHasManager/${groupId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getGroup = async (groupId: string): Promise<AxiosResponse> => {
  try {
    return await request.get(`/getGroup/${groupId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const getGroupUsers = async (
  groupId: string
): Promise<AxiosResponse> => {
  try {
    return await request.get(`/listGroupHasUser/${groupId}`);
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
    return await request.post<Group>(`/createGroup/${userId}`, {
      groupId,
      name,
    });
  } catch (error) {
    throw error as Error;
  }
};

export const createUser = async (
  userInfo: User
): Promise<AxiosResponse<User>> => {
  try {
    return await request.post<User>("/createUser", userInfo);
  } catch (error) {
    console.log(error);
    throw error as Error;
  }
};

export const insertUserToGroup = async (
  groupId: string,
  account: string
): Promise<AxiosResponse> => {
  try {
    return await request.post(`/insertUserToGroupByEmail/${groupId}/${account}`);
  } catch (error) {
    throw error as Error;
  }
};

export const deleteUserFromGroup = async (
  groupId: string,
  userId: string
): Promise<AxiosResponse<string>> => {
  try {
    return await request.delete(`/deleteUserToGroup/${groupId}/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const addManager = async (
  groupId: string,
  account: string
): Promise<AxiosResponse> => {
  try {
    return await request.post(`/assignManagerToGroupByEmail/${groupId}/${account}`);
  } catch (error) {
    throw error as Error;
  }
};

export const assignTodo = async (todoInfo: Todo): Promise<AxiosResponse> => {
  try {
    return await request.post("/insertTodoToGroup", todoInfo);
  } catch (error) {
    throw error as Error;
  }
};

export const setEventTime = async (
  eventId: string,
  eventStart: Date,
  eventEnd: Date
): Promise<AxiosResponse> => {
  try {
    return await request.post("/setEventTime", {
      eventId,
      eventStart,
      eventEnd,
    });
  } catch (error) {
    throw error as Error;
  }
};

export const deleteEvent = async (eventId: string): Promise<AxiosResponse> => {
  try {
    return await request.delete(`/deleteEvent/${eventId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const insertUserToEvent = async (
  eventId: string,
  userId: string,
  isAccepted: boolean
): Promise<AxiosResponse> => {
  try {
    return await request.post("/insertUsetToEvent", {
      eventId,
      userId,
      isAccepted,
    });
  } catch (error) {
    throw error as Error;
  }
};

export const deleteUserFromEvent = async (
  eventId: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    return await request.delete(`/deleteUserFromEvent/${eventId}/${userId}`);
  } catch (error) {
    throw error as Error;
  }
};

export const createGroupEvent = async (
  param: EventGroupCreate
): Promise<AxiosResponse<EventGroup>> => {
  var data: any = param
  data.eventStart = null
  data.eventEnd = null
  data.status = "In_Voting"
  try {
    return await request.post("/createGroupEvent", data);
  } catch (error) {
    throw error as Error;
  }
};

export const createMessage = async (param: Chat): Promise<AxiosResponse> => {
  try {
    return await request.post("/createMessage", param);
  } catch (error) {
    throw error as Error;
  }
};




export const updateGroupEvent = async (
  event : EventGroup
): Promise<AxiosResponse<EventGroup>> => {
  try {
    return await request.put("/updateGroupEvent", event);
  } catch (error) {
    throw error as Error;
  }
}