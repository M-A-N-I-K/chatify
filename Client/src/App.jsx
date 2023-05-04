import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Routes/privateRoute";
import Loader from "./component/loader";
import SocketState from "./context/socketState";

const ChatRoom = lazy(() => import("./component/chatroom"));
const Chat = lazy(() => import("./component/chat"));

function App() {
	return (
		<>
			<SocketState>
				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={
								<Suspense fallback={<Loader />}>
									<ChatRoom />
								</Suspense>
							}
						/>
						<Route
							path="/chat"
							element={
								<Suspense fallback={<Loader />}>
									<PrivateRoute>
										<Chat />
									</PrivateRoute>
								</Suspense>
							}
						/>
					</Routes>
				</BrowserRouter>
			</SocketState>
		</>
	);
}

export default App;
