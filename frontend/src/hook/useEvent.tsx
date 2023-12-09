import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useContext, createContext } from "react";
import * as api from "../api/api";
import { userInfo } from "os";

const LOGGED_IN_ID_KEY = "loggedInId";
const savedLoggedInId = localStorage.getItem(LOGGED_IN_ID_KEY);

type EventContextProps = {
  loggedInId: string;
  setLoggedInId: React.Dispatch<React.SetStateAction<string>>;
  curGroupId: string;
  setCurGroupId: React.Dispatch<React.SetStateAction<string>>;
};

const EventContext = createContext<EventContextProps>({
  loggedInId: "",
  setLoggedInId: () => {},
  curGroupId: "",
  setCurGroupId: () => {},
});

interface IProps {
  children: React.ReactNode;
}

const EventProvider = ({ children }: IProps) => {
  const [loggedInId, setLoggedInId] = useState<string>(savedLoggedInId || "");
  const [curGroupId, setCurGroupId] = useState<string>("");

  const user = useUser();

  // 正在等待 /createUser 寫完
  // const fetchUser = async (user: any) => {
  //   if (user.id == "") return;
  //   const getUser = await api.getUser(user.id);
  //   if (getUser == null){
  //     const created = await api.createUser({userId: user.id, name: user.name, account: user.emailAddresses[0].emailAddress, password: "", profile_pic_url: null})
      
  //     setLoggedInId(user.id)
  //   }
  //   else{
  //     setLoggedInId(user.id)
  //   }
  // };

  // useEffect(() => {
  //   if (user.isSignedIn && loggedInId == "") {
  //     console.log(user.user.emailAddresses[0]);
  //     fetchUser(user.user);
  //   }
  // }, [user.isSignedIn]);

  return (
    <EventContext.Provider
      value={{ loggedInId, setLoggedInId, curGroupId, setCurGroupId }}
    >
      {children}
    </EventContext.Provider>
  );
};

const useEvent = () => useContext(EventContext);

export { EventProvider, useEvent };
