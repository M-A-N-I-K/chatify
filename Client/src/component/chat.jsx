import React, { useContext, useEffect, useState } from "react";
import socketContext from "../context/socketContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Image from "./image";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const chat = () => {
	const ChatContext = useContext(socketContext);
	const [messageList, setMessageList] = useState([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const [image, setImage] = useState({ preview: "", raw: "" });
	const [showEmoji, setShowEmoji] = useState(false);
	const [joinedUsers, setJoinedUsers] = useState([]);
	const [leftUsers, setLeftUsers] = useState([]);
	const [roomUsers, setRoomUsers] = useState([]);
	const modules = {
		toolbar: [
			["bold", "italic", "underline", "strike"],
			["link"],
			["blockquote", "code-block"],
			[({ list: "ordered" }, { list: "bullet" })],
		],
	};

	const editorStyle = {
		border: "none",
		borderRadius: "20px",
		fontSize: "16px",
		filter: "invert(1)",
		color: "black",
	};

	function extractHrefFromHtml(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		const anchorElement = doc.querySelector("a");
		const href = anchorElement.getAttribute("href");
		return href;
	}

	const sendMessage = async () => {
		if (image !== "" && isQuillEmpty(currentMessage)) {
			const blob = new Blob([image.raw], { type: image.raw.type });
			const messageData = {
				room: ChatContext.roomNumber,
				author: ChatContext.username,
				message: blob,
				type: "image",
				mimeType: image.raw.type,
				fileName: image.raw.name,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes() +
					":" +
					new Date(Date.now()).getSeconds(),
			};
			await ChatContext.socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
			setImage({ preview: "", raw: "" });
		} else if (currentMessage !== "") {
			const urlRegex = /(https?:\/\/[^\s]+)/g;
			const urls = currentMessage.match(urlRegex);
			if (urls) {
				const url = extractHrefFromHtml(currentMessage);
				console.log(url);
				await ChatContext.socket.emit("preview", url);
				const previewPromise = new Promise((resolve) => {
					ChatContext.socket.on("previewImage", (preview) => {
						resolve(preview);
					});
				});
				let websitePreview = await previewPromise;
				console.log(websitePreview);
				const messageData = {
					room: ChatContext.roomNumber,
					author: ChatContext.username,
					message: currentMessage,
					preview: websitePreview,
					type: "website",
					time:
						new Date(Date.now()).getHours() +
						":" +
						new Date(Date.now()).getMinutes() +
						":" +
						new Date(Date.now()).getSeconds(),
				};
				await ChatContext.socket.emit("send_message", messageData);
				setMessageList((list) => [...list, messageData]);
			} else {
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
				setShowEmoji(false);
			}
			setCurrentMessage("");
		}
	};

	useEffect(() => {
		const handleMessage = (data) => {
			setMessageList((list) => [...list, data]);
		};

		const handleUserJoined = (username) => {
			if (!joinedUsers.includes(username)) {
				const tempMessage = `${username} joined the chat`;
				setMessageList((list) => [
					...list,
					{
						message: tempMessage,
						time: new Date().toLocaleTimeString(),
						type: "alert",
					},
				]);
				setJoinedUsers([...joinedUsers, username]);
			}
		};

		const handleUserLeft = (username) => {
			if (!leftUsers.includes(username)) {
				const tempMessage = `${username} left the chat`;
				setMessageList((list) => [
					...list,
					{
						message: tempMessage,
						time: new Date().toLocaleTimeString(),
						type: "alert",
					},
				]);
				setLeftUsers([...leftUsers, username]);
			}
		};

		ChatContext.socket.on("recieve_message", handleMessage);
		ChatContext.socket.on("user_joined", handleUserJoined);
		ChatContext.socket.on("user_left", handleUserLeft);

		return () => {
			ChatContext.socket.off("recieve_message", handleMessage);
			ChatContext.socket.off("user_joined", handleUserJoined);
			ChatContext.socket.off("user_left", handleUserLeft);
		};
	}, [ChatContext.socket, joinedUsers, leftUsers]);

	function isQuillEmpty(chatMessage) {
		if (
			chatMessage.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
			!chatMessage.includes("<img")
		) {
			return true;
		}
		return false;
	}

	const handleMessageChange = (content, delta, source, editor) => {
		setCurrentMessage(content);
	};
	const handleChange = (e) => {
		if (e.target.files.length) {
			setImage({
				preview: URL.createObjectURL(e.target.files[0]),
				raw: e.target.files[0],
			});
		}
	};
	const showEmojiPicker = () => {
		setShowEmoji(true);
	};

	const setEmojiMessage = (emoji) => {
		if (currentMessage !== "") {
			setCurrentMessage(currentMessage + " " + emoji.native);
		} else {
			setCurrentMessage(emoji.native);
		}
	};

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
										<span className="text-xs text-gray-500 leading-none">
											{chat.author}
										</span>
										<div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
											{chat.type === "text" ? (
												<p
													className="text-sm"
													dangerouslySetInnerHTML={{
														__html: chat.message,
													}}
												></p>
											) : chat.type === "image" ? (
												<Image
													fileName={chat.fileName}
													blob={chat.message}
													type={chat.mimeType}
												/>
											) : (
												<>
													<p
														className="text-sm underline text-white pb-1"
														dangerouslySetInnerHTML={{
															__html: chat.message,
														}}
													></p>
													<img
														src={`data:image/png;base64,${chat.preview}`}
														alt="Website preview"
													/>
												</>
											)}
										</div>
										<span className="text-xs text-gray-500 leading-none">
											{chat.time}
										</span>
									</div>
								</div>
							);
						}
						return (
							<div
								key={key}
								className="flex w-full mt-2 space-x-3 max-w-xs"
							>
								<div>
									<span className="text-xs text-gray-500 leading-none">
										{chat.author}
									</span>

									<div className="bg-gray-500 p-3 text-black rounded-r-lg rounded-bl-lg">
										{chat.type === "text" ? (
											<p
												className="text-sm"
												dangerouslySetInnerHTML={{
													__html: chat.message,
												}}
											></p>
										) : chat.type === "image" ? (
											<Image
												fileName={chat.fileName}
												blob={chat.message}
												type={chat.mimeType}
											/>
										) : chat.type === "alert" ? (
											<div className="flex w-full mt-2 space-x-3 max-w-xs">
												<div className="bg-gray-500 p-3 text-black rounded-r-lg rounded-bl-lg">
													<p className="text-sm">{chat.message}</p>
													<span className="text-xs text-gray-500 leading-none">
														{chat.time}
													</span>
												</div>
											</div>
										) : (
											<>
												<p
													className="text-sm underline text-blue-800 pb-1"
													dangerouslySetInnerHTML={{
														__html: chat.message,
													}}
												></p>
												<img
													src={`data:image/png;base64,${chat.preview}`}
													alt="Website preview"
												/>
											</>
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
					<div className="w-full">
						<ReactQuill
							theme="snow"
							style={editorStyle}
							modules={modules}
							value={currentMessage}
							onChange={handleMessageChange}
							placeholder="Enter your message here..."
						/>
					</div>

					<div className="flex w-full justify-between items-center mt-2 px-4 pb-4">
						<div className="flex justify-evenly w-[20vw] lg:w-[6vw] z-20">
							<div className="w-[30px] h-[20px]">
								<label htmlFor="upload-button">
									{image.preview !== "" && (
										<figure className="absolute top-10 h-[65vh] object-contain">
											<img
												className="h-full max-w-full rounded-lg"
												src={image.preview}
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
							<button
								onClick={showEmojiPicker}
								className="w-[30px] h-[20px]"
							>
								{showEmoji && (
									<div className="absolute bottom-[35vh] h-[30vh] object-contain">
										<Picker
											data={data}
											onEmojiSelect={(emoji) => {
												setEmojiMessage(emoji);
											}}
										/>
									</div>
								)}
								<label htmlFor="show-emoji">
									<img
										src="https://img.icons8.com/ios/50/null/happy--v1.png"
										className="invert cursor-pointer pl-1 h-[20px] w-[25px]"
									/>
								</label>
							</button>

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
