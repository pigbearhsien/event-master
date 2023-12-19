import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// const changeFavicon = (href: string) => {
//   const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
//   if (link) {
//     link.href = href;
//   } else {
//     // If the link element doesn't exist, create it and append it to the head
//     const newLink = document.createElement("link");
//     newLink.rel = "icon";
//     newLink.href = href;
//     document.head.appendChild(newLink);
//   }
// };

// // Change the favicon dynamically, replace "path/to/your/icon.ico" with your actual path
// changeFavicon("D:\大三\大三上\資料庫管理\期末報告\code\DBMS_project\frontend\src\imgs\em0.ico");
// document.title = "EventMaster"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
