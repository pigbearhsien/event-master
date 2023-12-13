import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function NavTabs() {
  const { groupId } = useParams();
  const location = useLocation();
  const path = location.pathname.split("/");
  const [value, setValue] = useState(path[path.length - 1]);

  useEffect(() => {
    setValue(path[path.length - 1]);
  }, [location]);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} aria-label="nav tabs">
        <Tab
          value={"event"}
          label="Event"
          component={Link}
          to={`/groups/${groupId}/event`}
        />
        <Tab
          value={"todo"}
          label="Todo"
          component={Link}
          to={`/groups/${groupId}/todo`}
        />
        <Tab
          value={"info"}
          label="Info"
          component={Link}
          to={`/groups/${groupId}/info`}
        />
      </Tabs>
    </Box>
  );
}
