import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import Layout from "@/layouts/Layout";
import Dashboard from "@/pages/Dashboard";
import Groups from "@/pages/Groups";
import { EventProvider } from "./hook/useEvent";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <EventProvider>
        <Router>
          <SignedIn>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/groups/:groupId/event" element={<Groups />} />
                <Route path="/groups/:groupId/todo" element={<Groups />} />
                <Route path="/groups/:groupId/info" element={<Groups />} />
              </Routes>
            </Layout>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Router>
      </EventProvider>
    </ClerkProvider>
  );
}

export default App;
