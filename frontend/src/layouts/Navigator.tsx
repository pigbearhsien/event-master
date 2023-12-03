import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import Divider from "@mui/material/Divider";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import { LayoutDashboard, Plus, Users } from "lucide-react";
import { groups } from "@/mockdata";
import { useEffect } from "react";

// type Props = {};

export default function Navigator(props: DrawerProps) {
  const { ...other } = props;
  const { user, isSignedIn } = useUser();
  // console.log(user);
  // console.log(isSignedIn);
  useEffect(() => {
    // add user's data to database
  }, [isSignedIn]);

  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <Drawer variant="permanent" {...other}>
      <List>
        <ListItem sx={{ py: 2.5 }}>
          <UserButton />
          <ListItemText sx={{ ml: 1.5 }}>{user?.fullName}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            selected={location.pathname === "/"}
          >
            <LayoutDashboard />
            <ListItemText sx={{ ml: 1.5 }}>Dashboard</ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider sx={{ mt: 1 }} />
        <Box>
          <ListItem sx={{ py: 1.5, color: "#929292" }}>
            <ListItemText>Groups</ListItemText>
            <IconButton>
              <Plus size={18} color="#929292" />
            </IconButton>
          </ListItem>
          {groups.map(({ id, name: childId }) => (
            <ListItem disablePadding key={id}>
              <ListItemButton
                component={Link}
                to={`/groups/${id}/event`}
                selected={path[1] === "groups" && path[2] === id}
                sx={{ py: 1 }}
              >
                <Users />
                <ListItemText sx={{ ml: 1.5 }}>{childId}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      </List>
    </Drawer>
  );
}
