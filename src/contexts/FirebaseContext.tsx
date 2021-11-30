// @ts-nocheck
import { IChatRoom, IFetchResponseBase, IOrder, IPinnedItem, IUserProfile, IPlaylist, IWaterfallMessage, IMonster } from '../types';
import { IRoomData } from '../components/SettingsPanel';

import React, { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import { activeAccount } from '../components/ThePanel';

export interface IFirebaseContext {
	createRoom: (
		roomName: string,
		isLocked: boolean,
		contractAddress?: string
	) => Promise<IFetchResponseBase>;
	getRoom: (
		roomName: string
	) => Promise<IFetchResponseBase & { data?: IChatRoom }>;
	pinRoomItem: (room: string, item: IPinnedItem) => Promise<IFetchResponseBase>;
	unpinRoomItem: (room: string, itemKey: string) => Promise<IFetchResponseBase>;
	getRoomPinnedItems: (
		room: string
	) => Promise<
		IFetchResponseBase & { data?: IPinnedItem[] | Array<IOrder & IPinnedItem> }
	>;
	getAllRooms: () => Promise<IFetchResponseBase & { data?: IChatRoom[] }>;
	movePinnedRoomItem: (
		room: string,
		item: IPinnedItem
	) => Promise<IFetchResponseBase>;

	resizePinnedRoomItem: (
		room: string,
		item: IPinnedItem
	) => Promise<IFetchResponseBase>;
	acquireTokens: (tokenId: string) => Promise<IFetchResponseBase>;

	//profile routes
	getUser: (
		userId: string
	) => Promise<IFetchResponseBase & { data?: IUserProfile }>;
	getUserRooms: (
		userId?: string
	) => Promise<IFetchResponseBase & { data?: IRoomData[] }>;
	createUser: (
		userId: string,
		screenName: string,
		avatar: string
	) => Promise<IFetchResponseBase>;
	updateScreenname: (
		userId: string,
		screenName: string,
	) => Promise<IFetchResponseBase>;
	updateAvatar: (
		userId: string,
		avatar: string,
	) => Promise<IFetchResponseBase>;
	updateEmail: (
		userId: string,
		email: string,
	) => Promise<IFetchResponseBase>;
	getImage:(query: string) => Promise<IFetchResponseBase>;

	//mint: (query: string) => Promise<IFetchResponseBase>;
	
	getChat:(
		roomName: string
	) => Promise<IFetchResponseBase & { data?: IWaterfallMessage[] }>;

	addtoChat:(
		roomName: string,
		text: string,
		avatar: string,
		name: string,
		timestamp: string
	) => Promise<IFetchResponseBase>;

	deleteChat:(
		roomName: string
	) =>  Promise<IFetchResponseBase>;

	getTrail:(
		roomName: string
	) => Promise<IFetchResponseBase & { [data] }>;

	showTrail:(
		roomName: string
	) => Promise<IFetchResponseBase & { [data] }>;

	//music player routes
	getPlaylist:(
		roomName: string
	) => Promise<IFetchResponseBase & { data?: IPlaylist[] }>;
	addtoPlaylist:(
		roomName: string,
		track: string,
		name: string,
		timestamp: string
	) => Promise<IFetchResponseBase>;
	removefromPlaylist:(
		roomName: string,
		timestamp: string
	) => Promise<IFetchResponseBase>;
	getRaces: () => Promise<IFetchResponseBase>;
	getAllWallets: () => Promise<IFetchResponseBase & { data?: IWallet[] }>;

	enterDungeon: (
		roomName: string,
		obktId: string
	) => Promise<IFetchResponseBase & { monsterData } > ;
}

export const FirebaseContext = React.createContext<IFirebaseContext>({
	createRoom: () => Promise.resolve({ isSuccessful: false }),
	getRoom: () => Promise.resolve({ isSuccessful: false }),
	pinRoomItem: () => Promise.resolve({ isSuccessful: false }),
	unpinRoomItem: () => Promise.resolve({ isSuccessful: false }),
	getRoomPinnedItems: () => Promise.resolve({ isSuccessful: false }),
	getAllRooms: () => Promise.resolve({ isSuccessful: false }),
	movePinnedRoomItem: () => Promise.resolve({ isSuccessful: false }),
	resizePinnedRoomItem: () => Promise.resolve({ isSuccessful: false }),
	acquireTokens: () => Promise.resolve({ isSuccessful: false }),
	createUser: () => Promise.resolve({ isSuccessful: false }),
	updateScreenname: () => Promise.resolve({ isSuccessful: false }),
	updateAvatar: () => Promise.resolve({ isSuccessful: false }),
	updateEmail: () => Promise.resolve({ isSuccessful: false }),
	getUser: () => Promise.resolve({ isSuccessful: false }),
	getUserRooms: () => Promise.resolve({ isSuccessful: false }),
	getImage: () => Promise.resolve({ isSuccessful: false }),
	getChat: () => Promise.resolve({ isSuccessful: false }),
	addtoChat: () => Promise.resolve({ isSuccessful: false }),
	deleteChat: ()=> Promise.resolve({ isSuccessful: false }),
	getTrail: () => Promise.resolve({ isSuccessful: false }),
	showTrail: () => Promise.resolve({ isSuccessful: false }),
	getPlaylist: () => Promise.resolve({ isSuccessful: false }),
	addtoPlaylist: () => Promise.resolve({ isSuccessful: false }),
	removefromPlaylist: () => Promise.resolve({ isSuccessful: false }),
	getRaces: () => Promise.resolve({ isSuccessful: false }),
	getAllWallets: () => Promise.resolve({ isSuccessful: false }),
	enterDungeon: () => Promise.resolve({ isSuccessful: false }),
});

const fetchBase =
	process.env.NODE_ENV === 'development'
		? ''
		: 'https://matter-backend.herokuapp.com';

//let activeAccount;
//const dAppClient = new DAppClient({ name: "Beacon Docs" });

export const FirebaseProvider: React.FC = ({ children }) => {
	const { isLoggedIn, jwt } = useContext(AuthContext);

	useEffect(() => {
		/*async function getAcc() {
			activeAccount = await dAppClient.getActiveAccount();
		  }
	  
		  getAcc();*/
	}, []);

	const fetchAuthenticated = useCallback(
		(path: string, request: Partial<RequestInit>) => {
			return fetch(fetchBase + path, {
				...request,
				headers:
					isLoggedIn && jwt
						? {
								...request.headers,
								Authorization: 'Bearer ' + jwt
						  }
						: {
								...request.headers
						  }
			});
		},
		[jwt, isLoggedIn]
	);

	const acquireTokens = useCallback(
		async (tokenId: string): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/token/${tokenId}`, {
				method: 'POST'
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getRoom = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IChatRoom }> => {
			console.log("getroom " + roomName);
			const fetchRes = await fetchAuthenticated(`/room/${roomName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ accountAddress: (activeAccount ? activeAccount.address : "")})
			});

			if (fetchRes.ok) {

				const roomData = (await fetchRes.json()) as IChatRoom;
				if(roomData.command){
					console.log("reload")
					window.location.reload();
				}
				return { isSuccessful: true, data: roomData };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getImage = useCallback(
		async (
			query: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/google-image-search/${query}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				return { isSuccessful: true, message: await fetchRes.json() };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	/*const mint = useCallback(
		async (
			query: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/google-image-search/mint/${query}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				return { isSuccessful: true, message: await fetchRes.json() };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);*/

	const createRoom = useCallback(
		async (
			roomName: string,
			isLocked: boolean,
			contractAddress?: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ isLocked, contractAddress })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const pinRoomItem = useCallback(
		async (
			roomName: string,
			item: IPinnedItem
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/pin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ item, accountAddress: (activeAccount ? activeAccount.address : "")})
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const movePinnedRoomItem = useCallback(
		async (
			roomName: string,
			item: IPinnedItem
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(
				`/room/${roomName}/pin/${item.key}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ item, accountAddress: (activeAccount ? activeAccount.address : "")})
				}
			);

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const resizePinnedRoomItem = useCallback(
		async (
			roomName: string,
			item: IPinnedItem
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(
				`/room/${roomName}/resize/${item.key}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ item, accountAddress: (activeAccount ? activeAccount.address : "")})
				}
			);

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getRaces = useCallback(async (): Promise<IFetchResponseBase> => {
		const fetchRes = await fetchAuthenticated(`/zedrun/getRaces`, {
			method: 'GET'
		});

		if (fetchRes.ok) {
			return { isSuccessful: true, message: await fetchRes.json() };
		}

		return { isSuccessful: false, message: fetchRes.statusText };
	}, [fetchAuthenticated]);

	const unpinRoomItem = useCallback(
		async (
			roomName: string,
			item: IPinnedItem
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ item, accountAddress: (activeAccount ? activeAccount.address : "")})
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getRoomPinnedItems = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IPinnedItem[] }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/pin`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const pinnedItems = await fetchRes.json();
				return { isSuccessful: true, data: pinnedItems };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const getAllRooms = useCallback(async (): Promise<
		IFetchResponseBase & { data?: IChatRoom[] }
	> => {
		const fetchRes = await fetchAuthenticated(`/room`, {
			method: 'GET'
		});

		if (fetchRes.ok) {
			const rooms = await fetchRes.json();
			return { isSuccessful: true, data: rooms };
		}

		return { isSuccessful: false, message: fetchRes.statusText };
	}, [fetchAuthenticated]);

	//create new user
	const createUser = useCallback(
		async (
			userId: string,
			screenName: string,
			avatar: string
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, screenName, avatar })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//update screenname
	const updateScreenname = useCallback(
		async (
			userId: string,
			screenName: string,
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/screen-name/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ screenName })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//update avatar
	const updateAvatar = useCallback(
		async (
			userId: string,
			avatar: string,
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/avatar/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ avatar })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//update email
	const updateEmail = useCallback(
		async (
			userId: string,
			email: string,
		): Promise<IFetchResponseBase> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/email/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get user data
	const getUser = useCallback(
		async (
			userId: string
		): Promise<IFetchResponseBase & { data?: IUserProfile }> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/get/${userId}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const userData = (await fetchRes.json()) as IUserProfile;
				return { isSuccessful: true, data: userData };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get user rooms
	const getUserRooms = useCallback(
		async (
			userId?: string
			): Promise<IFetchResponseBase & { data?: IRoomData[] }> => {
			const fetchRes = await fetchAuthenticated(`/chatroom-users/user-rooms/${userId}`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const userRooms = (await fetchRes.json()) as IRoomData[];
				return { isSuccessful: true, data: userRooms };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get chat
	const getChat = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IWaterfallMessage[] }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/getChat`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const messages = (await fetchRes.json());
				return { isSuccessful: true, data: messages };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//add message to Chat
	const addtoChat = useCallback(
		async (
			roomName: string,
			message: string,
			avatar: string,
			name: string,
			timestamp: string,
			author: string
		): Promise<IFetchResponseBase> => {

			const fetchRes = await fetchAuthenticated(`/room/${roomName}/addtoChat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message, avatar, name, timestamp, author })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//clear chat
	const deleteChat= useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IWaterfallMessage[] }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/deleteChat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({accountAddress: (activeAccount ? activeAccount.address : "")})
			});

			if (fetchRes.ok) {
				const messages = (await fetchRes.json());
				return { isSuccessful: true, data: messages };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get trail
	const getTrail = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IPlaylist[] }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/getTrail`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const trail = (await fetchRes.json());
				if(trail.command){
					console.log("reload")
					window.location.reload();
				}
				return { isSuccessful: true, data: trail };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const showTrail = useCallback(
		async (
			roomName: string,
			showTrail: boolean,
		): Promise<IFetchResponseBase> => {
			console.log("loooooooooool " + showTrail)
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/showTrail`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ showTrail })
			});

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//get playlist
	const getPlaylist = useCallback(
		async (
			roomName: string
		): Promise<IFetchResponseBase & { data?: IPlaylist[] }> => {
			const fetchRes = await fetchAuthenticated(`/room/${roomName}/getPlaylist`, {
				method: 'GET'
			});

			if (fetchRes.ok) {
				const playlist = (await fetchRes.json());
				return { isSuccessful: true, data: playlist };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	//add a track to playlist
	const addtoPlaylist = useCallback(
		async (
			roomName: string,
			track: string,
			name: string,
			timestamp: string
		): Promise<IFetchResponseBase> => {

			const fetchRes = await fetchAuthenticated(`/room/${roomName}/addtoPlaylist`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ track, name, timestamp })
			});

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };
		},
		[fetchAuthenticated]
	);

	const removefromPlaylist = useCallback(
		async (roomName: string, timestamp: string): Promise<IFetchResponseBase> => {

			const fetchRes = await fetchAuthenticated(
				`/room/${roomName}/playlist/${timestamp}`,
				{
					method: 'DELETE'
				}
			);

			if (fetchRes.ok) {
				return { isSuccessful: true };
			}

			return { isSuccessful: false, message: fetchRes.statusText };

		},
		[fetchAuthenticated]
	);

	const getAllWallets = useCallback(async (): Promise<
		IFetchResponseBase & { data?: IWallet[] }
	> => {
		const fetchRes = await fetchAuthenticated(`/room/wallets`, {
			method: 'GET'
		});

		if (fetchRes.ok) {
			const wallets = await fetchRes.json();
			return { isSuccessful: true, data: wallets };
		}

		return { isSuccessful: false, message: fetchRes.statusText };
	}, [fetchAuthenticated]);

	const enterDungeon = useCallback(async (roomName: string, objktId: string): Promise<
		IFetchResponseBase & { monsterData?: IMonster[] }
	> => {
		
		const fetchRes = await fetchAuthenticated(`/room/${roomName}/enterDungeon`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ objktId: objktId })
		});


		if (fetchRes.ok) {
			const monster = await fetchRes.json();
			console.log( monster)
			return { isSuccessful: true, monsterData: monster };
		}

		return { isSuccessful: false, message: fetchRes.statusText };
	}, [fetchAuthenticated]);


	return (
		<FirebaseContext.Provider
			value={{
				createRoom,
				getRoom,
				pinRoomItem,
				getRoomPinnedItems,
				unpinRoomItem,
				getAllRooms,
				movePinnedRoomItem,
				resizePinnedRoomItem,
				acquireTokens,
				createUser,
				updateScreenname,
				updateAvatar,
				updateEmail,
				getUser,
				getUserRooms,
				getImage,
			//	mint,
				getChat,
				addtoChat,
				deleteChat,
				getTrail,
				showTrail,
				getPlaylist,
				addtoPlaylist,
				removefromPlaylist,
				getRaces,
				getAllWallets,
				enterDungeon
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};
