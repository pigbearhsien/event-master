import Calendar from "@/components/Calendar";
import { events } from "@/mockdata";

type Props = {};

const DashboardCalendar = () => {
  return <Calendar events={events} />;
};

export default DashboardCalendar;
