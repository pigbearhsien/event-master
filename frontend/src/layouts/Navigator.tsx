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
import { useEffect, useState } from "react";
import * as api from "../api/api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from "@mui/material/DialogTitle";
// type Props = {};

export default function Navigator(props: DrawerProps) {
  const [open, setOpen] = useState(false);
  const { ...other } = props;
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      // checkUser();
    }
  }, [isSignedIn]);

  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To create a group, please enter the group name here.
          </DialogContentText> */}
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel htmlFor="max-width">maxWidth</InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Group Name"
              type="text"
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button>Create</Button>
        </DialogActions>
      </Dialog>
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
              <IconButton onClick={() => setOpen(true)}>
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
    </>
  );
}
