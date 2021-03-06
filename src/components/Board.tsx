// @ts-nocheck
import './Board.css';

import {
	AnimationTypes,
	IAnimation,
	IAvatarChatMessages,
	IBackgroundState,
	IBoardImage,
	IBoardVideo,
	IChatMessage,
	IEmoji,
	IGifs,
	IOrder,
	IPinnedItem,
	IUserLocations,
	IUserProfiles,
	IWeather,
	ITweet,
	PinTypes,
	IWaterfallChat,
	IBoardHorse,
	IMusicPlayer,
	PanelItemEnum,
	newPanelTypes,
	IBoardRace,
	IBoardObjkt,
	IBoardWallet,
	ITrash,
	IbgHolder,
	IUserProfile,
	IBoardMessage,
	IMinter,
	IChecklist,
	IPet,
	ITrailObject,
	IPlayer,
	ISkin
} from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IMusicNoteProps, MusicNote } from './MusicNote';
import { XYCoord, useDrop } from 'react-dnd';

import { BoardObject } from './BoardObject';
import { PinButton } from './shared/PinButton';
import React, { useState, useCallback } from 'react';
import { UserCursors } from './UserCursors';
import { backgrounds } from './BackgroundImages';
import { ISubmit } from './NFT/OrderInput';
import { LoadingNFT } from './NFT/NFTPanel';
import { CustomToken as NFT } from '../typechain/CustomToken';
// import introShark from '../assets/intro/leftshark.gif';
// import present from '../assets/intro/present.gif';
import { useContext } from 'react';
import { MapsContext } from '../contexts/MapsContext';
import { Map } from './Maps';
import YouTubeBackground from './YouTubeBackground';
import { useEffect } from 'react';
import {useLocation} from 'react-router-dom'
import {isMobile} from 'react-device-detect';
import { activeAccount } from './ThePanel';


interface IBoardProps {
	videoId: string;
	hideAllPins: boolean;
	setPinnedVideoId: React.Dispatch<React.SetStateAction<string>>;
	pinnedVideoId: string;
	lastTime: number;
	videoRef: React.Ref<any>;
	volume: number;
	musicNotes: IMusicNoteProps[];
	updateNotes: (notes: IMusicNoteProps[]) => void;
	emojis: IEmoji[];
	updateEmojis: (emojis: IEmoji[]) => void;
	gifs: IGifs[];
	updateGifs: (gifs: IGifs[]) => void;
	images: IBoardImage[];
	updateImages: (images: IBoardImage[]) => void;
	videos: IBoardVideo[];
	updateVideos: (videos: IBoardVideo[]) => void;
	chatMessages: IChatMessage[];
	updateChatMessages: (chatMessages: IChatMessage[]) => void;
	userLocations: IUserLocations;
	userProfiles: IUserProfiles;
	setUserProfiles: React.Dispatch<React.SetStateAction<IUserProfiles>>;
	animations: IAnimation[];
	updateAnimations: (animations: IAnimation[]) => void;
	avatarMessages: IAvatarChatMessages;
	weather: IWeather;
	updateWeather: (weather: IWeather) => void;
	pinGif: (gifKey: string) => void;
	unpinGif: (gifKey: string) => void;
	pinImage: (imageKey: string) => void;
	unpinImage: (gifKey: string) => void;
	addVideo: (videoId: string | undefined) => void;
	pinVideo: (videoId: string | undefined) => void;
	unpinVideo: (videoId: string | undefined) => void;
	isVideoPinned: boolean;
	pinBackground: () => void;
	unpinBackground: () => void;
	background: IBackgroundState;
	pinnedText: { [key: string]: IPinnedItem };
	unpinText: (textKey: string) => void;
	moveItem: (
		type: PinTypes,
		itemKey: string,
		left: number,
		top: number,
		deltaX: number,
		deltaY: number
	) => void;
	NFTs: Array<IOrder & IPinnedItem>;
	loadingNFT?: ISubmit;
	updateNFTs: (nfts: Array<IOrder & IPinnedItem>) => void;
	pinNFT: (nftId: string) => void;
	unpinNFT: (nftId: string) => void;
	addNewContract: (nftAddress: string) => Promise<NFT | undefined>;
	onBuy: (nftId: string) => void;
	onCancel: (nftId: string) => void;
	onClickNewRoom: () => void;
	onClickPresent: () => void;
	musicPlayer: IMusicPlayer;
	tweets: ITweet[];
	pinTweet: (tweetID: string) => void;
	unpinTweet: (tweetID: string) => void;
	waterfallChat: IWaterfallChat;
	races: IBoardRace[];
	updateRaces: (races: IBoardRace[]) => void;
	horses: IBoardHorse[];
	pinHorse: (horseKey: string) => void;
	unpinHorse: (horseKey: string) => void;
	updateHorses: (horses: IBoardHorse[]) => void;
	updateSelectedPanelItem: (panelItem: PanelItemEnum | undefined) => void;
	setActivePanel: (panel: newPanelTypes) => void;
	pinRace: (raceKey: string) => void;
	unpinRace: (raceKey: string) => void;
	objkts: IBoardObjkt[];
	pinObjkt: (objktKey: string) => void;
	unpinObjkt: (objktKey: string) => void;
	updateObjkts: (objktKey: string) => void;
	routeRoom: (roomName: string) => void;
	trash: ITrash;
	minter: IMinter;
	bgHolder: IbgHolder;
	wallets: IBoardWallet[];
	unpinWallet: (walletKey: string) => void;
	updateWallets: (walletKey: string) => void;
	userProfile: IUserProfile;
	boardMessages: IBoardMessage[];
	unpinMessage: (messageKey: string) => void;
	setModalState: (modalState: string) => void;
	setPreparedMessage: (message: IBoardMessage) => void;
	checklist: IChecklist;
	setChecklist: (message: IChecklist) => void;
	pets: IPet[];
	setPets: (pets: IPet[]) => void;
	updateIsTyping: (isTyping: boolean) => void;
	sendMessage: (message: string) => void;
	trailObject: ITrailObject;
	currentSkin: ISkin;
	//player: IPlayer;
	//setPlayer: (player: IPlayer) => void;
}


export const Board = ({
	videoId,
	hideAllPins,
	setPinnedVideoId,
	pinnedVideoId,
	videoRef,
	lastTime,
	volume,
	musicNotes,
	updateNotes,
	emojis,
	updateEmojis,
	gifs,
	updateGifs,
	images,
	updateImages,
	videos,
	updateVideos,
	chatMessages,
	updateChatMessages,
	userLocations,
	userProfiles,
	setUserProfiles,
	animations,
	updateAnimations,
	avatarMessages,
	weather,
	pinGif,
	unpinGif,
	pinImage,
	unpinImage,
	addVideo,
	pinVideo,
	unpinVideo,
	isVideoPinned,
	background,
	pinBackground,
	unpinBackground,
	pinnedText,
	unpinText,
	moveItem,
	NFTs,
	loadingNFT,
	updateNFTs,
	pinNFT,
	unpinNFT,
	addNewContract,
	onBuy,
	onCancel,
	onClickNewRoom,
	onClickPresent,
	unpinTweet,
	tweets,
	pinTweet,
	waterfallChat,
	races,
	updateRaces,
	horses,
	pinHorse,
	unpinHorse,
	updateHorses,
	musicPlayer,
	updateSelectedPanelItem,
	setActivePanel,
	pinRace,
	unpinRace,
	objkts,
	pinObjkt,
	unpinObjkt,
	updateObjkts,
	routeRoom,
	trash,
	minter,
	bgHolder,
	wallets,
	unpinWallet,
	updateWallets,
	userProfile,
	boardMessages,
	unpinMessage,
	setModalState,
	setPreparedMessage,
	checklist,
	setChecklist,
	pets,
	setPets,
	updateIsTyping,
	sendMessage,
	trailObject,
	currentSkin
	//player,
	//setPlayer
}: IBoardProps) => {


	const location = useLocation();

	const petPoked = () => {
		
			let newPets = pets;
			console.log(newPets);
			console.log("hidepets");
			
			for(let i=0; i< newPets.length; i++){
				for(let j=0; j< images.length && i< newPets.length; j++){
					console.log("hide pet " + i);
					newPets[i].target.x = images[j].left+ Math.random() * (2);
					newPets[i].target.y = images[j].top;
					newPets[i].hide = true;
					++i;
				}
			}
			setPets(newPets);
		
	};

	const backgroundImg = background.name?.startsWith('http')
		? background.name
		: backgrounds[background.name!];

	const [, drop] = useDrop({
		accept: 'item',
		drop(item: IPinnedItem, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
			if(item && delta && delta.x  && delta.y){
				const left = Math.round(item.left + delta.x);
				const top = Math.round(item.top + delta.y);
				console.log(item);
				if(item.itemType != "gate")
					moveItem(item.itemType, item.id, left, top, delta.x, delta.y);
				

			}
			return undefined;
		}
	});

	const { isMapShowing } = useContext(MapsContext);
	const [isYouTubeShowing, setIsYouTubeShowing] = useState<boolean>(
		videoId !== ''
	);
	const [isPaused, setIsPaused] = useState<boolean>(true);
	const [showGates, setShowGates] = useState<boolean>(true);


	useEffect(() => {
		if (isMapShowing) {
			setIsYouTubeShowing(false);
		} else {
			setIsYouTubeShowing(true);
		}
	}, [isMapShowing]);

	useEffect(() => {
		setIsPaused(false);
	}, [videoId]);

	useEffect(() => {
		petPoked();
	}, [pets]);

	useEffect(() => {
		let x;
		let y;
		if(location.pathname.length != 1){
			x = location.pathname.split("/")[2].split(",")[0];
			y = location.pathname.split("/")[2].split(",")[1];
		}
		if(!y && x )
			setShowGates(false);
	})


	return (
		<div
			className="board-container"
			style={{
				backgroundImage: `url(${backgroundImg})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: "1920px 1080px"
			}}
			ref={drop}
			onClick={()=>{setActivePanel("empty")}}
		>


			{checklist.isVisible &&<BoardObject
				id={'checklist'}
				type="checklist"
				onPin={() => {}}
				onUnpin={() => {}}
				checklist={checklist}
				setChecklist={setChecklist}
				top={checklist.top}
				left={checklist.left}
				
			/>}

			{!hideAllPins && waterfallChat.show &&<BoardObject
				id={'chat'}
				type="chat"
				onPin={() => {}}
				onUnpin={() => {}}
				updateSelectedPanelItem={updateSelectedPanelItem}
				setActivePanel={setActivePanel}
				chat={waterfallChat.messages}
				top={waterfallChat.top}
				left={waterfallChat.left}
				routeRoom={routeRoom}
				updateIsTyping={updateIsTyping}
				sendMessage={sendMessage}
				initWidth={waterfallChat.width}
				initHeight={waterfallChat.height}
				currentSkin={currentSkin}
			/>}

			{!hideAllPins && trailObject.show &&<BoardObject
				id={'trail'}
				type="trail"
				onPin={() => {}}
				onUnpin={() => {}}
				trail={trailObject.trail}
				top={trailObject.top}
				left={trailObject.left}
				initWidth={trailObject.width}
				initHeight={trailObject.height}
				routeRoom={routeRoom}
				currentSkin={currentSkin}
			/>}

			{!hideAllPins && <BoardObject
				id={"trash"}
				type="trash"
				onPin={() => {}}
				onUnpin={() => {}}
				top={trash.top}
				left={trash.left}
				unpinGif={unpinGif}
				unpinImage={unpinImage}
				unpinText={unpinText}
				unpinObjkt={unpinObjkt}
				unpinBackground={unpinBackground}
				unpinWallet={unpinWallet}
				unpinMessage={unpinMessage}
				checklist={checklist}
				setChecklist={setChecklist}
				currentSkin={currentSkin}
			/>}

			{/*player && <BoardObject
				id={"player"}
				type="player"
				top={player.top}
				left={player.left}
				player={player}
				setPlayer={setPlayer}
			/>*/}



			{!hideAllPins ? (
				<TransitionGroup>
					{pets.map((pet) => (
						<CSSTransition
							key={pet.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {

							}}
						>
							<BoardObject
								id={pet.key}
								type="pet"
								onPin={() => {}}
								onUnpin={() => {}}
								top={pet.top}
								left={pet.left}
								subtype={pet.type}
								hide={pet.hide}
								targetX={pet.target.x}
								targetY={pet.target.y}
								petPoked={petPoked}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}


			
			{!hideAllPins && <BoardObject
				id={"bgHolder"}
				type="bgHolder"
				onPin={() => {}}
				onUnpin={() => {}}
				top={bgHolder.top}
				left={bgHolder.left}
				pinBackground={pinBackground}
				unpinImage={unpinImage}
				unpinGif={unpinGif}
				checklist={checklist}
				setChecklist={setChecklist}
				currentSkin={currentSkin}
			/>}

			{/*
			!hideAllPins && <BoardObject
				id={"message"}
				type="message"
				onPin={() => {}}
				onUnpin={() => {}}
				top={200}
				left={300}
				text={"message from X you should check this dddd"}
				imgSrc={"https://lh3.googleusercontent.com/nv7aLvJsS5hp43QHB_AP4Szp62H3H4kOFfHsIVRpSFyK1BkMfV1JV6jcq0TUm1EJUrLcIKJ-QP5T_dRJ13YcVlf1ebXWJS7TxiTD-Q"}
			/>
			*/
			}

			{showGates && <BoardObject
				id={"hist"}
				type="gate"
				subtype="top"
				onPin={() => {}}
				onUnpin={() => {}}
				routeRoom={routeRoom}
				top={10}
				left={900}
				currentSkin={currentSkin}
			/>}

			{showGates &&<BoardObject
				id={"hist"}
				type="gate"
				subtype="left"
				onPin={() => {}}
				onUnpin={() => {}}
				routeRoom={routeRoom}
				top={500}
				left={10}
				currentSkin={currentSkin}
			/>}

			{showGates &&<BoardObject
				id={"hist"}
				type="gate"
				subtype="bottom"
				onPin={() => {}}
				onUnpin={() => {}}
				routeRoom={routeRoom}
				top={800}
				left={900}
				currentSkin={currentSkin}
			/>}

			{showGates &&<BoardObject
				id={"hist"}
				type="gate"
				subtype="right"
				onPin={() => {}}
				onUnpin={() => {}}
				routeRoom={routeRoom}
				top={500}
				left={1780}
				currentSkin={currentSkin}
			/>}


			{/*!hideAllPins &&<BoardObject
				id={"objkt"}
				objktId={"374125"}
				type="objkt"
				onPin={() => {}}
				onUnpin={() => {}}
				activeAddress={activeAddress}
				top={300}
				left={500}
			/>*/}

			{!hideAllPins ? (
				<TransitionGroup>
					{boardMessages.map((bMessage) => (
						<CSSTransition
							key={bMessage.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {

							}}
						>
							<BoardObject
								{...bMessage}
								id={bMessage.key}
								text={bMessage.message}
								imgSrc={bMessage.imgSrc}
								data={bMessage.data}
								objktId={bMessage.objktId}
								domain={bMessage.domain}
								address={bMessage.address}
								senderAddress={bMessage.senderAddress}
								isWidget={bMessage.isWidget}
								routeRoom={routeRoom}
								type="message"
								onPin={() => {
								}}
								onUnpin={() => {
								}}
								initWidth={ bMessage.width}
								initHeight={bMessage.height}		
								checklist={checklist}
								setChecklist={setChecklist}	
								currentSkin={currentSkin}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{wallets.map((wallet) => (
						<CSSTransition
							key={wallet.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {

							}}
						>
							<BoardObject
								{...wallet}
								id={wallet.key}
								address={wallet.address}
								domain={wallet.domain}
								type="wallet"
								onPin={() => {
								}}
								onUnpin={() => {
								}}
								routeRoom={routeRoom}
								userProfile={userProfile}
								unpinText={unpinText}
								setModalState={setModalState}
								setPreparedMessage={setPreparedMessage}
								currentSkin={currentSkin}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}


			{!hideAllPins ? (
				<TransitionGroup>
					{objkts.map((objkt) => (
						<CSSTransition
							key={objkt.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {

							}}
						>
							<BoardObject
								{...objkt}
								id={objkt.key}
								type={objkt.type}
								objktId={objkt.id}
								onPin={() => {
									pinObjkt(objkt.key);
								}}
								onUnpin={() => {
									unpinObjkt(objkt.key);
								}}
								initWidth={objkt.width}
								initHeight={objkt.height}
								checklist={checklist}
								setChecklist={setChecklist}
								currentSkin={currentSkin}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}


			<TransitionGroup>
				{chatMessages.map((message) => (
					<CSSTransition
						key={message.key}
						timeout={7000}
						classNames="message-transition"
						onEntered={() => {
							const index = chatMessages.findIndex(
								(msg) => msg.key === message.key
							);
							updateChatMessages([
								...chatMessages.slice(0, index),
								...chatMessages.slice(index + 1)
							]);
						}}
					>
						<div
							className="board-message"
							style={
								message.isCentered
									? {
											width: window.innerWidth,
											textAlign: 'center',
											left: 0,
											right: 0,
											top: message.top,
											maxWidth: 'none',
											userSelect: 'auto'
									  }
									: {
											top: message.top,
											left: message.left
									  }
							}
						>
							{message.value}
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>

			{isMobile ? (
								<BoardObject
									text={"Mobile version is  under construction !"}
									id={"warning"}
									type="text"
									onPin={() => {}}
									onUnpin={() => {
										
									}}
									top={200}
									left={100}
									initWidth={400}
									initHeight={100}
								/>
							) : null}

			{/* <TransitionGroup>
				<CSSTransition
					appear
					timeout={10}
					classNames="room-button-transition"
					onEnter={() => {
						setTimeout(() => {
							setIntroState('appear');
						}, 5000);
						setTimeout(() => {
							setIntroState('end');
						}, 20000);
					}}
				>
					<div className="room-button">{renderIntro()}</div>
				</CSSTransition>
				<CSSTransition
					appear
					timeout={10}
					classNames="room-button-transition"
					onEnter={() => {
						setTimeout(() => {
							setPresentState('appear');
						}, 5000);
						setTimeout(() => {
							setPresentState('end');
						}, 20000);
					}}
				>
					<div className="room-present">{renderPresent()}</div>
				</CSSTransition>
			</TransitionGroup> */}

			{!hideAllPins ? (
				<TransitionGroup>
					{Object.values(pinnedText).map((text) => (
						<CSSTransition
							key={text.key}
							timeout={10}
							classNames="gif-transition"
						>
							{!hideAllPins ? (
								<BoardObject
									{...text}
									id={text.key!}
									type="text"
									onPin={() => {}}
									onUnpin={() => {
										unpinText(text.key || '');
									}}
									initWidth={text.width}
									initHeight={text.height}
									checklist={checklist}
									setChecklist={setChecklist}
									currentSkin={currentSkin}
								/>
							) : null}
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}
			{!hideAllPins ? (
				<TransitionGroup>
					{tweets.map((tweet) => (
						<CSSTransition
							key={tweet.id}
							timeout={10}
							classNames="gif-transition"
						>
							<BoardObject
								type="tweet"
								{...tweet}
								onPin={() => {
									pinTweet(tweet.id);
								}}
								onUnpin={() => {
									unpinTweet(tweet.id);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{gifs.map((gif) => (
						<CSSTransition
							key={gif.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {
								if (!gif.isPinned) {
									const index = gifs.findIndex((_gif) => _gif.key === gif.key);
									updateGifs([
										...gifs.slice(0, index),
										...gifs.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								type="gif"
								id={gif.key}
								{...gif}
								onPin={() => {
									pinGif(gif.key);
								}}
								onUnpin={() => {
									unpinGif(gif.key);
								}}
								initWidth={gif.width}
								initHeight={gif.height}
								checklist={checklist}
								setChecklist={setChecklist}
								
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{images.map((image) => (
						<CSSTransition
							key={image.key}
							timeout={1000}
							classNames="gif-transition"
							onEntered={() => {
								if (!image.isPinned) {
									const index = images.findIndex(
										(_image) => _image.key === image.key
									);
									updateImages([
										...images.slice(0, index),
										...images.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								{...image}
								id={image.key}
								type="image"
								imgSrc={image.url}
								initWidth={image.width}
								initHeight={image.height}
								onPin={() => {
									pinImage(image.key);
								}}
								onUnpin={() => {
									unpinImage(image.key);
								}}
								checklist={checklist}
								setChecklist={setChecklist}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{!hideAllPins ? (
				<TransitionGroup>
					{videos.map((video) => (
						<CSSTransition
							key={video.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {
								if (!video.isPinned) {
									const index = videos.findIndex(
										(_video) => _video.key === video.key
									);
									updateVideos([
										...videos.slice(0, index),
										...videos.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								type="video"
								isPinnedPlaying={video.isPlaying}
								setPinnedVideoId={setPinnedVideoId}
								pinnedVideoId={pinnedVideoId}
								id={video.key}
								{...video}
								onPin={() => {
									pinVideo(video.key);
								}}
								onUnpin={() => {
									unpinVideo(video.key);
								}}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			<TransitionGroup>
				{animations.map((animation) => (
					<CSSTransition
						key={animation.type}
						timeout={10}
						classNames="animation-transition"
						onEntered={() => {
							const index = animations.findIndex(
								(_animation) => _animation.type === animation.type
							);
							updateAnimations([
								...animations.slice(0, index),
								...animations.slice(index + 1)
							]);
						}}
					>
						<Animation {...animation} />
					</CSSTransition>
				))}
			</TransitionGroup>

			{!hideAllPins ? (
				<TransitionGroup>
					{NFTs.map((nft) => (
						<CSSTransition
							key={nft.key}
							timeout={10}
							classNames="gif-transition"
							onEntered={() => {
								if (!nft.isPinned) {
									const index = NFTs.findIndex((_nft) => _nft.key === nft.key);
									updateNFTs([
										...NFTs.slice(0, index),
										...NFTs.slice(index + 1)
									]);
								}
							}}
						>
							<BoardObject
								{...nft}
								id={nft.key!}
								type="NFT"
								onPin={() => {
									pinNFT(nft.key!);
								}}
								onUnpin={() => {
									unpinNFT(nft.key!);
								}}
								addNewContract={addNewContract}
								onBuy={onBuy}
								onCancel={onCancel}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			) : null}

			{/* <TransitionGroup> */}
			{loadingNFT && (
				<CSSTransition timeout={3000} classNames="gif-transition">
					<LoadingNFT submission={loadingNFT} />
				</CSSTransition>
			)}
			{/* </TransitionGroup> */}


			<div className="board-container-pin">
				{isMapShowing && background.type !== 'map' && (
					<PinButton
						isPinned={false}
						onPin={pinBackground}
						onUnpin={unpinBackground}
						placeholder="background"
					/>
				)}
			</div>

			{isMapShowing ? <Map /> : null}

			<UserCursors
				userLocations={userLocations}
				userProfiles={userProfiles}
				setUserProfiles={setUserProfiles}
				avatarChatMessages={avatarMessages}
				weather={weather}
			/>

		</div>
	);
};

interface IAnimationProps {
	type: AnimationTypes;
}

const Animation = ({ type }: IAnimationProps) => {
	if (type === 'start game') {
		return (
			<div
				style={{
					width: window.innerWidth,
					textAlign: 'center',
					left: 0,
					right: 0,
					top: '20vh',
					userSelect: 'none',
					position: 'absolute',
					fontSize: '2em'
				}}
			>
				starting tower defense!
			</div>
		);
	}

	if (type === 'info') {
		return (
			<div
				style={{
					width: window.innerWidth,
					textAlign: 'center',
					left: 0,
					right: 0,
					top: '30vh',
					userSelect: 'none',
					position: 'absolute',
					fontSize: '1.8em'
				}}
			>
				place your tower to defend yourself
			</div>
		);
	}

	if (type === 'end game') {
		return (
			<div
				style={{
					width: window.innerWidth,
					textAlign: 'center',
					left: 0,
					right: 0,
					top: '20vh',
					userSelect: 'none',
					position: 'absolute',
					fontSize: '2em'
				}}
			>
				finished tower defense
			</div>
		);
	}

	return null;
};
