import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import PrivateRoute from "./Routes/privateRoute";
import Loader from "./component/loader";
import SocketState from "./context/socketState";

const ChatRoom = lazy(() => import("./component/chatroom"));
const Chat = lazy(() => import("./component/chat"));

function App() {
	return (
		<>
			<SocketState>
				<HashRouter>
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
				</HashRouter>
			</SocketState>
		</>
	);
}

export default App;
