// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { IWaterfallMessage, newPanelTypes } from '../types';
import { Box, Avatar } from '@material-ui/core';
import { avatarMap } from './UserCursors';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


interface IWaterfallChatProps {
	chat: IWaterfallMessage[];
	setActivePanel: (panel: newPanelTypes) => void;
	routeRoom: (roomName: string) => void;
	updateIsTyping: (isTyping: boolean) => void;
	sendMessage: (message: string) => void;
	height: number;
	width: number;
	currentSkin: ISkin;
}

export const WaterfallChat = ({ chat, setActivePanel, routeRoom, updateIsTyping, sendMessage, height, width, currentSkin }: IWaterfallChatProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollToBottom = () => {
		if(messagesEndRef && messagesEndRef.current){
	    	messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
		}
	}
	const useStyles = makeStyles({
		input: {
			color: currentSkin.color,
			borderColor: currentSkin.color,
			width: "100%"
		}
	});
	const classes = useStyles();
	useEffect(scrollToBottom, [chat]);
	const [chatValue, setChatValue] = useState('');
	let boxColors: Array<string> = ['blue', 'red', 'purple', 'green'];

	function NewlineText(props) {
		const text = props.text;
		return text.split('\n').map(str => <p>{str}</p>);
	  }
	const onChangeChat = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChatValue(event.target.value);

		if (!!event.target.value !== !!chatValue) {
			updateIsTyping(!!event.target.value);
		}
	};
	const clearMessage = () => {
		setChatValue('');
		updateIsTyping(false);
	};
	const onKeyPressChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && event.shiftKey) {
			//newline

		}
		else if (event.key === 'Enter') {
			sendMessage(chatValue);
			clearMessage();
		}
	};
	return (
			<div 
			style={{backgroundColor: currentSkin.backgroundColor , padding: 4}}
			
			> 
<				Box color={currentSkin.color} mb={1} onClick={(e) => { 
				setActivePanel('chat');
				e.stopPropagation();
			}} style={{width:width, fontSize: 20, textAlign: 'center', color: currentSkin.color }}> CHAT </Box>
				<div style={{overflowY: 'scroll', border: currentSkin?.border, maxHeight: height }}>
				{
					chat.map((ch, index) =>
						<div key={index.toString()} 
						draggable
						onDragStart={e => {
						e.preventDefault();
						e.stopPropagation();
						}} 
						style={{ width: "100%", clear: 'left'}}>
							{
								<Box color={currentSkin.color}  style={{fontSize: 16 }}>
									<Avatar alt= {ch.avatar} src= {!ch.avatar.startsWith("https") ? avatarMap[ch.avatar] : ch.avatar} style={{ float: 'left', width: 24, height: 24 }} />   
									<div style={{ display:"inline-block" }}> 
										<div style={{color:currentSkin.color }}>
											<Button  title={ch.author} style={{ padding: 1, color: currentSkin.color }} onClick={() => { if(ch.author) {routeRoom(ch.author)} }}>{ch.name + ": "}</Button>
										</div>
										<div style={{ fontFamily: currentSkin.fontFamily, color:currentSkin.color  }}>
											<NewlineText text={ch.message} />
										</div>
									 </div>
								</Box>
							}
						</div>
					)
				}
				
					<div style={{  padding: 3 }}>
						<TextField
							inputProps={{ className: classes.input }}
							placeholder="Your message"
							variant="outlined"
							focused
							value={chatValue}
							onChange={onChangeChat}
							onKeyPress={onKeyPressChat}
							className={classes.input}
							multiline
							draggable
							onDragStart={e => {
							e.preventDefault();
							e.stopPropagation();
							}} 
							style={{
								color: currentSkin.color,
							}}
							
						/>
					</div>
					<div ref={messagesEndRef} />
				</div>
			</div>
	);
};
