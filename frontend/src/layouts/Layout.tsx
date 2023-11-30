import React from "react";
import { Box } from "@mui/material";
import Navigator from "@/layouts/Navigator";

type Props = {
  children: React.ReactNode;
};

const drawerWidth = 240;

export default function Layout({ children }: Props) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 左邊的導覽列 */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Navigator
          PaperProps={{ style: { width: drawerWidth } }}
          sx={{ display: { sm: "block", xs: "none" } }}
        />
      </Box>

      {/* 右邊的內容 */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fcfcfc",
        }}
      >
        <Box component="main" sx={{ flex: 1, py: 2, px: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
