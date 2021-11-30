// @ts-nocheck
//style
import './Panel.css';
//material ui
import {
	FormControlLabel,
	IconButton,
	Switch,
	InputBase,
	TextField,
	Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
//react
import React, { useEffect, useState, useContext, useRef } from 'react';
//utility
import axios from 'axios';
import { FirebaseContext } from '../contexts/FirebaseContext';
//icons
import loadingDots from '../assets/loading-dots.gif';
import googleIcon from '../assets/buttons/google.png'
import giphyIcon from '../assets/buttons/giphy.png'
import unsplashIcon from '../assets/buttons/unsplash.png'
import youtubeIcon from '../assets/buttons/youtube.png'
import mapsIcon from '../assets/buttons/maps.png'
import marketplaceIcon from '../assets/buttons/marketplace.png'
import raceIcon from '../assets/buttons/watch.png'
import horseIcon from '../assets/buttons/horse.png'
import chatIcon from '../assets/buttons/chat.png'
import musicIcon from '../assets/buttons/music.png'
import homeIcon from '../assets/buttons/home.png'
import emailIcon from '../assets/buttons/email.png'
import newroomIcon from '../assets/buttons/newroom.png'
//panels
import YouTubeMusicPanel from './YouTubeMusicPanel';

import { ObjktPanel } from './ObjktPanel';
import { WidgetPanel } from './WidgetPanel';
import { PetPanel } from './PetPanel';

import { WalletPanel } from './WalletPanel';
import { MusicPlayerPanel } from './MusicPlayerPanel';
import { Chat } from './Chat';
import { EmailPanel } from './EmailPanel';
import BackgroundPanel from './BackgroundPanel';
import { GiphyPanel } from './GiphyPanel';
import {SettingsPanel} from './SettingsPanel';
import {Hints} from './Hints';
//types
import { ISubmit } from './NFT/OrderInput';
import { IChatRoom, newPanelTypes, IMusicPlayer, IMetadata, IChecklist, ITrailObject } from '../types';
import { IGif } from '@giphy/js-types';
import { DAppClient } from "@airgap/beacon-sdk";

const dAppClient = new DAppClient({ name: "Beacon Docs" });
let activeAccount;
interface IThePanelProps {
	//panel
	activePanel: newPanelTypes;
	setActivePanel: (panel: newPanelTypes) => void;
	setBottomPanelHeight: (height: number) => void;
	//google, unsplash, giphy
	sendImage: (name: string, type: 'background' | 'gif' | 'image') => void;
	images: IImagesState[];
	setImages: React.Dispatch<React.SetStateAction<IImagesState[]>>;
	sendGif: (gif: IGif) => void;
	//youtube
	sendVideo: (id: string) => void; // Sends video id to socket event to be set as background and played
	lastQuery: string; // Last enteblack query in the search bar
	queriedVideos: Array<any>; // Videos returned from search query
	isVideoShowing: boolean;
	lastVideoId: string;
	hideAllPins: boolean;
	setVideoId: (id: string) => void;
	setLastVideoId: (id: string) => void;
	setIsVideoShowing: (value: boolean) => void;
	setLastQuery: (query: string) => void; // modifies BottomPanel state so last queried videos can persist
	setVolume: (volume: number) => void;
	setHideAllPins: (value: boolean) => void;
	setQueriedVideos: (queriedVideos: Array<any>) => void; // modifies BottomPanel state so last queried videos can persist
	updateLastTime: () => void;
	addVideo: (videoId: string | undefined) => void;
	//+NFT
	onError: (message: string) => void;
	onSuccess: (submission: ISubmit) => void;
	roomData?: IChatRoom;
	//race
	sendRace: (id: string) => void;
	addRace: (id: string) => void;
	//horse
	sendHorse: (id: string, type: 'horse') => void;
	//marketplace
	pinMarketplace: () => void;
	//chat
	pinMessage: (message: string) => void;
	sendMessage: (message: string) => void;
	updateIsTyping: (isTyping: boolean) => void;
	showWhiteboard: boolean;
	updateShowWhiteboard: (show: boolean) => void;
	setBrushColor: (color: string) => void;
	sendAnimation: (animationText: string, animationType: string) => void;
	pinTweet: (id: string) => void; 
	showChat: () => void;
	//musicplayer
	changePlaylist: (url: string, name: string) => void;
	musicPlayer: IMusicPlayer;
	//email
	sendEmail: (email: string, message: string) => void;
	//new room
	onNewRoom: () => void;
	//route Home
	routeHome: () => void;
	//settings
	avatar?: string;
	setStep: (step: number) => void;
	onChangeName: (username: string) => void;
	onSubmitUrl: (url: string) => void;
	onChangeAvatar: (avatar: string) => void;
	onSendLocation: (location: string) => void;
	onSubmitEmail: (email: string) => void;
	currentAvatar: string;
	username: string;
	email: string;
	myLocation?: string;
	music?: IMetadata;
	clearField: (field: string) => void;
	//objkt
	sendObjkt: (id: string, type: string) => void;
	//wallet room
	routeRoom: (roomName: string) => void;
	//wallet board objects
	sendWallet: (address: String) => void;
	roomId: string;
	checklist: IChecklist;
	setChecklist: (message: IChecklist) => void;
	trailObject: ITrailObject;
	setTrailObject: (trail: ITrailObject) => void;
}

interface IPanel {
	type: newPanelTypes;
	icon?: string;
}

export interface IResponseDataUnsplash {
	urls: {
		full: string;
		raw: string;
		regular: string;
		small: string;
		thumb: string;
	};
	alt_description: string;
	id: string;
}

export interface IResponseDataGoogle {
	url: string;
	origin: {
		title: string;
	};
}

export interface IImagesState {
	alt: string;
	imageLink: string;
	thumbnailLink: string;
	id: string;
}
/*
const panels: IPanel[] =
	[
		{type: 'settings'},
		{type: 'home', icon: homeIcon},
		{type: 'chat', icon: chatIcon},
		{type: 'google', icon: googleIcon},
		{type: 'unsplash', icon: unsplashIcon},
		{type: 'giphy', icon: giphyIcon},
		{type: 'youtube', icon: youtubeIcon}, 
		{type: 'maps', icon: mapsIcon}, 
		{type: 'marketplace', icon: marketplaceIcon}, 
		{type: 'race', icon: raceIcon}, 
		{type: 'horse', icon: horseIcon}, 
		{type: 'music', icon: musicIcon}, 
		{type: 'email', icon: emailIcon}, 
		{type: 'newroom', icon: newroomIcon}, 
		{type: '+NFT'},
	] */
const panels: IPanel[] =
	[
		{type: 'home', icon: homeIcon},
		{type: 'chat'},
		{type: '+image'}, 
		{type: '+objkt'}, 
		{type: '+wallet'}, 
		{type: '+widget'}, 
		{type: '+pet'}, 
	] 
const useStyles = makeStyles({
	input: {
		fontFamily: "roboto",
		color: "black",
	  },

});

const ThePanel = ({
	//panel
	activePanel,
	setActivePanel,
	setBottomPanelHeight,
	//home button
	routeHome,
	//google, unsplash, giphy
	sendImage,
	images,
	setImages,
	sendGif,
	//youtube
	setVideoId,
	setLastVideoId,
	lastVideoId,
	setVolume,
	sendVideo,
	queriedVideos,
	setQueriedVideos,
	lastQuery,
	setLastQuery,
	setIsVideoShowing,
	isVideoShowing,
	updateLastTime,
	hideAllPins,
	setHideAllPins,
	addVideo,
	//+NFT
	onError, 
	onSuccess, 
	roomData,
	//race
	sendRace,
	addRace,
	//horse
	sendHorse,
	//marketplace
	pinMarketplace,
	//chat
	sendMessage,
	updateIsTyping,
	pinMessage,
	showWhiteboard,
	updateShowWhiteboard,
	setBrushColor,
	sendAnimation,
	pinTweet,
	showChat,
	//musicplayer
	changePlaylist,
	musicPlayer,
	//email
	sendEmail,
	//newroom
	onNewRoom,
	//settings
	avatar,
	onChangeName,
	onSubmitUrl,
	onChangeAvatar,
	onSendLocation,
	onSubmitEmail,
	currentAvatar,
	setStep,
	username,
	email,
	myLocation,
	music,
	clearField,
	sendObjkt,
	routeRoom,
	sendWallet,
	roomId,
	setChecklist,
	checklist,
	trailObject,
	setTrailObject
}: IThePanelProps) => {
	const [text, setText] = useState('');
	const [isBackground, setisBackground] = useState(false);
	const isImagesEmpty = images.length === 0;
	const firebaseContext = useContext(FirebaseContext);
	const [loading, setLoading] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const classes = useStyles();
	const [synced, setSynced] = useState('sync');
	const [balance, setBalance] = useState();
	
	const [showUnsync, setShowUnsync] = useState(false);
	const [activeSearch, setActiveSearch] = useState("google");


	const googleSearch = async (textToSearch: string) => {
		setLoading(true);
		const res = await firebaseContext.getImage(textToSearch);
		const response = JSON.parse(JSON.stringify(res.message as string));

		const imageDataWanted = response.map(
			({ url, origin }: IResponseDataGoogle) => {
				const { title } = origin;
				return {
					alt: title,
					imageLink: url,
					thumbnailLink: url,
					id: url
				};
			}
		);

		setLoading(false);
		if (setImages) setImages(imageDataWanted);
	}

	const checked = () => {
		if(activePanel === "maps" || activePanel === "marketplace" ){
			return true;
		}
		else if(activePanel === "+NFT" || activePanel === "horse" ){
			return false;
		}
		else{
			return isBackground;
		}
	};

	function markChecklist (index){
		if(checklist.isVisible){
			let items = checklist.items;
			items[index].condition = true;
			setChecklist({...checklist, items })
		}
	}

	useEffect(() => {
		async function getAcc() {
			activeAccount = await dAppClient.getActiveAccount();
			if (activeAccount){
			  setSynced(activeAccount.address.slice(0, 6) + "..." + activeAccount.address.slice(32, 36) );

			  let domain;
			  await fetch('https://api.tezos.domains/graphql', {
				  method: 'POST',
				  headers: {
					  'Content-Type': 'application/json',
				  },
				  body: JSON.stringify({
					  query: `
							  {
								  reverseRecord(address: "`+ activeAccount.address +`"){owner domain{name}}
							  }
							  `,
					  variables: {
					  },
				  }
				  ),
				  })
				  .then((res) => res.json())
				  .then((result) => {
					  console.log(result);	
					  if(result.data.reverseRecord){
							domain = result.data.reverseRecord.domain.name;
							setSynced(domain);
						}
				  });
			  
			  setShowUnsync(true);
			  
			  markChecklist(0);

			  fetch('https://api.tzkt.io/v1/accounts/' + activeAccount.address)
				.then(response => response.json())
				.then(data => setBalance(data.balance))
			}
			else{
			  setSynced('sync');
			  setShowUnsync(false);
			  if(roomId === "onboarding"){
				  sync();
			  }
			}
		  }
	  
		  getAcc();
	}, []);

	async function unsync() {
		activeAccount = await dAppClient.getActiveAccount();
		if (activeAccount) {
		  // User already has account connected, everything is ready
		  // You can now do an operation request, sign request, or send another permission request to switch wallet
		  dAppClient.clearActiveAccount().then(async () => {
			activeAccount = await dAppClient.getActiveAccount();
	
			setSynced('sync');
			setShowUnsync(false);
			setBalance();
		  });
		}
	  }
	  
	async function sync() {
		activeAccount = await dAppClient.getActiveAccount();
		if (activeAccount) {
		  // User already has account connected, everything is ready
		  // You can now do an operation request, sign request, or send another permission request to switch wallet

		  console.log("Already connected:", activeAccount.address);
		  markChecklist(0);
		  return activeAccount;
		} else {
		  // The user is not connected. A button should be displayed where the user can connect to his wallet.
		  console.log("Not connected!");
		  try {
			console.log("Requesting permissions...");
			const permissions = await dAppClient.requestPermissions();
			console.log("Got permissions:", permissions.address);
			setSynced(permissions.address)
			console.log("reload")
			window.location.reload();
			setShowUnsync(true);

			markChecklist(0);

			fetch('https://api.tzkt.io/v1/accounts/' + permissions.address)
			.then(response => response.json())
			.then(data => setBalance(data.balance))
		  } catch (error) {
	
			console.log("Got error:", error);
		  }
		}
	  }

	useEffect(() => {
		if(panelRef.current){
			setBottomPanelHeight(panelRef.current.offsetHeight);
		}
	}, [activePanel, setBottomPanelHeight]);

	useEffect(() => {
		if (!isImagesEmpty) return;
		searchSubmit('sky', setImages);
	}, [isImagesEmpty, setImages]); 

	return (
		<div ref={panelRef} className="background-container" style={{overflowY: 'auto'}}>
			
			{activePanel === 'chat' &&
				<div  className="background-icon-list" >
					<Chat
						sendMessage={sendMessage}
						pinMessage={pinMessage}
						pinTweet={pinTweet}
						updateIsTyping={updateIsTyping}
						showWhiteboard={showWhiteboard}
						updateShowWhiteboard={updateShowWhiteboard}
						setBrushColor={setBrushColor}
						sendAnimation={sendAnimation}
						showChat={showChat}
					/>
				</div>
			}

			{activePanel === '+image' && 
				<div  className="background-icon-list"  style={{ display: "flex"}}>
					{
						<div>						
							{(activeSearch === 'google' || activeSearch === 'unsplash') && 
							<BackgroundPanel
								sendImage={sendImage}
								images={images}
								setImages={setImages}
								searchValue={text}
								isGoogle={activePanel === 'google'}
								isBackground={isBackground}
								searchSubmit={searchSubmit}
							/>}
							<div style={{ width: "100vw", overflowX: 'auto'}}>
								{activeSearch === 'giphy' && 
								<GiphyPanel
									sendGif={sendGif} 
									search={text}
									isBackground={isBackground}
									sendImage={sendImage} 
								/>
							}
							 </div>
							<div style={{ display: "flex",  justifyContent: "center", alignItems: "center"}}> 
								<div style={{ alignSelf: "center"}}> Search by   

									<IconButton
										disabled= {activeSearch === "google"}
										onClick={() => {setActiveSearch("google"); }} 
									>
										<img src={ googleIcon } alt= { "googleIcon" }  width= "30" height= "30"/> 
									</IconButton>
									<IconButton
										disabled= {activeSearch === "unsplash"}
										onClick={() => {setActiveSearch("unsplash"); }} 
									>
										<img src={ unsplashIcon } alt= { "unsplashIcon" }  width= "30" height= "30"/> 
									</IconButton>
									<IconButton
										disabled= {activeSearch === "giphy"}
										onClick={() => {setActiveSearch("giphy"); }}>
										<img src={ giphyIcon } alt= { "giphyIcon" }  width= "30" height= "30"/> 
									</IconButton>
								</div>
								<div style={{ paddingBlock: 5, paddingInline: 20 }}> 
									<TextField
										inputProps={{ className: classes.input }}
										color="primary" focused
										placeholder={"Search by " + activeSearch}
										onChange={(e) => setText(e.target.value)}
										onKeyPress={(e) => {
												if(e.key === 'Enter'){
													if(activeSearch === 'unsplash'){searchSubmit(text, setImages);} else if (activeSearch === 'google') {googleSearch(text);}
												}
											}
										}
										value={text}
									/>
								</div>
								<IconButton
									color="primary"
									onClick={() => {if(activeSearch === 'unsplash'){searchSubmit(text, setImages);} else if (activeSearch === 'google') {googleSearch(text);}}}
								>
									<SearchIcon />
								</IconButton>

								{loading &&
								<img
									style={{
										height: 8,
										width: 30,
										
									}}
									src={loadingDots}
									alt="three dots"
								/>
								}


							</div> 


						</div>
					}


				</div>
					
			}


			{activePanel === '+objkt' &&
				<div  className="background-icon-list" >
					<ObjktPanel sendObjkt= {sendObjkt} activeAddress= { activeAccount ? activeAccount.address : null} />
				</div>
			}
			

			{activePanel === '+wallet' &&
				<div  className="background-icon-list" >
					<WalletPanel sendWallet= {sendWallet} />
				</div>
			}
			
			{activePanel === '+widget' &&
				<div  className="background-icon-list" >
					<WidgetPanel sendObjkt= {sendObjkt} activeAddress= {activeAccount ? activeAccount.address : null} />
				</div>
			}

			{activePanel === '+pet' &&
				<div  className="background-icon-list" >
					<PetPanel sendObjkt= {sendObjkt} activeAddress= {activeAccount ? activeAccount.address : null} />
				</div>
			}

			<div className="background-search-settings">
				<Button className="app-btn" style={{ color: "black", fontFamily: "roboto" }} title={`version: ${process.env.REACT_APP_VERSION}. production: leo, mike, yinbai, krishang, tony, grant, andrew, sokchetra, allen, ishaan, kelly, taner, eric, anthony, maria`}  onClick={async () => { window.open('https://adventurenetworks.net/#/'); }} >Adventure Networks </Button>

				<div style={{ marginRight: "auto", display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "roboto" }} >

					{//panel icon-buttons & special cases for newroom home & marketplace
					panels.map((panel, index) => (
						<IconButton
							color= { "inherit" }
							disabled= {activePanel === panel.type ? true : false }
							onClick={() => {setActivePanel(panel.type); 
								if(panel.type === "newroom"){onNewRoom()}
								else if(panel.type === "home"){routeHome()}
								else if(panel.type === "marketplace"){
									pinMarketplace()
								}
								if(panel.type === "settings"){setHideAllPins(true)}
								else{setHideAllPins(false)}
							}} 
							key= {index}
						>
							{panel.icon ? 
								<img className = {activePanel === panel.type ? "button-disabled" : "" } src={ panel.icon } alt= { panel.type }  width= "30" height= "30"/> 
								: (panel.type === "settings" ? <img className = {activePanel === panel.type ? "button-disabled" : "" } src={ avatar } alt= { panel.type }  width= "30" height= "30"/> : <div style={{fontFamily: "roboto", color: "black", fontSize: 20}}>{panel.type} </div>) 
							}
							
						</IconButton>
					))}


{				/*	<div style={{fontFamily: "roboto" }}>
						<FormControlLabel
							checked={checked()}
							onChange={() => setisBackground(!isBackground)}
							control={<Switch color="primary" />}
							label="BACKGROUND"
						/>
						</div>*/}

				</div>

				<div style={{textAlign: "center", display: 'flex', width: 741, alignItems: "center", }}>
					<Hints></Hints>
				</div>

				<div style={{ display: 'flex', width: 341 }}>
				<Button className="app-btn" style={{ marginLeft: "auto", color: "black", fontFamily: "roboto" }} onClick={async () => { 

					}} >{balance/1000000} XTZ </Button>

					<Button className="app-btn" style={{  color: "black", fontFamily: "roboto" }} title={"Hic et Nunc (h=n)"}  onClick={async () => { 
						if(activeAccount){
							if(roomId && activeAccount && roomId === activeAccount.address){
								await firebaseContext.showTrail(activeAccount.address, !trailObject.show);

								setTrailObject((trailObject) => ({ ...trailObject, show: !trailObject.show }))
							}
							else{
								markChecklist(14);
								routeRoom(activeAccount.address);
							}
						}
						else{
							await sync();
						}
					}} >{synced} </Button>
					{showUnsync && <Button className="app-btn" style={{  color: "black", fontFamily: "roboto"}} title={"Hic et Nunc (h=n)"} onClick={() => { unsync() }} >unsync </Button>}
				</div>
			</div>
		</div>
	);
};

export const getSearchedUnsplashImages = async (text: string) =>
	await axios.get('https://api.unsplash.com/search/photos?per_page=15', {
		params: { query: text },
		headers: {
			authorization: 'Client-ID MZjo-jtjTqOzH1e0MLB5wDm19tMAhILsBEOcS9uGYyQ'
		}
	});

export const searchSubmit = async (
	textToSearch: string,
	setImages?: React.Dispatch<React.SetStateAction<IImagesState[]>>
) => {

	const response = await getSearchedUnsplashImages(textToSearch);

	const imageDataWanted = response.data.results.map(
		({ urls, alt_description, id }: IResponseDataUnsplash) => {
			const { regular, thumb } = urls;
			return {
				alt: alt_description,
				imageLink: regular,
				thumbnailLink: thumb,
				id: id
			};
		}
	);

	if (setImages) setImages(imageDataWanted);
};
export {activeAccount};
export default ThePanel;
