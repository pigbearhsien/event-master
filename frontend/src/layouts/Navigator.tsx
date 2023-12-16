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
// import { groups } from "@/mockdata";
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
import { v4 as uuidv4 } from "uuid";
import { Group } from "@/typing/typing.d";
// type Props = {};

export default function Navigator(props: DrawerProps) {
  const [open, setOpen] = useState(false);
  const { ...other } = props;
  const { user, isSignedIn } = useUser();

  const [name, setName] = useState("");
  useEffect(() => {
    if (isSignedIn) {
      // checkUser();
    }
  }, [isSignedIn]);

  const [groups, setGroups] = useState<Group[]>([]);
  const [fetched, setFetched] = useState(false);
  const fetchGroup = async () => {
    setFetched(true);
    var groupsData;
    try {
      if (!user) return;
      groupsData = await api.getAllBelongGroups(user?.id);
      groupsData.data.map((group) => {
        setGroups((groups) => [...groups, group]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(groups);
  }, [groups]);

  console.log("fetched", fetched);
  if (fetched === false) {
    fetchGroup();
  }

  const createGroup = async (name: string) => {
    try {
      if (!user) return;
      const groupId = uuidv4()
      await api.createGroup(groupId, user?.id, name);

      const newGroup: Group = {
        groupId: groupId,
        name: name,
      };
      setGroups((groups) => [...groups, newGroup]);
    } catch (error) {
      console.log(error);
    }
  };

  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <FormControl sx={{ mt: 2, width: "50vh" }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Group Name"
              type="text"
              fullWidth
              onChange={(event) => {
                setName(event?.target.value);
              }}
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
          <Button
            onClick={async () => {
              await createGroup(name);
              setOpen(false);
            }}
          >
            Create
          </Button>
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
            {groups.map((group) => (
              <ListItem disablePadding key={group.groupId}>
                <ListItemButton
                  component={Link}
                  to={`/groups/${group.groupId}/event`}
                  selected={path[1] === "groups" && path[2] === group.groupId}
                  sx={{ py: 1 }}
                >
                  <Users />
                  <ListItemText sx={{ ml: 1.5 }}>{group.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        </List>
      </Drawer>
    </>
  );
}
