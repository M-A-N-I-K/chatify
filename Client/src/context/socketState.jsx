import React, { useState } from "react";
import SocketContext from "./socketContext";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

const socketState = (props) => {
	const [username, setUsername] = useState("");
	const [roomNumber, setRoomNumber] = useState(0);
	const [showChat, setShowChat] = useState(false);

	return (
		<SocketContext.Provider
			value={{
				roomNumber,
				setRoomNumber,
				username,
				setUsername,
				showChat,
				setShowChat,
				socket,
			}}
		>
			{props.children}
		</SocketContext.Provider>
	);
};

export default socketState;
