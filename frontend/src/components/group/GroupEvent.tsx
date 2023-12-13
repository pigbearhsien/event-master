import React from "react";
import * as api from "../../api/api";

type Props = {};

const GroupEvent = (props: Props) => {
  const [events, setEvents] = React.useState<any>([]);
  const [fetched, setFetched] = React.useState(false);

  const fetchThisGroupEvent = async () => {
    var thisGroupEvent
    try{
      thisGroupEvent = await api.getGroupEventsWithId()
      console.log(thisGroupEvent)
      thisGroupEvent.data.map((event)=>{
        setEvents([...events, event])
      })
    } catch (error) {
      console.log(error)
    }
  };

  if (fetched === false) fetchThisGroupEvent();

  return <div>GroupEvent</div>;
};

export default GroupEvent;
