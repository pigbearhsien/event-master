import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useContext, createContext } from "react";

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
  setLoggedInId: ()=>{},
  curGroupId: "",
  setCurGroupId: ()=>{}
});

interface IProps {
  children: React.ReactNode;
}

const EventProvider = ({children}: IProps) => {
  const [loggedInId, setLoggedInId] = useState<string>(savedLoggedInId || "");
  const [curGroupId, setCurGroupId] = useState<string>("");

  const user = useUser()

  useEffect(()=>{
    if(user.isSignedIn){
      console.log(user.user.emailAddresses[0].emailAddress)
    }
  }, [user.isSignedIn])
  
  return (
  <EventContext.Provider value={{ loggedInId, setLoggedInId, curGroupId, setCurGroupId }}>
    {children}
  </EventContext.Provider>
  );
};

const useEvent = ()=> useContext(EventContext)

export {EventProvider, useEvent}