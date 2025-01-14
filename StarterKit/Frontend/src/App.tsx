import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import Login_screen from "./pages/Login_screen";
import Admin_loggedin from "./pages/Admin_pages/Admin_LoggedIn";
import RegisterScreen from "./pages/Register";
import Logout from "./pages/Logout_screen";
import Events from "./pages/Admin_pages/Event_table";
import CreateEventForm from "./pages/Admin_pages/Create_event";
import EditEventForm from "./pages/Admin_pages/Edit_event";
import DeleteEvent from "./pages/Admin_pages/Delete_event";
import AttendeesList from "./pages/Admin_pages/Get_attendees";
import HomePage from "./pages/User_pages/User_LoggedIn";
import EventDetails from "./pages/User_pages/Event_details";
import ReviewForm from "./pages/User_pages/Place_feedback";
import ChangeWorkdaysPage from "./pages/User_pages/Change_workdays";

const Dashboard: React.FC = () => <h1>Calendify</h1>; // Temporary placeholder
// pagina's opstellen + url's
const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login_screen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/logout" element={<Logout />} />

            {/* private routes */}
            <Route 
                path="/user" 
                element={<PrivateRoute element={<HomePage />} />} />
            <Route
                path="/events/:id"
                element={<PrivateRoute element={<EventDetails />} />} />
            <Route
                path="/review/:id"
                element={<PrivateRoute element={<ReviewForm />} />} />
            <Route
                path="/user/workdays"
                element={<PrivateRoute element={<ChangeWorkdaysPage />} />} />
            <Route 
                path="/admin" 
                element={<PrivateRoute element={<Admin_loggedin/>} />} />
            <Route 
                path="/admin/events" 
                element={<PrivateRoute element={<Events />} />} />
            <Route 
                path="/admin/create-event" 
                element={<PrivateRoute element={<CreateEventForm />} />} />
            <Route 
                path="/admin/update-event/:id" 
                element={<PrivateRoute element={<EditEventForm />} />} />
            <Route 
                path="/admin/delete-event/:eventId" 
                element={<PrivateRoute element={<DeleteEvent />} />} />
            <Route 
                path="/admin/attendees/:eventId" 
                element={<PrivateRoute element={<AttendeesList />} />} />
            <Route
                path="/user/attending-events"
                element={<PrivateRoute element={<HomePage />} />} />

        </Routes>
    );
};

export default App;
