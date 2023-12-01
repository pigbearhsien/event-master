import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { groups } from "@/mockdata";
import NavTabs from "@/layouts/NavTab";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Box,
  Drawer,
  Divider,
} from "@mui/material";
import { MessageSquare } from "lucide-react";
import GroupEvent from "@/components/group/GroupEvent";
import GroupInfo from "@/components/group/GroupInfo";
import GroupTodo from "@/components/group/GroupTodo";

type Props = {};

const Groups = (props: Props) => {
  const { groupId } = useParams();
  const group = groups.find((g) => g.id === groupId);

  const location = useLocation();
  const path = location.pathname.split("/");

  const [isOpen, setIsOpen] = useState(false);

  return group ? (
    <>
      {/* Header */}
      <AppBar
        component="div"
        color="transparent"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar disableGutters>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Typography color="inherit" variant="h4" display={"inline"}>
                {group.name}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                startIcon={<MessageSquare size={15} />}
                onClick={() => setIsOpen(!isOpen)}
              >
                Chat Room
              </Button>
            </Grid>
            <Grid item></Grid>
          </Grid>
        </Toolbar>
        <NavTabs />
      </AppBar>

      {/* Content */}
      <Box sx={{ px: 2, py: 2 }}>
        {path[path.length - 1] === "event" && <GroupEvent />}
        {path[path.length - 1] === "todo" && <GroupTodo />}
        {path[path.length - 1] === "info" && <GroupInfo />}
      </Box>

      {/* Chat Room */}
      <Drawer anchor="right" open={isOpen} variant="persistent">
        <Box sx={{ width: 500 }} role="presentation">
          <Typography variant="h6" sx={{ p: 2 }}>
            Chat Room
          </Typography>
          <Divider />
        </Box>
      </Drawer>
    </>
  ) : (
    <div>Group not found</div>
  );
};

export default Groups;
