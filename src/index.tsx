import './index.css';

import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthProvider';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { AppStateProvider } from './contexts/AppStateContext';
import io from 'socket.io-client';
import { MapsProvider } from './contexts/MapsContext';
import {BrowserView, MobileView} from 'react-device-detect';

const socketURL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8000'
		: 'wss://matter-backend.herokuapp.com';

const socket = io(socketURL, { transports: ['websocket'] });

ReactDOM.render(
	<> 
		<MobileView>
			<DndProvider backend={TouchBackend}>
				<AuthProvider socket={socket}>
					<FirebaseProvider>
						<AppStateProvider socket={socket}>
							<MapsProvider>
								<App />
							</MapsProvider>
						</AppStateProvider>
					</FirebaseProvider>
				</AuthProvider>
			</DndProvider>
		</MobileView>
		<BrowserView>
			<DndProvider backend={HTML5Backend}>
				<AuthProvider socket={socket}>
					<FirebaseProvider>
						<AppStateProvider socket={socket}>
							<MapsProvider>
								<App />
							</MapsProvider>
						</AppStateProvider>
					</FirebaseProvider>
				</AuthProvider>
			</DndProvider>
		</BrowserView>
	</>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
