import React, { useContext } from "react";
import { Link } from "react-router-dom";
import socketContext from "../context/socketContext";

const chatroom = () => {
	const chatRoomContext = useContext(socketContext);
	const joinRoom = () => {
		if (chatRoomContext.username !== "" && chatRoomContext.roomNumber !== 0) {
			chatRoomContext.socket.emit("join_room", {
				roomNumber: chatRoomContext.roomNumber,
				username: chatRoomContext.username,
			});
			chatRoomContext.setShowChat(true);
		}
	};
	return (
		<div className="flex flex-col items-center justify-evenly w-screen min-h-screen bg-black text-white p-0 sm:p-10">
			<div className="flex flex-col justify-center items-center p-4 flex-grow w-full max-w-xl bg-gray-800 shadow-xl rounded-lg">
				<h1 className="mb-4 text-3xl text-start font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-6xl dark:text-white">
					Chat
					<span className="text-blue-600 dark:text-blue-500">
						ify
					</span>{" "}
				</h1>

				<label
					htmlFor="username"
					className="block mb-2  px-3  text-md font-medium text-white"
				>
					Username
				</label>
				<input
					type="text"
					id="username"
					onChange={(e) => chatRoomContext.setUsername(e.target.value)}
					className="mx-4 w-[50vw] lg:w-[30vw] flex items-center h-10 bg-gray-900 text-white rounded px-3 text-sm"
					placeholder="Your username"
				/>

				<label
					htmlFor="room_number"
					className="block my-2  px-3 text-md font-medium text-white"
				>
					Room No.
				</label>
				<input
					type="number"
					id="room_number"
					onChange={(e) => chatRoomContext.setRoomNumber(e.target.value)}
					aria-describedby="helper-text-explanation"
					className="mx-4 mb-4 w-[50vw] lg:w-[30vw] flex items-center h-10 bg-gray-900 text-white rounded px-3 text-sm"
					placeholder="0"
				/>
				<Link to="/chat" className="justify-self-center">
					<button
						type="button"
						onClick={joinRoom}
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						<img
							className="invert w-5 h-5 mr-2 -ml-1"
							src="https://img.icons8.com/ios/50/null/filled-chat.png"
						/>
						Join Chatroom
					</button>
				</Link>
			</div>
		</div>
	);
};

export default chatroom;
