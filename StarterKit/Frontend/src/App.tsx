import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import Login_screen from "./pages/Login_screen";
import User_loggedin from "./pages/User_LoggedIn";
import Admin_loggedin from "./pages/Admin_LoggedIn";
import RegisterScreen from "./pages/Register";
import Logout from "./pages/Logout_screen";
import Events from "./pages/Admin_pages/Event_table";
import CreateEventForm from "./pages/Admin_pages/Create_event";
import EditEventForm from "./pages/Admin_pages/Edit_event";
import DeleteEvent from "./pages/Admin_pages/Delete_event";

const Dashboard: React.FC = () => <h1>Calendify</h1>; // Temporary placeholder
// pagina's opstellen + url's
const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login_screen />} />
            <Route 
                path="/user" 
                element={<PrivateRoute element={<User_loggedin />} />} 
            />
            <Route 
                path="/admin" 
                element={<PrivateRoute element={<Admin_loggedin/>} />} 
            />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/create-event" element={<CreateEventForm />} />
            <Route path="/admin/update-event/:id" element={<EditEventForm />} />
            <Route path="admin/delete-event/:eventId" element={<DeleteEvent />} />

        </Routes>
    );
};

export default App;
