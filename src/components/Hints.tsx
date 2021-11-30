// @ts-nocheck
import React, { useState, useEffect } from 'react';

const hints = [
	"use +image to add an image",
	"use +objkt to add an objkt",
	"use +wallet to add a tezos wallet",
	"use +widget to add a widget",
	"use +pet to buy a pet !",
	"you can search images on google, unsplash and giphy",
	"sync you tezos wallet for enchanced experience !",
	"only you can edit your personal metaverse !",
	"you can by metaverses !",
	"drag and drop objects to move it",
	"sent a message by dragging objects to wallets",
	"you can resize most of the objects, by using their bot right handle",
	"metaverses are designed to grow small dao's !",
	"list your objkts in your own style ",
	"each metaverse is possibly a marketplace, meeting room or starting page",
	"you can add any program (games, musics, videos) by using widgets",
	"check adventure networks webpage for more frontier technologies",
	"to set a background drag an image to \"background\" object",
	"to set clear a background drag  \"background\" object to \"remove\" object",
	"you can clear chat by dragging it to \"remove\" object",
	"clear your metaverse by dragging objects to \"remove\" object",
	"pin a text to board by using chat tab in bottom panel and pin button",
]

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }

export const Hints = () => {

	const [hint, setHint] = useState(''); 

	useEffect(() => {
		const interval = setInterval(() => {
		  setHint(hints[getRandomInt(hints.length)])
		}, 15000);
		return () => clearInterval(interval);
	  }, []);
	return (
		<div>
			{hint}
		</div>
	);
};
