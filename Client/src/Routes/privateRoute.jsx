import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import socketContext from "../context/socketContext";
const PrivateRoute = ({ children }) => {
	const chatRoomContext = useContext(socketContext);
	return chatRoomContext.showChat ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
