// @ts-nocheck
import { MoveButton, PinButton } from './shablack/PinButton';
import React, { useState, useContext, useEffect } from 'react';

import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDrag } from 'react-dnd';
import {
	IOrder,
	IWaterfallMessage,
	IHorse,
	IPlaylist,
	PanelItemEnum,
	newPanelTypes,
	IUserProfile,
	IBoardMessage
} from '../types';
import { Order } from './NFT/Order';
import { CustomToken as NFT } from '../typechain/CustomToken';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Map } from './Maps';
import { Tweet } from 'react-twitter-widgets';
import { WaterfallChat } from './WaterfallChat';
import { MusicPlayer } from './MusicPlayer';
import ReactPlayer from 'react-player';
import { AppStateContext } from '../contexts/AppStateContext';
import { Horse } from './Horse';
import confetti from 'canvas-confetti';
import { TezosToolkit, OpKind, MichelsonMap } from '@taquito/taquito'
import {
    BeaconWallet,
    BeaconWalletNotInitialized,
  } from '@taquito/beacon-wallet'
  
import {useLocation} from 'react-router-dom'
import { XYCoord, useDrop } from 'react-dnd';
import { activeAccount } from './ThePanel';
import walletImage from '../assets/buttons/wallet.png'
import walletReceiveImage from '../assets/buttons/wallet_receive.png'
import trashImage from '../assets/buttons/trash.png'
import trashOpenImage from '../assets/buttons/trash_open.png'
import { FirebaseContext } from '../contexts/FirebaseContext';
import { v4 as uuidv4 } from 'uuid';

const _ = require("lodash"); 
const Tezos = new TezosToolkit('https://mainnet.api.tez.ie')
const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferblackNetwork: 'mainnet',
})
Tezos.setWalletProvider(wallet)
const  v2 = 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn';

const useStyles = makeStyles({
	container: {
		position: 'absolute',
		zIndex: 9999995,
		userSelect: 'none',
		display: 'flex'
	},
	paper: {
		padding: 0,
	},
	buttonList: {
		display: 'flex',
		flexDirection: 'column'
	},
	text: {
		padding: 5,
		display: 'flex',
		justifyContent: 'center',
		whiteSpace: 'pre-line', //allows it to display multiple lines!,
		color: "black",
		backgroundColor: "white",
		fontFamily: 'poxel-font',
	},
	button: {
		color: "black",
		fontFamily: 'poxel-font',
		fontSize: 12
	},

    buttonLarge: {
		color: "black",
		fontFamily: 'poxel-font',
        fontSize: 18
	},

    buttonBuy: {
		color: "black",
		fontFamily: 'poxel-font',
        fontSize: 20
	},

    buttonSize: {
		color: "black",
		fontFamily: 'poxel-font',
        fontSize: 10
	},

	buttonGate: {
		color: "black",
		backgroundColor: "white",
		fontFamily: 'poxel-font',
        fontSize: 20,
	},
	buttonGateBottom: {
		color: "black",
		backgroundColor: "white",
		fontFamily: 'poxel-font',
        fontSize: 20,
		transform: "rotate(180deg)"
	}
});

interface BoardObjectProps {
	id: string;
	type:
	| 'horse'
	| 'objkt'
	| 'objktStat'
	| 'gif'
	| 'image'
	| 'video'
	| 'text'
	| 'NFT'
	| 'map'
	| 'chat'
	| 'musicPlayer'
	| 'race'
	| 'gate'
	| 'trash'
	| 'minter'
	| 'bgHolder'
	| 'wallet'
	| 'message'
	| 'tweet';
	data?: IGif;
	imgSrc?: string;
	text?: string;

	onPin: () => void;
	onUnpin: () => void;
	setPinnedVideoId?: (id: string) => void;

	top: number;
	left: number;

	isPinnedPlaying?: boolean;
	pinnedVideoId?: string;
	isPinned?: boolean;
	order?: IOrder;

	addNewContract?: (nftAddress: string) => Promise<NFT | undefined>;

	onBuy?: (nftId: string) => void;
	onCancel?: (nftId: string) => void;

	setActivePanel?: (panel: newPanelTypes) => void;
	updateSelectedPanelItem?: (panelItem: PanelItemEnum | undefined) => void;
	chat?: IWaterfallMessage[];
	horseData?: IHorse;
	playlist?: IPlaylist[];

	raceId?: string;

	objktId?: string;

	routeRoom?: (roomName: string) => void;
	subtype?: string;

	unpinGif?: (gifKey: string) => void;
	unpinImage?: (gifKey: string) => void;
	unpinText?: (textKey: string) => void;
	unpinObjkt?: (objktKey: string) => void;
	pinBackground?: (imgSrc: string) => void;
	unpinBackground?: () => void;
	unpinWallet?: (walletKey: string) => void;
	unpinMessage?: (messageKey: string) => void;
	address?: string;
	domain?: string;
	userProfile?: IUserProfile;

	senderAddress?: string;
	setModalState?: (modalState: string) => void;
	setPreparedMessage?: (message: IBoardMessage) => void;
	isWidget?:boolean;
}

export const BoardObject = (props: BoardObjectProps) => {
	const {
		top,
		left,
		data,
		onPin,
		onUnpin,
		isPinnedPlaying,
		isPinned,
		type,
		imgSrc,
		text,
		id,
		order,
		addNewContract,
		onBuy,
		onCancel,
		chat,
		horseData,
		playlist,
		setActivePanel,
		raceId,
		objktId,
		routeRoom,
		subtype,
		unpinGif,
		unpinImage,
		unpinText,
		unpinObjkt,
		unpinWallet,
		pinBackground,
		unpinBackground,
		address,
		domain,
		userProfile,
		unpinMessage,
		senderAddress,
		setModalState,
		setPreparedMessage,
		isWidget
	} = props;
	const location = useLocation();
	const [isHovering, setIsHovering] = useState(false);
	const [objkt, setobjkt] = useState();
	const [sells, setSells] = useState(0);
	const [revenue, setRevenue] = useState(0);

	const [sellSound] = useState(new Audio("https://www.mboxdrive.com/success.mp3"));
	const [forSale, setForSale] = useState(0);
	const [sId, setSId] = useState(0);
	const [sPrice, setSPrice] = useState(0);

	const [size, setSize] = useState(0);
	const [highlight, setHighlight] = useState(false);
	const classes = useStyles();

	const { socket } = useContext(AppStateContext);
	const firebaseContext = useContext(FirebaseContext);

	let activeAddress = activeAccount ? activeAccount.address : "";
	let leftRoom, rightRoom, topRoom, bottomRoom;
	let x, y;

	function isDropable(holding){
		//console.log("holding " + holding + " reporting " + type);
		if(holding != "trash" && holding != "gate"  && type === "trash" ){
			return true;
		}
		else if((holding === "image" || holding === "gif" ) && (type === "bgHolder" || type === "minter") ){
			return true;
		}
		else if((holding === "objkt" || holding === "objktStat" ||holding === "text" || holding === "image" || holding === "gif" || holding === "wallet") && type === "wallet" ){
			return true;
		}
		else
			return false;
	}

	const [{ isOver, canDrop }, drop] = useDrop({
		accept: 'item',
		drop(item: IPinnedItem, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
			if(type === "trash"){
				switch (item.itemType){
					case "image": 
						unpinImage(item.id);
					break;
					case "gif": 
						unpinGif(item.id);
					break;
					case "objkt": 
						unpinObjkt(item.id);
					break;
					case 'objktStat': 
						unpinObjkt(item.id);
					break;
					case "text": 
						unpinText(item.id);
					break;
					case "bgHolder": 
						unpinBackground();
					break;
					case "wallet":
						unpinWallet(item.id);
					break;
					case "message":
						unpinMessage(item.id);
					break;

					case "chat":
						let x;
						let y;
						let room;
						if(location.pathname.length != 1){
							x = location.pathname.split("/")[2].split(",")[0];
							y = location.pathname.split("/")[2].split(",")[1];
						}
						if(y){
							room = x + "," + y;
						}
						else if(x)
							room = x;
						else
							room = "0,0";
						console.log ("room "+ room) 
						firebaseContext.deleteChat(room);
						socket.emit('event', {
							key: 'chat-clear'
						});
					break;
				}
				return undefined;
			}
			else if(type === "bgHolder"){
				if(item.itemType === "image"){
					pinBackground(item.imgSrc);
					unpinImage(item.id);
				}
				else if(item.itemType === "gif"){
					pinBackground("https://i.giphy.com/media/" + item.data.id + "/giphy.webp");
					unpinGif(item.id);
				}
			}
			else if(type === "minter"){
				setModalState("mint-objkt")
			}
			else if(type === "wallet"){
				if(item.itemType === "objkt" || item.itemType === "objktStat"){
					setModalState("send-message")
					const newMessage: IBoardMessage = {
						top: y,
						left: x,
						key: uuidv4(),
						objktId: item.objktId,
						isPinned: true,
						senderAddress: activeAccount ? activeAccount.address : null,
						receiverAddress: address,
						isWidget: (item.itemType === "objktStat")
					};
					setPreparedMessage(newMessage);
					//add from firebase 
					/*firebaseContext.pinRoomItem(address, {
						...newMessage,
						type: 'message',
						left: Math.random() * 0.8,
						top: Math.random() * 0.8,
					});*/
					transfer(item.objktId, activeAddress, address);

				}
				else if(item.itemType === "text"){
					const timestamp = new Date().getTime().toString();
					firebaseContext.addtoChat(address,
						item.text,
						userProfile.avatar,
						userProfile.name,
						timestamp,
						activeAddress ? activeAddress : ""
					);
					socket.emit('event', {
						key: 'chat-dnd',
						value: item.text,
						avatar: userProfile.avatar,
						name: userProfile.name,
						author: activeAddress ? activeAddress : "",
						recRoom: address
					});
					unpinText(item.id);

				}
				else if(item.itemType === "image"){
					console.log("send " + item.imgSrc  + " to " + address );
					
					//create message board object
					setModalState("send-message")
					const newMessage: IBoardMessage = {
						top: y,
						left: x,
						key: uuidv4(),
						imgSrc: item.imgSrc,
						isPinned: true,
						senderAddress: activeAccount ? activeAccount.address : null,
						receiverAddress: address
					};

					setPreparedMessage(newMessage);
			
					//add socketing
					//add messaging
					//add room fetch
					//pop up
				}
				else if(item.itemType === "gif"){
					setModalState("send-message");
					const newMessage: IBoardMessage = {
						top: y,
						left: x,
						key: uuidv4(),
						data: item.data,
						isPinned: true,
						senderAddress: activeAccount ? activeAccount.address : null,
						receiverAddress: address

					};

					setPreparedMessage(newMessage);

				}
				else if(item.itemType === "wallet"){
					setModalState("send-message");
					const newMessage: IBoardMessage = {
						top: y,
						left: x,
						key: uuidv4(),
						address: item.address,
						domain: item.domain,
						isPinned: true,
						senderAddress: activeAccount ? activeAccount.address : null,
						receiverAddress: address
					};
					setPreparedMessage(newMessage);
				}
			}

		},
		canDrop: (item: IPinnedItem) => isDropable(item.itemType),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop()
		  })
	});
	if(location.pathname.length != 1){
		x = parseInt(location.pathname.split("/")[2].split(",")[0]);
		y = parseInt(location.pathname.split("/")[2].split(",")[1]);
	}
	else{
		x = 0;
		y = 0;
	}
	leftRoom = (x-1)+ "," + y;
	rightRoom= (x+1) + "," + y;
	topRoom = x + "," + (y+1);
	bottomRoom = x + "," + (y-1);


	async function fetchObjkt(id) {

		const { errors, data } = await fetchGraphQL(query_objkt, 'objkt', {
			id: id
		})
		if (errors) {
			//console.error(errors)
		}
		if(data){
			const result = data.hic_et_nunc_token_by_pk
			console.log(result)

			return result
		}

	}

	async function fetchGraphQL(operationsDoc, operationName, variables) {
		let result = await fetch('https://hdapi.teztools.io/v1/graphql', {
			method: 'POST',
			body: JSON.stringify({
				query: operationsDoc,
				variables: variables,
				operationName: operationName,
			}),
		})

		var ress = await result.json();
		return ress;
	}  

	async function collect( swapId, amount ) {

        return await Tezos.wallet
        .at(v2)
        .then((c) =>
          c.methods
            .collect(parseFloat(swapId))
            .send({
              amount: parseFloat(amount),
              mutez: true,
              storageLimit: 350,
            })
        )
        .catch((e) => e)
      }

	async function transfer(tokenID, sender, recipient  ) {
		console.log("transfer")
		const contract = await Tezos.wallet.at(
			"KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" 
		  );
		  
		  //const TOKEN_ID = 449081; // FA2 token id
		  //const recipient = "tz2DNkXjYmJwtYceizo3LwNVrqfrguWoqmBE"; // Send to ourself
		  
		  // Call a method on the contract. In this case, we use the transfer entrypoint.
		  // Taquito will automatically check if the entrypoint exists and if we call it with the right parameters.
		  // In this case the parameters are [from, to, amount].
		  // This will prepare the contract call and send the request to the connected wallet.
		  const result = await contract.methods
			.transfer([
			  {
				from_: sender,
				txs: [
				  {
					to_: recipient,
					token_id: tokenID,
					amount: 1,
				  },
				],
			  },
			])
			.send();
		  console.log(result);
      }

	useEffect(() => {
		if (objktId) {

			async function fetchMyAPI() {

				let temp = await fetchObjkt(objktId);
				let tempForSale = 0;
				if(temp){				
					temp.trades.reverse();
					setobjkt(temp);

                    let swaps = temp.swaps.filter(e => parseInt(e.contract_version) === 2 && parseInt(e.status) === 0 && e.is_valid)
                    let s = _.minBy(swaps, (o) => Number(o.price))

                    if(s){
                        setSId(s.id);
                        setSPrice(s.price);
                    }


                    setobjkt(temp);
                    for (let i = 0; i < temp.swaps.length; i++) {
                        if(temp.swaps[i].status === 0){
                            tempForSale = tempForSale + temp.swaps[i].amount_left;
                        }
                    }
                    setForSale(tempForSale);
                    

						let sellCount = 0;
						let objktRevenue = 0;

						for (let i = 0; i < temp.trades.length; i++) {
							sellCount = sellCount + 1;
							objktRevenue = objktRevenue + temp.trades[i].swap.price;
						}

						setSells(sellCount);
						setRevenue(objktRevenue / 1000000);
					
					
				}

			}
			fetchMyAPI()
		}
	}, [])

	useEffect(() => {
		if (objktId) {

			async function fetchMyAPI() {

				let temp = await fetchObjkt(objktId);
				let tempForSale = 0;
				if(temp){				
					temp.trades.reverse();
					setobjkt(temp);

                    let swaps = temp.swaps.filter(e => parseInt(e.contract_version) === 2 && parseInt(e.status) === 0 && e.is_valid)
                    let s = _.minBy(swaps, (o) => Number(o.price))

                    if(s){
                        setSId(s.id);
                        setSPrice(s.price);
                    }


                    setobjkt(temp);
                    for (let i = 0; i < temp.swaps.length; i++) {
                        if(temp.swaps[i].status === 0){
                            tempForSale = tempForSale + temp.swaps[i].amount_left;
                        }
                    }
                    setForSale(tempForSale);
                    
						let sellCount = 0;
						let objktRevenue = 0;

						for (let i = 0; i < temp.trades.length; i++) {
							sellCount = sellCount + 1;
							objktRevenue = objktRevenue + temp.trades[i].swap.price;
						}

						setSells(sellCount);
						setRevenue(objktRevenue / 1000000);
					
					
				}

			}
			fetchMyAPI()
		}

	}, [])

	useEffect(() => {
		if (objktId) {
			const interval = setInterval(async () => {
				let sellCount = 0;

				let temp = await fetchObjkt(objktId);
				if(temp && temp.trades)
					temp.trades.reverse();
				if (objkt) {
					for (let i = 0; i < objkt!.trades.length; i++) {
						sellCount = sellCount + 1;
					}
					if ((sellCount !== sells && sells != 0)) {
						activateFireworks();
						sellSound.play();
						setobjkt(temp);
					}

					if (objkt && (objkt.token_holders.length !== temp.token_holders.length)) {
						activateFireworks();
						setobjkt(temp);
						sellSound.play();
					}
				}

			}, 60000);
			return () => clearInterval(interval);
		}
	}, [objkt, sells, sellSound])


	const [{ isDragging }, drag, preview] = useDrag({
		item: { id, left, top, itemType: type, type: 'item', imgSrc, data, objktId, text, address, domain },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		})
	});

	/*if (isDragging) {
		return <div ref={preview} />;
	}*/

	const noLinkPrev = (
		<div className={classes.text} style={{ width: 180 }}>
			{text}
		</div>
	);

	const shouldShowMoveButton =
		isPinned || type === 'chat' || type === 'musicPlayer';

	return (
		<div
			style={{
				top,
				left,
				/* zIndex: isHovering ? 99999999 : 'auto' */
				zIndex: (isHovering || type === 'chat' || type === 'gate'  || type === 'trash' || type === 'minter' || type === 'bgHolder' ) ? 99999999 : 99999998
			}}
			className={classes.container}
			ref={drag}
		>
			{!isDragging &&  <Paper
				elevation={0}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onTouchStart={() => setIsHovering(true)}
				onTouchEnd={() => setIsHovering(false)}
			>
				{type === 'gif' && data && <Gif gif={data}  width={180} noLink={true} />}
				{type === 'image' && imgSrc && (
					
						<img alt="user-selected-img" src={imgSrc} style={{ width: 180, height: '100%' }} />
					
				)}
				{type === 'text' && text && (
					<div className={classes.text} style={{ width: 200 , border: '1px dashed black'}}>
						<div>
							{text && (
								<LinkPreview
									url={text!}
									fallback={noLinkPrev}
									descriptionLength={50}
									imageHeight={100}
									showLoader={false}
								/>
							)}
						</div>
					</div>
				)}
				{type === 'NFT' && order && (
					<Order
						onBuy={() => (onBuy ? onBuy(id) : undefined)}
						onCancel={() => (onCancel ? onCancel(id) : undefined)}
						addNewContract={addNewContract}
						order={order}
					/>
				)}
				{type === 'map' && data && <Map />}
				{type === 'tweet' && id && <Tweet tweetId={id} />}
				{type === 'video' && id && (
					<div
						className="pinned-video-player"
						style={{
							height: '225px',
							width: '400px'
						}}
					>
						<ReactPlayer
							width="100%"
							height="100%"
							url={`https://www.youtube.com/watch/${id}`}
							controls={true}
							playing={isPinnedPlaying}
							onPlay={() => {
								socket.emit('event', {
									key: 'youtube',
									value: id,
									playPin: true
								});
							}}
							onPause={() => {
								socket.emit('event', {
									key: 'youtube',
									value: id,
									playPin: false
								});
							}}
						/>
					</div>
				)}
				{type === 'horse' && horseData && <Horse horse={horseData} />}
				{type === 'chat' && chat && setActivePanel && (
					<WaterfallChat
						setActivePanel={setActivePanel}
						chat={chat}
						routeRoom={routeRoom}
					/>
				)}
				{type === 'musicPlayer' && playlist && setActivePanel &&
					<div style={{ width: 320 }} onClick={(e) => { e.stopPropagation(); setActivePanel('music'); }} >
						<MusicPlayer playlist={playlist} />
					</div>
				}
				{type === 'race' && (
					<div style={{ width: 400, height: 225 }}>
						<iframe
							src={`https://3d-racing.zed.run/live/${raceId}`}
							width="100%"
							height="100%"
							title="zed racing"
							style={{ pointerEvents: 'auto' }}
						/>
					</div>
				)}
				{type === 'objktStat' && size === 0 && objkt && (
					<div style={{  maxHeight:400, padding: 10, overflowY: 'auto',  backgroundColor: "white" , border: '1px dashed black'}}>
						<div style={{ border: '4px dashed black', alignItems: "center"}}>
						        <iframe
									scrolling="no"
									width="307" 
									height="307"
									title="html-embed"
									src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
									sandbox="allow-scripts allow-same-origin"
									allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"

									/>
						</div>
					</div>
				)}
				{type === 'objkt' && size === 0 && (
					<div style={{ width: 340, backgroundColor: "white" , border: '1px dashed black'}}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: "black", textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: "black", textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.xyz/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: "black", textAlign: "right"}}>  <Button className={classes.buttonGateBottom} title={"size"} onClick={() => { setSize(1) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
						{ objkt && objkt.mime === "application/x-directory" && 
								<div style={{  maxHeight:400, padding: 10, overflowY: 'auto',  backgroundColor: "white" , border: '1px dashed black'}}>
								<div style={{ border: '4px dashed black', alignItems: "center"}}>
										<iframe
											scrolling="no"
											width="307" 
											height="307"
											title="html-embed"
											src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
											sandbox="allow-scripts allow-same-origin"
											allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
		
											/>
								</div>
							</div>
							}
						{ objkt && (objkt.mime != "video/mp4" && objkt.mime != "application/x-directory" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width="340"  height="100%" ></img>
						}
                        <div style={{ color: "white", pointerEvents: "auto", textAlign: "center" }}>
                            {sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez BUY</Button>}
                            {sId === 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>Not Available</Button>}

                        </div>
					</div>
				)
				}
				{type === 'objkt' && size === 1 && (
					<div style={{ width: 340, maxHeight:400, overflowY: 'auto',  backgroundColor: "white" , border: '1px dashed black'}}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: "black", textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: "black", textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.xyz/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: "black", textAlign: "right"}}>  <Button className={classes.buttonBuy} title={"size"} onClick={() => { setSize(0) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
							{ objkt && objkt.mime === "application/x-directory" && 
								<div style={{  maxHeight:400, padding: 10, overflowY: 'auto',  backgroundColor: "white" , border: '1px dashed black'}}>
								<div style={{ border: '4px dashed black', alignItems: "center"}}>
										<iframe
											scrolling="no"
											width="307" 
											height="307"
											title="html-embed"
											src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
											sandbox="allow-scripts allow-popups allow-same-origin"
											allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
		
											/>
								</div>
							</div>
							}
						{ objkt && (objkt.mime != "video/mp4" && objkt.mime != "application/x-directory" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width="340"  height="100%" ></img>
						}

						{objkt && !isWidget &&
								<div style={{ color: "blue", pointerEvents: "auto", textAlign: "center" }}>
									{sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez BUY</Button>}
                            		{sId === 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>Not Available</Button>}

									<div>Total Sell Count: {sells}</div>
									<div>Total Revenue: {revenue}</div>
									<div>Token Holders: {objkt.token_holders.length}</div>

                                    <br></br>
									{objkt.trades.map((trade) => (
										<>
											{(activeAddress && (trade.seller.address === activeAddress || trade.buyer.address === activeAddress)) ?
												<div style={{ paddingLeft: 1, textAlign: "left", color: "green" }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
													<div style={{  display:"flex", alignText: "center", paddingInline:6}}> 
														<div style={{ textAlign: "left"}}>{trade.timestamp.slice(2, 10)}</div>
														<div style={{ textAlign: "center", margin:"auto" }}>{trade.amount} ed.</div>
														<div style={{ textAlign: "right"}}>{trade.swap.price / 1000000} tez</div>
													</div>
												</div>
												:
												<div style={{ paddingLeft: 1, textAlign: "left", color: "blue",  border: '1px dashed black' }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
													<div style={{  display:"flex", alignText: "center", paddingInline:6}}> 
														<div style={{ textAlign: "left"}}>{trade.timestamp.slice(2, 10)}</div>
														<div style={{ textAlign: "center", margin:"auto" }}>{trade.amount} ed.</div>
														<div style={{ textAlign: "right"}}>{trade.swap.price / 1000000} tez</div>
													</div>
												</div>}</>
									))}
									minted {objkt.timestamp} {objkt.supply} ed. {objkt.royalties / 10}% royalties
								</div>

							}
							
					</div>
				)}

				{type === 'message' && ((imgSrc && (

							<div style={{ width: 180, padding: 5 }}> 					 	 <div style={{  alignItems: "center" }}> 

							<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
								{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
							</Button>
							
							{text}  
						</div>
							<img alt="user-selected-img" src={imgSrc} style={{ width: 180, height: '100%' }} />
							</div>
						))
					|| address &&
					<div style={{ width: 180, padding: 5 }}> 					 	 <div style={{ alignItems: "center" }}> 
					<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
					{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
					</Button>
					 {text}  
				</div>
					<div style = {{ border: '3px dashed black', height: 80, backgroundColor: ((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : "white" ), color: "black", textAlign: "center", fontSize: 20}}> 
						Send to<br></br> ------- <br></br> 
							<Button className={classes.text} onClick={() => { routeRoom(address) }}>
								{domain ? domain : (address.slice(0, 6) + "..." + address.slice(32, 36))}
							</Button> 
					</div>
					 </div>
					|| data &&
					<div style={{ width: 180, padding: 5 }}>					 	 <div style={{ alignItems: "center" }}> 
					<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
					{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
					</Button>
					 {text}  
				</div>
					 <Gif gif={data}  width={180} noLink={true} />
					 </div>

					||objkt &&  objktId && isWidget &&
						<div style={{  maxHeight:400, padding: 10, overflowY: 'auto',  backgroundColor: "white" , border: '1px dashed black'}}>
							<div style={{ alignItems: "center" }}>   
							<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
							{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
							</Button>
							 {text}  
						</div>
							<div style={{ border: '4px dashed black', alignItems: "center"}}>
								<iframe
									scrolling="no"
									width="307" 
									height="307"
									title="html-embed"
									src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
									sandbox="allow-scripts allow-same-origin"
									allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"

											/>
								</div>
						</div>


					 || objkt &&  objktId && !isWidget &&

					 <div style={{ width: 340, padding: 5 }}> 
					 	 <div style={{ alignItems: "center" }}>   
							<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
							{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
							</Button>
							 {text}  
						</div>
					 { size === 0 && (
					<div style={{ width: 340, backgroundColor: "white" , border: '1px dashed black'}}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: "black", textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: "black", textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.xyz/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: "black", textAlign: "right"}}>  <Button className={classes.buttonGateBottom} title={"size"} onClick={() => { setSize(1) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
						{ objkt && (objkt.mime != "video/mp4" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width="340"  height="100%" ></img>
						}


                        <div style={{ color: "white", pointerEvents: "auto", textAlign: "center" }}>
                            {sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez BUY</Button>}
                            {sId === 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>Not Available</Button>}

                        </div>
					</div>
				)}
				{ size === 1 && (
					<div style={{ width: 340, maxHeight:400, overflowY: 'auto',  backgroundColor: "white" , border: '1px dashed black'}}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: "black", textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: "black", textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.xyz/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: "black", textAlign: "right"}}>  <Button className={classes.buttonBuy} title={"size"} onClick={() => { setSize(0) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
						{ objkt && (objkt.mime != "video/mp4" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width="340"  height="100%" ></img>
						}

						{objkt &&
								<div style={{ color: "blue", pointerEvents: "auto", textAlign: "center" }}>
									{sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez BUY</Button>}
                            		{sId === 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>Not Available</Button>}

									<div>Total Sell Count: {sells}</div>
									<div>Total Revenue: {revenue}</div>
									<div>Token Holders: {objkt.token_holders.length}</div>

                                    <br></br>
									{objkt.trades.map((trade) => (
										<>
											{(activeAddress && (trade.seller.address === activeAddress || trade.buyer.address === activeAddress)) ?
												<div style={{ paddingLeft: 1, textAlign: "left", color: "green" }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
													<div style={{  display:"flex", alignText: "center", paddingInline:6}}> 
														<div style={{ textAlign: "left"}}>{trade.timestamp.slice(2, 10)}</div>
														<div style={{ textAlign: "center", margin:"auto" }}>{trade.amount} ed.</div>
														<div style={{ textAlign: "right"}}>{trade.swap.price / 1000000} tez</div>
													</div>
												</div>
												:
												<div style={{ paddingLeft: 1, textAlign: "left", color: "blue",  border: '1px dashed black' }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.xyz/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
													<div style={{  display:"flex", alignText: "center", paddingInline:6}}> 
														<div style={{ textAlign: "left"}}>{trade.timestamp.slice(2, 10)}</div>
														<div style={{ textAlign: "center", margin:"auto" }}>{trade.amount} ed.</div>
														<div style={{ textAlign: "right"}}>{trade.swap.price / 1000000} tez</div>
													</div>
												</div>}</>
									))}
									minted {objkt.timestamp} {objkt.supply} ed. {objkt.royalties / 10}% royalties
								</div>

							}
					</div>
				)}

					 </div>
					 
					 )
				}
				
				{type === 'gate' && subtype === 'top' && y != 2 &&(
					<Button className={classes.buttonGate} onClick={() => { routeRoom(topRoom) }}>^</Button>
				)}
				{type === 'gate' && subtype === 'left' && x != -2 &&(
					<Button className={classes.buttonGate} onClick={() => { routeRoom(leftRoom) }}>{"<"}</Button>
				)}
				{type === 'gate' && subtype === 'bottom' && y != -2 &&(
					<Button className={classes.buttonGateBottom} onClick={() => { routeRoom(bottomRoom) }}>^</Button>
				)}
				{type === 'gate' && subtype === 'right' && x != 2 &&(
					<Button className={classes.buttonGate} onClick={() => { routeRoom(rightRoom) }}>{">"}</Button>
				)}
				{type === 'trash' && <div ref={drop} style = {{ border: '3px dashed black', width:100, height: 30, backgroundColor: ((!isOver && canDrop)? "LightCoral" : (isOver && canDrop) ? "red" : "white" ), color: "black", textAlign: "center", fontSize: 20}}> Remove  </div>}
				{type === 'minter' && <div ref={drop} style = {{ border: '3px dashed black', width:100, height: 30, backgroundColor: ((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : "white" ), color: "black", textAlign: "center", fontSize: 20}}> Minter  </div>}
				{type === 'bgHolder' && <div ref={drop} style = {{ border: '3px dashed black', width:180, height: 30, backgroundColor:((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : "white" ), color: "black", textAlign: "center", fontSize: 20}}> Background </div>}
				{type === 'wallet' && <div ref={drop} style = {{ border: '3px dashed black', height: 80, backgroundColor: ((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : "white" ), color: "black", textAlign: "center", fontSize: 20}}> 
				 Send to<br></br> ------- <br></br> 
				 	<Button className={classes.text} onClick={() => { routeRoom(address) }}>
						  {domain ? domain : (address.slice(0, 6) + "..." + address.slice(32, 36))}
					</Button> 
				 </div>}
			
			</Paper>}

			
		</div>
	);
};

/*
					<Button className={classes.buttonGate} onClick={() => {
						transfer();

					 }}>{">"}</Button>
*/
const activateFireworks = () => {
	let duration = 2 * 1000;
	let animationEnd = Date.now() + duration;
	let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	let interval: NodeJS.Timeout = setInterval(function () {
		let timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		let particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
			})
		);
		fireworkSound.play();
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
			})
		);
	}, 250);
};

const query_objkt = `
query objkt($id: bigint!) {
  hic_et_nunc_token_by_pk(id: $id) {
id
mime
timestamp
display_uri
description
artifact_uri
metadata
creator {
  address
  name
}
thumbnail_uri
title
supply
royalties
swaps {
  amount
  amount_left
  id
  price
  timestamp
  creator {
    address
    name
  }
  contract_version
  status
  royalties
  creator_id
  is_valid
}
token_holders(where: {quantity: {_gt: "0"}}) {
  holder_id
  quantity
  holder {
    name
  }
}
token_tags {
  tag {
    tag
  }
}
trades(order_by: {timestamp: asc}) {
  amount
  swap {
    price
  }
  seller {
    address
    name
  }
  buyer {
    address
    name
  }
  timestamp
}
}
}
`
const fireworkSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6963");

function randomInRange(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

// converts an ipfs hash to ipfs url
const HashToURL = (hash, type) => {
	// when on preview the hash might be undefined.
	// its safe to return empty string as whatever called HashToURL is not going to be used
	// artifactUri or displayUri
	if (hash == undefined) {
	  return ''
	}
  
	switch (type) {
	  case 'HIC':
		return hash.replace('ipfs://', 'https://pinata.hicetnunc.xyz/ipfs/')
	  case 'CLOUDFLARE':
		return hash.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
	  case 'PINATA':
		return hash.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
	  case 'IPFS':
		return hash.replace('ipfs://', 'https://ipfs.io/ipfs/')
	  case 'INFURA':
		try {
		var cidv1 = new ipfsClient.CID(hash.replace('ipfs://', '')).toV1()
		var subdomain = cidv1.toBaseEncodedString('base32')
		return `https://${subdomain}.ipfs.infura-ipfs.io/`
	  } catch (err) {
		return undefined
	  }
	  case 'DWEB':
		return hash.replace('ipfs://', 'http://dweb.link/ipfs/')
	  default:
		console.error('please specify type')
		return hash
	}
  }
