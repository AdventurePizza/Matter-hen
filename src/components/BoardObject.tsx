// @ts-nocheck
import { MoveButton, PinButton } from './shablack/PinButton';
import React, { useState, useContext, useEffect } from 'react';

import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { Paper, Button, Box } from '@material-ui/core';
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
	IBoardMessage,
	IChecklist,
	ITrail,
	IMonster,
	ISkin
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
import { Resizable, ResizableBox } from 'react-resizable';
import { Height } from '@material-ui/icons';
import boxBlank from '../assets/buttons/box_blank.png'
import boxCheck from '../assets/buttons/box_check.png'

import catIdle from '../assets/buttons/catIdle.gif'
import catIdle2 from '../assets/buttons/catIdle2.gif'
import catIdle3 from '../assets/buttons/catIdle3.gif'
import catIdle4 from '../assets/buttons/catIdle4.gif'
import catIdle5 from '../assets/buttons/catIdle5.gif'
import catWalk from '../assets/buttons/catWalk.gif'
import catWalk2 from '../assets/buttons/catWalk2.gif'
import catPoke1 from '../assets/buttons/catPoke1.gif'
import catPoke2 from '../assets/buttons/catPoke2.gif'
import catPoke3 from '../assets/buttons/catPoke3.gif'

import foxIdle from '../assets/buttons/foxIdle.gif'
import foxIdle2 from '../assets/buttons/foxIdle2.gif'
import foxIdle3 from '../assets/buttons/foxIdle3.gif'
import foxPoke from '../assets/buttons/foxPoke.gif'
import foxPoke2 from '../assets/buttons/foxPoke2.gif'
import foxWalk from '../assets/buttons/foxWalk.gif'
import foxWalk2 from '../assets/buttons/foxWalk2.gif'

import HedgehogIdle from '../assets/buttons/HedgehogIdle.gif'
import HedgehogIdle2 from '../assets/buttons/HedgehogIdle2.gif'
import HedgehogPoke from '../assets/buttons/HedgehogPoke.gif'
import HedgehogWalk from '../assets/buttons/HedgehogWalk.gif'

import dungeon from '../assets/dungeon.png'
const _ = require("lodash"); 
const Tezos = new TezosToolkit('https://mainnet.api.tez.ie')
const wallet = new BeaconWallet({
  name: 'hicetnunc.xyz',
  preferblackNetwork: 'mainnet',
})
Tezos.setWalletProvider(wallet)
const  v2 = 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn';


interface BoardObjectProps {
	id: string;
	initWidth?: number;
	initHeight?: number;
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
	| 'checklist'
	| 'pet'
	| 'trail'
	| 'player'
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

	checklist?: IChecklist;
	setChecklist?: (checklist: IChecklist) => void;
	hide?: boolean;
	targetX?: number;
	targetY?: number;
	petPoked?: ()=>void;
	updateIsTyping?: (isTyping: boolean) => void;
	sendMessage?: (message: string) => void;
	trail?: ITrail;
	//player?: IPlayer;
	//setPlayer?: (player: IPlayer) => void;
	currentSkin?:ISkin;
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
		isWidget,
		initWidth,
		initHeight,
		checklist,
		setChecklist,
		hide,
		targetX,
		targetY,
		petPoked,
		updateIsTyping,
		sendMessage,
		trail,
		currentSkin
		//player,
		//setPlayer
	} = props;
	const location = useLocation();
	const [width, setWidth] = useState(initWidth);
	const [height, setHeight] = useState(initHeight);
	const [isHovering, setIsHovering] = useState(false);
	const [objkt, setobjkt] = useState();
	const [sells, setSells] = useState(0);
	const [revenue, setRevenue] = useState(0);

	//const [sellSound] = useState(new Audio("https://www.mboxdrive.com/success.mp3"));
	const [forSale, setForSale] = useState(0);
	const [sId, setSId] = useState(0);
	const [sPrice, setSPrice] = useState(0);

	const [size, setSize] = useState(0);
	const [highlight, setHighlight] = useState(false);

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
			flexDirection: 'column',
		},
		text: {
			padding: 5,
			display: 'flex',
			justifyContent: 'center',
			whiteSpace: 'pre-line', //allows it to display multiple lines!,
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.fontFamily,
		},
		button: {
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.fontFamily,
			fontSize: 12
		},

		buttonLarge: {
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.fontFamily,
			fontSize: 18
		},

		buttonBuy: {
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.fontFamily,
			fontSize: 20
		},

		buttonSize: {
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.fontFamily,
			fontSize: 10
		},

		buttonGate: {
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.fontFamily,
			fontSize: 20,
		},
		buttonGateBottom: {
			color: currentSkin?.color,
			backgroundColor: currentSkin?.backgroundColor,
			fontFamily: currentSkin?.backgroundColor,
			fontSize: 20,
			transform: "rotate(180deg)"
		},
		pet: {
			width:100,  
			height:"auto",
		},
		petFlipped: {
			width:100,  
			height:"auto",
			transform: "rotateY(180deg)"
		}
	});
	const classes = useStyles();

	const { socket } = useContext(AppStateContext);
	const firebaseContext = useContext(FirebaseContext);

	const [petTop, setPetTop] = useState(top);
	const [petLeft, setPetLeft] = useState(left);
	const [petIdle, setPetIdle] = useState(true);
	const [petTargetX, setPetTargetX] = useState(0);
	const [petTargetY, setPetTargetY] = useState(0);
	const [petImage, setPetImage] = useState( subtype === "cat" ? catIdle : (foxIdle ? foxIdle: HedgehogIdle));
	const [petFacingRight, setPetFacingRight] = useState(true);
	const [isFighting, setIsFighting] = useState(false);

	//const [monster, setMonster] = useState<IMonster>();
	//const [playerImage, setPlayerImage] = useState( foxIdle);
	//const [monsterImage, setMonsterImage] = useState( HedgehogPoke);

	let activeAddress = activeAccount ? activeAccount.address : "";
	let leftRoom, rightRoom, topRoom, bottomRoom;
	let x, y;


	function randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}
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

	function markChecklist (index){
		if(checklist){
			let items = checklist.items;
			items[index].condition = true;
			setChecklist({...checklist, items })
		}
	}

	const [{ isOver, canDrop }, drop] = useDrop({
		accept: 'item',
		drop(item: IPinnedItem, monitor) {
			const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;

			if(type === "trash"){
				
				switch (item.itemType){
					case "image": 
						unpinImage(item.id);
						markChecklist(4);
					break;
					case "gif": 
						unpinGif(item.id);
						markChecklist(4);
					break;
					case "objkt": 
						unpinObjkt(item.id);
						markChecklist(4);
					break;
					case 'objktStat': 
						unpinObjkt(item.id);
						markChecklist(4);
					break;
					case "text": 
						unpinText(item.id);
						markChecklist(4);
					break;
					case "bgHolder": 
						unpinBackground();
						markChecklist(6);
					break;
					case "wallet":
						unpinWallet(item.id);
						markChecklist(4);
					break;
					case "message":
						unpinMessage(item.id);
						markChecklist(4);
					break;

					case "chat":
						let x;
						let y;
						let room;
						if(location.pathname.length != 1){
							x = location.pathname.split("/")[2].split(",")[0];
							y = location.pathname.split("/")[2].split(",")[1];
						}

						else{
							x = 0;
							y = 0;
						}
						if(y){
							room = x + "," + y;
						}
						else if(x)
							room = x;
						else
							room = "0,0";
						firebaseContext.deleteChat(room);
						socket.emit('event', {
							key: 'chat-clear'
						});
						markChecklist(9);
					break;
				}
				return undefined;
			}
			else if(type === "bgHolder"){
				markChecklist(5);
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
						isWidget: (item.itemType === "objktStat"),
						width: item.width,
						height: (item.itemType === "objktStat") ? item.height + 70 : item.height + 40
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
					//create message board object
					setModalState("send-message")
					const newMessage: IBoardMessage = {
						top: y,
						left: x,
						key: uuidv4(),
						imgSrc: item.imgSrc,
						isPinned: true,
						senderAddress: activeAccount ? activeAccount.address : null,
						receiverAddress: address,
						width: item.width,
						height: item.height + 30
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
						receiverAddress: address,
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

	/*const delay = ms => new Promise(res => setTimeout(res, ms));
	async function enterDungeon() {

		
		let x;
		let y;
		let room;
		if(location.pathname.length != 1){
			x = location.pathname.split("/")[2].split(",")[0];
			y = location.pathname.split("/")[2].split(",")[1];
		}
		else{
			room = "0,0";
		}
		if(y){
			room = x + "," + y;
		}
		else if(x)
			room = x;
		else
			room = "0,0";
		//console.log ("room "+ room + " palyer " + player.objktId); 
		//sentPlayerStats&getEnemyStats(roomId) (server calcualtes results and records it on firebase, then sents enemy stat for visualising fight)
		const {
				isSuccessful,
				monsterData
			} = await firebaseContext.enterDungeon(room || '0,0', player.objktId);
		console.log("monsterData ")
		console.log(monsterData)
		//init Enemy
		const mons: IMonster = {
			hitpoint: monsterData.hitpoint,
			attack: monsterData.attack
		};
		setMonster(mons);
		console.log(monster);
		let i = 0;
		while(player.hitpoint > 0 && monster.hitpoint > 0 && i< 10){
			let newPhp = 5;
			let newMhp = 3;
			setPlayer((player) => ({ ...player, hitpoint: 3}));
			setMonster((monster) => ({ ...monster, hitpoint: 5}));
			console.log(player);
			console.log(monster);
			i++;
			await delay(5000);
    		//player.hitpoint = player.hitpoint - monster.attack;
    		//monster.hitpoint = monster.hitpoint - player.attack;
    	}

		setIsFighting(true);
		setPlayerImage(foxPoke);

		//div prints fight anims
		//each x seconds hps drops
		//show win or lose state



      }*/

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
		if (objktId && objkt) {

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

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	  }


	function poke(){
		setPetIdle(true);
		petPoked();
		if(subtype === "cat"){
			switch(getRandomInt(3)) {
				case 0:
					setPetImage(catPoke1);
				break;
				case 1:
					setPetImage(catPoke2);
				break;
				case 2:
					setPetImage(catPoke3);
				break;
			}
/*
			let x;
			let y;
			let room;
			if(location.pathname.length != 1){
				x = location.pathname.split("/")[2].split(",")[0];
				y = location.pathname.split("/")[2].split(",")[1];
			}
			else{
				room = "0,0";
			}
			if(y){
				room = x + "," + y;
			}
			else if(x)
				room = x;
			else
				room = "0,0";
			console.log ("room "+ room) 

			const timestamp = new Date().getTime().toString();
			firebaseContext.addtoChat(room,
				"nyaa",
				"catIdle",
				"cat",
				timestamp,
				""
			);
			socket.emit('event', {
				key: 'chat-dnd',
				value: "nyaa",
				avatar: "catIdle",
				name: "cat",
				author: "",
				recRoom: room
			});*/
		}
		else if (subtype === "fox") {
			switch(getRandomInt(2)) {
				case 0:
					setPetImage(foxPoke);
				break;
				case 1:
					setPetImage(foxPoke2);
				break;
			}
		}
		else if (subtype === "hedgehog") {
			setPetImage(HedgehogPoke);
		}
		setTimeout(setIdleImage, 2000);

	}

	function setWalkImage() {
		if(subtype === "cat"){
			switch(getRandomInt(2)) {
				case 0:
					setPetImage(catWalk);
				break;
				case 1:
					setPetImage(catWalk2);
				break;
			}
		}
		else if(subtype === "fox"){
			switch(getRandomInt(2)) {
				case 0:
					setPetImage(foxWalk);
				break;
				case 1:
					setPetImage(foxWalk2);
				break;
			}
		}
		else if (subtype === "hedgehog") {
			setPetImage(HedgehogWalk);
		}
	}

	function setIdleImage() {
		setPetIdle(true);
		if(subtype === "cat"){
			switch(getRandomInt(5)) {
				case 0:
					setPetImage(catIdle);
				break;
				case 1:
					setPetImage(catIdle2);
				break;
				case 2:
					setPetImage(catIdle3);
				break;
				case 3:
					setPetImage(catIdle4);
				break;
				case 4:
					setPetImage(catIdle5);
				break;
			}
		}
		else if(subtype === "fox"){
			switch(getRandomInt(3)) {
				case 0:
					setPetImage(foxIdle);
				break;
				case 1:
					setPetImage(foxIdle2);
				break;
				case 2:
					setPetImage(foxIdle3);
				break;
			}
		}
		else if(subtype === "hedgehog"){
			switch(getRandomInt(2)) {
				case 0:
					setPetImage(HedgehogIdle);
				break;
				case 1:
					setPetImage(HedgehogIdle2);
				break;
			}
		}
	}

	function goTarget(){
		
		let goHorizontal = Math.abs(petTargetX - petLeft) > 15 ;
		let goVertical = Math.abs(petTargetY - petTop) > 15;
		if( goHorizontal || goVertical ){
			if(goHorizontal){
				if(petTargetX > petLeft){
					if(!petFacingRight)
						setPetFacingRight(true);

					setPetLeft(petLeft + 20);
				}else{
					if(petFacingRight)
						setPetFacingRight(false);
					setPetLeft(petLeft - 20);
				}
			}
			
			if(goVertical){
				if(petTargetY > petTop){

					setPetTop(petTop + 15);
				}else{
					setPetTop(petTop - 15);
				}
			}
		}else{
			setPetIdle(true);
			setIdleImage();
		}	
	}


	useEffect(() => {
		if(type === "pet" && petIdle){
			const petState = setInterval(async () => {
				if(getRandomInt(2) === 0){
					setPetTargetX(getRandomInt(1700))
					setPetTargetY(getRandomInt(700))
					setPetIdle(false);
					setWalkImage();

				}else{
					setPetIdle(true);
					setIdleImage();
				}
			}, 12000);
			return () => clearInterval(petState);
		}

	}, [ petTargetX, petTargetY, petIdle])

	useEffect(() => {
		if(type === "pet"){
			const interval = setInterval(async () => {
				if(!petIdle){
					goTarget();
				}

			}, 300);
			return () => clearInterval(interval);
		}

	}, [petTargetX, petLeft, petTop, petIdle, petFacingRight])

	function goNear(x,y){
		let offsetx = randomInRange(-75, 75);
		let offsety = randomInRange(-75, 75);
		setPetTargetX(x+offsetx)
		setPetTargetY(y+offsety)
		setPetIdle(false);
		setWalkImage();
	}

	useEffect(() => {
		if(type === "pet"){
			goNear(targetX,targetY)
		}

	}, [targetX, targetY])
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////7
	useEffect(() => {
		if(type === "pet"){
			if(petTop != top && petLeft != left){
				setPetLeft(left);
				setPetTop(top);
			}
		}
	}, [left, top])

	useEffect(() => {
		setWidth(initWidth);
		setHeight(initHeight);
	}, [initHeight, initWidth])

	useEffect(() => {
		if (objktId && objkt) {
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
						//sellSound.play();
						setobjkt(temp);
					}

					if (objkt.token_holders ) {
						/*if((objkt.token_holders.length !== temp.token_holders.length)){
						activateFireworks();
						setobjkt(temp);
						sellSound.play();}*/
					}
				}

			}, 60000);
			return () => clearInterval(interval);
		}
	}, [objkt, sells//, sellSound
	])


	const [{ isDragging }, drag, preview] = useDrag({
		item: { id, left, top, itemType: type, type: 'item', imgSrc, data, objktId, text, address, domain, width, height },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		})
	});

	/*if (isDragging) {
		return <div ref={preview} />;
	}*/

	const noLinkPrev = (
		<div  style={{ width: width, height: height, textAlign:"center"}}>
			{text}
		</div>
	);

	const shouldShowMoveButton =
		isPinned || type === 'chat' || type === 'musicPlayer';

	const onResize = (event, {element, size}) => {
			//this.setState({width: size.width, height: size.height});
			setWidth(size.width);
			setHeight(size.height);
		  };

	const onResizeStop = (event, {element, size}) => {

			let x;
			let y;
			let room;
			if(location.pathname.length != 1){
				x = location.pathname.split("/")[2].split(",")[0];
				y = location.pathname.split("/")[2].split(",")[1];
			}
			else{
				room = "0,0";
			}
			if(y){
				room = x + "," + y;
			}
			else if(x)
				room = x;
			else
				room = "0,0";
			console.log ("room "+ room) 



			const {
				isSuccessful,
				message
			} = firebaseContext.resizePinnedRoomItem(room || '0,0', {
				type,
				width: width,
				height: height,
				key: id
			});

			socket.emit('event', {
				key: 'resize-item',
				type,
				width: width,
				height: height,
				itemKey: id
			});

			markChecklist(3);


		  };
	return (
		<div
			style={{
				top: type === "pet" ? petTop : top,
				left: type === "pet" ? petLeft : left,
				border: currentSkin?.border,
				/* zIndex: isHovering ? 99999999 : 'auto' */
				zIndex: (isHovering || type === 'chat' || type === 'gate'  || type === 'trash' || type === 'minter' || type === 'bgHolder' || id === 'warning' || !hide) ? 99999999 : 99999998
			}}
			className={classes.container}
			
		>

				{type === 'gif' && data && 
				<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
				<div ref={drag} style={{width: width, height: height}}>
					<Gif gif={data}  width={width} noLink={true} />
				</div>
				</Resizable>
				}
				{type === 'image' && imgSrc && (
					<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
						<div   style={{width: width, height: height }}>
							<img ref={drag} alt="user-selected-img" src={imgSrc} style={{ width: width, height: height, transform: [ {scaleX: -1}] }} />
						</div>
					</Resizable>
				)}
				{type === 'text' && text && (
					<div className={classes.text} style={{ width: width }}>
						<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
							<div  style={{ width: width, height: height}}>
								{text && <div  ref={drag} >
									<LinkPreview
										
										url={text!}
										fallback={noLinkPrev}
										descriptionLength={50}
										imageHeight={height}
										showLoader={false}
									/>
								</div>}
							</div>
						</Resizable>
					</div>
				)}
				
				{type === 'objktStat' && size === 0 && objkt && (
					<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
					<div   style={{ height:height, width:width, padding: 3,   backgroundColor: currentSkin?.backgroundColor }}>
						<div  ref={drag} style={{ alignItems: "center", padding: 10, backgroundColor: currentSkin?.backgroundColor }}>
						        <iframe
									scrolling="no"
									width={width-26}
									height={height-26}
									title="html-embed"
									src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
									sandbox="allow-scripts allow-same-origin " 
									allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
									/>
						</div>
					</div>
					</Resizable>
				)} 
				{type === 'objkt' && size === 0 && (
					<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
					<div   style={{ height:height, width:width, padding: 3, backgroundColor: currentSkin?.backgroundColor }}>

					<div ref={drag}  style={{ width: width, backgroundColor: currentSkin?.backgroundColor }}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: currentSkin?.color, textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{color: currentSkin?.color, textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.art/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: currentSkin?.color, textAlign: "right"}}>  <Button className={classes.buttonGateBottom} title={"size"} onClick={() => { setSize(1) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
						{ objkt && objkt.mime === "application/x-directory" && 
								<div style={{ padding: 10, overflowY: 'auto',  backgroundColor: currentSkin?.backgroundColor }}>
								<div style={{alignItems: "center"}}>
										<iframe
											scrolling="no"
											width={width-26}
											height={width-26}
											title="html-embed"
											src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
											sandbox="allow-scripts allow-same-origin"
											allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
		
											/>
								</div>
							</div>
							}
						{ objkt && (objkt.mime != "video/mp4" && objkt.mime != "application/x-directory" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width={width}  height="auto" ></img>
						}
                        <div style={{ color: currentSkin?.backgroundColor, textAlign: "center" }}>
                            {sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez SWAP</Button>}
                        </div>
					</div>

					</div>
					</Resizable>
				)
				}
				{type === 'objkt' && size === 1 && (

					<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
					<div   style={{ height:height, width:width, padding: 3, backgroundColor: currentSkin?.backgroundColor }}>

					<div ref={drag}  style={{ width: width, height:height, overflowY: 'auto',  backgroundColor: currentSkin?.backgroundColor }}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: "black", textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: "black", textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.art/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: "black", textAlign: "right"}}>  <Button className={classes.buttonBuy} title={"size"} onClick={() => { setSize(0) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
							{ objkt && objkt.mime === "application/x-directory" && 
								<div style={{ padding: 10, overflowY: 'auto',  backgroundColor: currentSkin?.backgroundColor }}>
								<div style={{ alignItems: "center"}}>
										<iframe
											scrolling="no"
											width={width-26}
											height={width-26}
											title="html-embed"
											src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
											sandbox="allow-scripts allow-popups allow-same-origin"
											allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
		
											/>
								</div>
							</div>
							}
						{ objkt && (objkt.mime != "video/mp4" && objkt.mime != "application/x-directory" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width={width}  height="auto" ></img>
						}

						{objkt && !isWidget &&
								<div style={{ color: "blue", pointerEvents: "auto", textAlign: "center" }}>
									{sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez SWAP</Button>}

									<div>Total Sell Count: {sells}</div>
									<div>Total Revenue: {revenue}</div>
									<div>Token Holders: {objkt.token_holders.length}</div>

                                    <br></br>
									{objkt.trades.map((trade) => (
										<>
											{(activeAddress && (trade.seller.address === activeAddress || trade.buyer.address === activeAddress)) ?
												<div style={{ paddingLeft: 1, textAlign: "left", color: "green" }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
													<div style={{  display:"flex", alignText: "center", paddingInline:6}}> 
														<div style={{ textAlign: "left"}}>{trade.timestamp.slice(2, 10)}</div>
														<div style={{ textAlign: "center", margin:"auto" }}>{trade.amount} ed.</div>
														<div style={{ textAlign: "right"}}>{trade.swap.price / 1000000} tez</div>
													</div>
												</div>
												:
												<div style={{ paddingLeft: 1, textAlign: "left", color: "blue" }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
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

					</div>
					</Resizable>
				)}
				{type === 'chat' && chat && setActivePanel && (
					<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
					<div  style={{ height:height, width:width, backgroundColor: currentSkin?.backgroundColor}}>
						<div ref={drag}  >
							<div >
							<WaterfallChat
								setActivePanel={setActivePanel}
								chat={chat}
								routeRoom={routeRoom}
								updateIsTyping={updateIsTyping}
								sendMessage={sendMessage}
								height={height-60}
								width={width}
								currentSkin={currentSkin}
							/>
							</div>
						</div>
					</div>
					</Resizable>
				)}

				{type === 'pet' &&  (
					<div ref={drag} onClick={()=>{poke()}}>
						<img src={petImage} className={petFacingRight ? classes.pet : classes.petFlipped } alt={"pet"}  ></img>
					</div>
				)}

				{type === 'message' && 
				
				<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
				<div   style={{ height:height, width:width, padding: 3,   backgroundColor: currentSkin?.backgroundColor }}>
				{((imgSrc && (

							<div ref={drag} style={{ width: width, height: height }}> 					 	 
							<div style={{  alignItems: "center" , color:currentSkin?.color}}> 

							<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
								{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
							</Button>
							
							{text}  
						</div>
							<img alt="user-selected-img" src={imgSrc} style={{ width: width-6, height: 'auto' }} />
							</div>
						)
						
						)

					|| address &&
					<div ref={drag} style={{ width: width-6 }}> 					 	 <div style={{ alignItems: "center" }}> 
					<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
					{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
					</Button>
					 {text}  
				</div>
					<div style = {{ height: 80, backgroundColor: ((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : currentSkin?.backgroundColor ), color: currentSkin?.color, textAlign: "center", fontSize: 20}}> 
						Send to<br></br> ------- <br></br> 
							<Button className={classes.text} onClick={() => { routeRoom(address) }}>
								{domain ? domain : (address.slice(0, 6) + "..." + address.slice(32, 36))}
							</Button> 
					</div>
					 </div>
					|| data &&
					<div style={{ width: 180 }}>					 	 <div style={{ alignItems: "center" }}> 
					<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
					{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
					</Button>
					 {text}  
				</div>
					 <Gif gif={data}  width={180} noLink={true} />
					 </div>

					||objkt &&  objktId && isWidget &&
						<div ref={drag} style={{  height:height-6, overflowY: 'auto',  backgroundColor: currentSkin?.backgroundColor }}>
							<div style={{ alignItems: "center", color:currentSkin?.color }}>   
							<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
							{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
							</Button>
							 {text}  
						</div>
							<div style={{ alignItems: "center"}}>
								<iframe
									scrolling="no"
									width={width-10}
									height={height-100}
									title="html-embed"
									src={`${HashToURL( objkt.artifact_uri, 'IPFS')}/?creator=true&viewer=true&objkt=${objktId}`}
									sandbox="allow-scripts allow-same-origin"
									allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"

											/>
								</div>
						</div>


					 || objkt &&  objktId && !isWidget &&

					 <div ref={drag} style={{ width: width-6, padding: 5 }}> 
					 	 <div style={{ alignItems: "center", color:currentSkin?.color }}>   
							<Button className={classes.text} onClick={() => { if(senderAddress) routeRoom(senderAddress) }}>
							{senderAddress ? (senderAddress.slice(0, 6) + "..." + senderAddress.slice(32, 36) + ":") : "anon: "}
							</Button>
							 {text}  
						</div>
					 { size === 0 && (
					<div style={{ width: width-16, backgroundColor: currentSkin?.backgroundColor}}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: currentSkin?.color, textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: currentSkin?.color, textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.art/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: currentSkin?.color, textAlign: "right"}}>  <Button className={classes.buttonGateBottom} title={"size"} onClick={() => { setSize(1) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
						{ objkt && (objkt.mime != "video/mp4" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width={width-16}  height="auto" ></img>
						}


                        <div style={{ color: currentSkin?.color, pointerEvents: "auto", textAlign: "center" }}>
                            {sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez SWAP</Button>}

                        </div>
					</div>
				)}
				{ size === 1 && (
					<div style={{ width: width-16, padding:5, maxHeight:height+300, overflowY: 'auto',  backgroundColor: currentSkin?.backgroundColor }}>
                        {objkt && <div style={{display:"flex", alignItems: "center", paddingInline:6}} > 
							<div style={{color: currentSkin?.color, textAlign: "left"}}> {forSale}  / {objkt.supply}  </div>
							<div style={{ color: currentSkin?.color, textAlign: "center", fontSize: 20, margin:"auto" }} ><Button className={classes.buttonLarge}  title={objkt.title} onClick={() => { window.open('https://www.hicetnunc.art/objkt/' + objkt.id); }}>{objkt.title}</Button></div>
							<div style={{color: currentSkin?.color, textAlign: "right"}}>  <Button className={classes.buttonBuy} title={"size"} onClick={() => { setSize(0) }}>^</Button></div>
						</div>}
						{ objkt && objkt.mime === "video/mp4" && 
							<video  width="100%" title={"Shell Sort"} autoPlay={true} muted controls controlsList="nodownload" loop  >
								<source src={HashToURL( objkt.artifact_uri, 'IPFS')} type="video/mp4" />
							</video>}
						{ objkt && (objkt.mime != "video/mp4" ) &&
							<img src={HashToURL( objkt.display_uri, 'IPFS')} alt={objkt.title} width={width-16}  height="auto" ></img>
						}

						{objkt &&
								<div style={{ color: "blue", pointerEvents: "auto", textAlign: "center" }}>
									{sId != 0 && <Button className={classes.buttonBuy} title={"buy"} onClick={() => { collect(sId, sPrice) }}>{ Number(sPrice / 1000000)} tez SWAP</Button>}

									<div>Total Sell Count: {sells}</div>
									<div>Total Revenue: {revenue}</div>
									<div>Token Holders: {objkt.token_holders.length}</div>

                                    <br></br>
									{objkt.trades.map((trade) => (
										<>
											{(activeAddress && (trade.seller.address === activeAddress || trade.buyer.address === activeAddress)) ?
												<div style={{ paddingLeft: 1, textAlign: "left", color: "green" }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
													<div style={{  display:"flex", alignText: "center", paddingInline:6}}> 
														<div style={{ textAlign: "left"}}>{trade.timestamp.slice(2, 10)}</div>
														<div style={{ textAlign: "center", margin:"auto" }}>{trade.amount} ed.</div>
														<div style={{ textAlign: "right"}}>{trade.swap.price / 1000000} tez</div>
													</div>
												</div>
												:
												<div style={{ paddingLeft: 1, textAlign: "left", color: "blue" }}>
													 {trade.seller.name ? 
													<Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.seller.name); }}>{trade.seller.name}</Button> 
													: <Button className={classes.button} title={"seller"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.seller.address); }}>{trade.seller.address.slice(0, 6)} ... {trade.seller.address.slice(32, 36)}</Button>} 
													 {" >>> "} {trade.buyer.name 
													? <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/' + trade.buyer.name); }}>{trade.buyer.name}</Button> 
													: <Button className={classes.button} title={"buyer"} onClick={() => { window.open('https://www.hicetnunc.art/tz/' + trade.buyer.address); }}>{trade.buyer.address.slice(0, 6)} ... {trade.buyer.address.slice(32, 36)} </Button>} 
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
					 
					 )}				

					 </div>
					 </Resizable>
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
				{type === 'trash' && <div ref={drag}>
					<div ref={drop} style = {{  width:100, height: 30, backgroundColor: ((!isOver && canDrop)? "LightCoral" : (isOver && canDrop) ? "red" : currentSkin?.backgroundColor ), color: currentSkin?.color, textAlign: "center", fontSize: 20}}> Remove  
					</div>
				</div>
				}

				{type === 'bgHolder' && <div ref={drag}>
					<div  ref={drop} style = {{  width:180, height: 30, backgroundColor:((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : currentSkin?.backgroundColor ), color: currentSkin?.color, textAlign: "center", fontSize: 20}}> Background 
					</div>
				</div>
				}
				
				{type === 'wallet' && 
				<div  ref={drag} style={{  padding: 3,   backgroundColor: currentSkin?.backgroundColor }}>
				<div ref={drop} style = {{  height: 80, backgroundColor: ((!isOver && canDrop)? "YellowGreen" : (isOver && canDrop) ? "LawnGreen" : currentSkin?.backgroundColor ), color: currentSkin?.color, textAlign: "center", fontSize: 20}}> 
				 	Send to<br></br> ------- <br></br> 
				 	<Button className={classes.text} onClick={() => { routeRoom(address) }}>
						  {domain ? domain : (address.slice(0, 6) + "..." + address.slice(32, 36))}
					</Button> 
				 </div>
				 </div>
				 }
				{type === 'checklist' && checklist &&
					<div style={{  backgroundColor: "white", width: 400, heigth: 600}}>
						<h1 style={{ textAlign: "center"}}> Objectives </h1>
						<div>
						{(checklist.items).map((item) => (
							<div style={{  padding: 10}}> 
								<div style={{display:"flex", alignItems: "center" }} >  
									<div style={{ paddingInline: 10}} >
									{item.condition ? 
								
									<img alt="check" src={boxCheck} style={{ width:15, height:15}} />

									: <img alt="check" src={boxBlank} style={{ width:15, height:15}} />
									}</div>
									{item.objective}
								</div>
									
							</div>
								
			
							)
						)}
							
							
						</div>
					</div>
				}
				{type === 'trail' && trail && trail.length > 0 && (
					<Resizable height={height} width={width} onResizeStop={onResizeStop} onResize={onResize}>
						<div   style={{ padding: 3, backgroundColor: currentSkin?.backgroundColor, color: currentSkin?.color, fontFamily: currentSkin?.fontFamily }}>
							<div   ref={drag} style={{ width: width, height: height, textAlign: "center", overflowY: 'auto'}}>
							Trail
							{
					trail.map((tr, index) =>
						<div>
							{
								<Box  style={{fontSize: 16 }}>
									<div> 
										<div style={{color:currentSkin?.color, fontFamily: currentSkin?.fontFamily,  alignContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto"}}>
											<Button title={tr.roomId} style={{ padding: 1, fontFamily: currentSkin?.fontFamily, color:currentSkin?.color }} onClick={() => { if(tr.roomId) {routeRoom(tr.roomId)} }}> {tr.domain ? tr.domain : <>{tr.roomId.length === 36 ? <>{  tr.roomId.slice(0, 6)} ... {tr.roomId.slice(32, 36)} </> : tr.roomId} </> }</Button>
										</div>
										
									 </div>
								</Box>
							}
						</div>
					)
				}
							</div>
						</div>
					</Resizable>
				)}
				{/*type === 'player' && !isFighting &&(
					<div > 
						<img src={playerImage} className={ classes.pet } alt={"player"}  ></img>
						<img src={dungeon} className={ classes.pet } alt={"dungeon"}  ></img>

						<br></br>
						<div  style={{ paddingLeft: 120}}>
							<Button style={{ backgroundColor:"white"}}  onClick={() => { console.log("enter dungeon"); enterDungeon() }} > enter </Button>
						</div>
					</div>
				)*/}

				{/*type === 'player' && isFighting &&(
					<div > 
						<img src={playerImage} className={ classes.pet } alt={"player"}  ></img>
						<img src={monsterImage} className={ classes.petFlipped } alt={"monsterImage"}  ></img>
						<br></br>
						{player.hitpoint}
						{"    "}
						{monster.hitpoint}
					</div>
				)*/}
			
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
