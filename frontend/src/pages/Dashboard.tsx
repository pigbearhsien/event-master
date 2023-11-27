import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  ButtonGroup,
} from "@mui/material";
import { Bell } from "lucide-react";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import DashboardTasks from "@/components/dashboard/DashboardTasks";

type Props = {};

const Dashboard = (props: Props) => {
  const [view, setView] = React.useState("calendar"); // ["calendar", "tasks"
  return (
    <>
      <AppBar
        component="div"
        color="transparent"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, mb: 2 }}
      >
        <Toolbar disableGutters>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Typography color="inherit" variant="h4" display={"inline"}>
                Dashboard
              </Typography>
            </Grid>
            <Grid item xs>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                startIcon={<Bell size={15} />}
              >
                3 Warnings
              </Button>
            </Grid>
            <Grid item>
              <ButtonGroup
                size="small"
                color="inherit"
                aria-label="small button group"
              >
                <Button
                  sx={{
                    bgcolor: view === "calendar" ? "#d6d6d6" : "transparent",
                  }}
                  onClick={() => setView("calendar")}
                >
                  Calendar
                </Button>
                <Button
                  sx={{
                    bgcolor: view === "tasks" ? "#d6d6d6" : "transparent",
                  }}
                  onClick={() => setView("tasks")}
                >
                  Tasks
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {view === "calendar" ? <DashboardCalendar /> : <DashboardTasks />}
    </>
  );
};

export default Dashboard;
