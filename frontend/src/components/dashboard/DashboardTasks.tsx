import React from "react";
import { Typography, Button, Grid, Paper, IconButton } from "@mui/material";

type Props = {};

const DashboardTasks = (props: Props) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 936,
        margin: "auto",
        overflow: "hidden",
      }}
      elevation={0}
    >
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        No tasks yet
      </Typography>
    </Paper>
  );
};

export default DashboardTasks;
