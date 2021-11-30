// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { IWaterfallMessage, newPanelTypes } from '../types';
import { Box, Avatar } from '@material-ui/core';
import { avatarMap } from './UserCursors';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	input: {
		color: "black",
		width: "100%"
	}
});
interface IWaterfallChatProps {
	chat: IWaterfallMessage[];
	setActivePanel: (panel: newPanelTypes) => void;
	routeRoom: (roomName: string) => void;
	updateIsTyping: (isTyping: boolean) => void;
	sendMessage: (message: string) => void;
	height: number;
	width: number;
}

export const WaterfallChat = ({ chat, setActivePanel, routeRoom, updateIsTyping, sendMessage, height, width }: IWaterfallChatProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollToBottom = () => {
		if(messagesEndRef && messagesEndRef.current){
	    	messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
		}
	}
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
			style={{backgroundColor:"white" , padding: 4}}
			
			> 
<				Box color="black" mb={1} onClick={(e) => { 
				setActivePanel('chat');
				e.stopPropagation();
			}} style={{width:width, fontSize: 20, textAlign: 'center' }}> CHAT </Box>
				<div style={{overflowY: 'scroll', maxHeight: height }}>
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
								<Box color={boxColors[ch.avatar.charCodeAt(ch.avatar.length -1) % 4]}  style={{fontSize: 16 }}>
									<Avatar alt= {ch.avatar} src= {!ch.avatar.startsWith("https") ? avatarMap[ch.avatar] : ch.avatar} style={{ float: 'left', width: 24, height: 24 }} />   
									<div style={{ display:"inline-block" }}> 
										<div style={{color:"black", }}>
											<Button title={ch.author} style={{ padding: 1 }} onClick={() => { if(ch.author) {routeRoom(ch.author)} }}>{ch.name + ": "}</Button>
										</div>
										<div style={{ fontFamily: 'Roboto' }}>
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
							
						/>
					</div>
					<div ref={messagesEndRef} />
				</div>
			</div>
	);
};
