import { useEffect, useState, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import { useUser } from "@clerk/clerk-react";
import { Chat } from "@/typing/typing.d";
import * as api from "@/api/api";

type Props = {};

const Groups = (props: Props) => {
  const { groupId } = useParams();
  // const group = groups.find((g) => g.id === groupId);

  const location = useLocation();
  const path = location.pathname.split("/");

  const [isOpen, setIsOpen] = useState(false);

  const [group, setGroup] = useState<{ id: string; name: string }>();
  // const [fetched, setFetched] = useState(false);
  const fetchThisGroup = async () => {
    // setFetched(true)
    var thisGroup;
    try {
      if (!groupId) return;
      thisGroup = await api.getGroup(groupId);
      console.log(thisGroup);
      setGroup(thisGroup.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log("this group")
    fetchThisGroup();
  }, [groupId]);

  const [messages, setMessages] = useState<Chat[]>([]);
  const [messageSent, setMessageSent] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [loadingMsg, setLoadingMsg] = useState<Chat | null>();

  useEffect(() => {
    if (groupId) {
      console.log("Get Messages!!!");
      api.getMessages(groupId).then((res) => {
        setMessages(res.data);
      });
    }
  }, []);

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const newSocket = new WebSocket(`ws://localhost:8000/api/ws/${groupId}`);
    setSocket(newSocket);

    // Listen for messages from the server
    newSocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      const receivedMessage: Chat = data;

      // if its sent by the user, don't add it to the messages

      setLoadingMsg(receivedMessage);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (loadingMsg) {
      const receivedMessage = loadingMsg;
      setLoadingMsg(null);
      const recv_timing = new Date(receivedMessage.timing);
      const timing = new Date(messages[messages.length - 1].timing);
      if (
        receivedMessage.speakerId === user?.id &&
        recv_timing.toLocaleString() == timing.toLocaleString()
      )
        return;
      setMessages((prevMessages) => [...prevMessages, loadingMsg]);
    }
  }, [loadingMsg]);

  const { user } = useUser();

  const onMessageSend = () => {
    if (messageSent) {
      if (!user || !groupId) return;
      const msg: Chat = {
        groupId: groupId,
        speakerId: user?.id,
        speakerName: user?.fullName as string,
        timing: new Date(),
        content: messageSent,
      };

      socket?.send(JSON.stringify(msg));
      setMessages((prevMessages) => [...prevMessages, msg]);
      setMessageSent("");
    }
  };

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
        <Box
          sx={{
            width: 500,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ p: 2 }}>
            Chat Room
          </Typography>
          <Divider />
          <Box sx={{ px: 2, overflowY: "auto", flexGrow: 1 }}>
            {messages.map((message, index) => (
              <Box
                ref={index === messages.length - 1 ? messagesEndRef : null}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  //細的底線、灰色
                  borderBottom: 1,
                  borderStyle: "solid",
                  borderColor: "grey.300",
                  px: 1,
                  py: 2,
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex" }} gap={1}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color:
                          message.speakerId === user?.id ? "blue" : "inherit",
                      }}
                    >
                      {message.speakerName}
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "grey.500" }}>
                    {new Date(message.timing).toISOString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{message.content}</Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderStyle: "solid",
              borderColor: "grey.300",
            }}
          >
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={10}>
                <TextField
                  id="message"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={messageSent}
                  onChange={(e) => setMessageSent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onMessageSend();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" onClick={onMessageSend}>
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </>
  ) : (
    <div>No Group</div>
  );
};

export default Groups;
