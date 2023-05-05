import React, { useContext, useEffect, useState } from "react";
import socketContext from "../context/socketContext";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Image from "./image";

const chat = () => {
	const ChatContext = useContext(socketContext);
	const [messageList, setMessageList] = useState([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const [image, setImage] = useState("");
	const theme = "snow";
	const modules = {
		toolbar: [
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
		],
	};

	const placeholder = "Enter your message";

	const formats = ["bold", "italic", "underline", "strike", "list"];
	const { quill, quillRef } = useQuill({
		theme,
		modules,
		formats,
		placeholder,
	});

	const sendMessage = async () => {
		if (image !== "" && isQuillEmpty(currentMessage)) {
			const blob = new Blob([image], { type: image.type });
			console.log(blob);
			const messageData = {
				room: ChatContext.roomNumber,
				author: ChatContext.username,
				message: blob,
				type: "image",
				mimeType: image.type,
				fileName: image.name,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes() +
					":" +
					new Date(Date.now()).getSeconds(),
			};
			await ChatContext.socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
			setImage("");
		} else if (currentMessage !== "") {
			const messageData = {
				room: ChatContext.roomNumber,
				author: ChatContext.username,
				message: currentMessage,
				type: "text",
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
			setMessageList((list) => [...list, data]);
		};

		ChatContext.socket.on("recieve_message", handleMessage);
		console.log(messageList);
		return () => {
			ChatContext.socket.off("recieve_message", handleMessage);
		};
	}, [ChatContext.socket]);

	function isQuillEmpty(chatMessage) {
		if (
			chatMessage.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
			!chatMessage.includes("<img")
		) {
			return true;
		}
		return false;
	}

	useEffect(() => {
		if (quill) {
			quill.on("text-change", (delta, oldDelta, source) => {
				const htmlMarkup = quillRef.current.firstChild.innerHTML;
				setCurrentMessage(htmlMarkup);
			});
		}
	}, [quill]);

	const handleChange = (e) => {
		if (e.target.files.length) {
			setImage(e.target.files[0]);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-screen min-h-screen bg-black text-white p-0 sm:p-10">
			<div className="flex flex-col flex-grow w-full max-w-xl bg-gray-800 shadow-xl rounded-lg overflow-hidden">
				<div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
					{messageList.map((chat, key) => {
						console.log(chat);
						if (chat.author == ChatContext.username) {
							return (
								<div
									key={key}
									className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
								>
									<div>
										<div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
											{chat.type === "text" ? (
												<p
													className="text-sm"
													dangerouslySetInnerHTML={{
														__html: chat.message,
													}}
												></p>
											) : (
												<Image
													fileName={chat.fileName}
													blob={chat.message}
													type={chat.mimeType}
												/>
											)}
										</div>

										<span className="text-xs text-gray-500 leading-none">
											{chat.time}
										</span>
									</div>
									<div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
								</div>
							);
						}
						return (
							<div
								key={key}
								className="flex w-full mt-2 space-x-3 max-w-xs"
							>
								<div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
								<div>
									<div className="bg-gray-500 p-3 text-black rounded-r-lg rounded-bl-lg">
										{chat.type === "text" ? (
											<p
												className="text-sm"
												dangerouslySetInnerHTML={{
													__html: chat.message,
												}}
											></p>
										) : (
											<Image
												fileName={chat.fileName}
												blob={chat.message}
												type={chat.mimeType}
											/>
										)}
									</div>
									<span className="text-xs text-gray-500 leading-none">
										{chat.time}
									</span>
								</div>
							</div>
						);
					})}
				</div>

				<div className="bg-gray-900 flex justify-center items-center flex-col">
					<div className="w-full  invert">
						<div ref={quillRef} className="rounded-xl text-black" />
					</div>

					<div className="flex w-full justify-between items-center mt-2 px-4 pb-4">
						<div className="flex justify-evenly w-[20vw] lg:w-[6vw] z-20">
							<div className="w-[30px] h-[20px]">
								<label htmlFor="upload-button">
									{image !== "" && (
										<figure className="absolute top-10 h-[25vh]">
											<img
												className="h-auto max-w-full rounded-lg"
												src={image}
												alt="image"
											/>
										</figure>
									)}

									<img
										src="https://img.icons8.com/ios/50/null/plus--v1.png"
										className="invert h-[20px] cursor-pointer w-[30px] pr-2 border-r-2 border-opacity-40  border-black"
									/>
								</label>
								<input
									type="file"
									id="upload-button"
									style={{ display: "none" }}
									onChange={handleChange}
								/>
							</div>
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
