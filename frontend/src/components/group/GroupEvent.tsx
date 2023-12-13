import React, { useEffect } from "react";
import * as api from "../../api/api";
import { useParams } from "react-router-dom";

type Props = {};

const GroupEvent = (props: Props) => {
  const { groupId } = useParams();
  const [events, setEvents] = React.useState<any>([]);
  const [fetched, setFetched] = React.useState(false);

  const fetchThisGroupEvent = async () => {
    var thisGroupEvent
    try{
      if(!groupId) return
      thisGroupEvent = await api.getGroupEventsWithId(groupId)
      console.log(thisGroupEvent)
      thisGroupEvent.data.map((event)=>{
        setEvents([...events, event])
      })
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(()=>{
    fetchThisGroupEvent()
  }, [groupId])

  return <div>GroupEvent</div>;
};

export default GroupEvent;
