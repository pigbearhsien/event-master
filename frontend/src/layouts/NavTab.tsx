import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function NavTabs() {
  const [value, setValue] = useState(0);
  const { groupId } = useParams();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs">
        <Tab label="Event" component={Link} to={`/groups/${groupId}/event`} />
        <Tab label="Todo" component={Link} to={`/groups/${groupId}/todo`} />
        <Tab label="Info" component={Link} to={`/groups/${groupId}/info`} />
      </Tabs>
    </Box>
  );
}
