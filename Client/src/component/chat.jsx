import React, { useContext, useEffect, useState } from "react";
import socketContext from "../context/socketContext";

const chat = () => {
	const ChatContext = useContext(socketContext);
	const [messageList, setMessageList] = useState([]);
	const [currentMessage, setCurrentMessage] = useState("");

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				room: ChatContext.roomNumber,
				author: ChatContext.username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes() +
					":" +
					new Date(Date.now()).getSeconds(),
			};
			await ChatContext.socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
		}
	};

	useEffect(() => {
		const handleMessage = (data) => {
			console.log(data.author);
			setMessageList((list) => [...list, data]);
		};

		ChatContext.socket.on("recieve_message", handleMessage);

		console.log(messageList);
		return () => {
			ChatContext.socket.off("recieve_message", handleMessage);
		};
	}, [ChatContext.socket]);

	return (
		<div className="flex flex-col items-center justify-center w-screen min-h-screen bg-black text-white p-0 sm:p-10">
			<div className="flex flex-col flex-grow w-full max-w-xl bg-gray-800 shadow-xl rounded-lg overflow-hidden">
				<div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
					{messageList.map((chat, key) => {
						if (chat.author == ChatContext.username) {
							return (
								<div
									key={key}
									className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
								>
									<div>
										<div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
											<p className="text-sm">{chat.message}</p>
										</div>
										<span className="text-xs text-gray-500 leading-none">
											{chat.time}
										</span>
									</div>
									<div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
										{chat.author}
									</div>
								</div>
							);
						}
						return (
							<div
								key={key}
								className="flex w-full mt-2 space-x-3 max-w-xs"
							>
								<div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
									{chat.author}
								</div>
								<div>
									<div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
										<p className="text-sm">{chat.message}</p>
									</div>
									<span className="text-xs text-gray-500 leading-none">
										{chat.time}
									</span>
								</div>
							</div>
						);
					})}
				</div>

				<div className="bg-gray-900 flex flex-col">
					<div className="flex w-[20vw] py-2 justify-between mx-4">
						<img
							src="https://img.icons8.com/ios-glyphs/30/null/bold.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-black"
						/>
						<img
							src="https://img.icons8.com/ios-glyphs/30/null/italic.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
						/>
						<img
							src="https://img.icons8.com/ios/50/null/link--v1.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
						/>
						<img
							src="https://img.icons8.com/ios-filled/50/null/numbered-list.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2  border-black"
						/>
						<img
							src="https://img.icons8.com/ios-glyphs/30/null/overview-pages-3--v1.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
						/>
						<img
							src="https://img.icons8.com/external-those-icons-lineal-those-icons/48/null/external-Align-alignment-and-paragraph-those-icons-lineal-those-icons-2.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
						/>
						<img
							src="https://img.icons8.com/external-others-inmotus-design/67/null/external-Code-result-others-inmotus-design-3.png"
							className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
						/>
					</div>
					<input
						className="mx-4 flex items-center h-10 bg-gray-900 text-white rounded px-3 text-sm"
						type="text"
						onChange={(e) => setCurrentMessage(e.target.value)}
						onKeyUp={(event) => {
							if (event.key === "Enter") {
								sendMessage();
							}
						}}
						placeholder="Type your message…"
					/>
					<div className="flex justify-between items-center mt-2 px-4 pb-4">
						<div className="flex justify-evenly w-[20vw] lg:w-[6vw] z-20">
							<img
								src="https://img.icons8.com/ios/50/null/plus--v1.png"
								className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
							/>
							<img
								src="https://img.icons8.com/ios/50/null/happy--v1.png"
								className="invert cursor-pointer pl-1 h-[20px] w-[25px]"
							/>
							<img
								src="https://img.icons8.com/external-tal-revivo-green-tal-revivo/36/null/external-emailing-the-hotel-for-the-enquires-and-document-exchange-hotel-green-tal-revivo.png"
								className="invert cursor-pointer h-[20px] w-[25px]"
							/>
						</div>
						<button
							className="cursor-pointer w-[40px] ml-2 md:ml-0 md:w-[60px] py-2 md:py-1 flex justify-center items-center bg-green-600 rounded-xl"
							onClick={sendMessage}
						>
							<img
								src="https://img.icons8.com/ios-glyphs/30/000000/sent.png"
								className="invert h-[20px] w-[20px] md:h-[28px] md:w-[28px]"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default chat;
