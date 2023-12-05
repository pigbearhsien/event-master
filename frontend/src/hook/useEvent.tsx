import { useState, useEffect, useContext, createContext } from "react";

const LOGGED_IN_ID_KEY = "loggedInId";
const savedLoggedInId = localStorage.getItem(LOGGED_IN_ID_KEY);

type EventContextProps = {
  loggedInId: string;
  setLoggedInId: React.Dispatch<React.SetStateAction<string>>;
  curGroupId: string;
  setCurGroupId: React.Dispatch<React.SetStateAction<string>>;
};

const EventContext = createContext<EventContextProps | undefined>(undefined);

const EventProvider = (props: any) => {
  const [loggedInId, setLoggedInId] = useState<string>(savedLoggedInId || "");
  const [curGroupId, setCurGroupId] = useState<string>("");

  return <EventContext.Provider value={{ loggedInId, setLoggedInId, curGroupId, setCurGroupId }} />;
};
