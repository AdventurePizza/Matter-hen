// @ts-nocheck
import { Button, TextField, makeStyles,	Avatar, IconButton,	createStyles,  Theme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import objkt542098 from '../assets/542098.png';
import { ISkin } from '../types';




interface IObjktPanel {
	sendObjkt: (id: string, type: string) => void;
	activeAddress: string;
	currentSkin: ISkin;
}

/*
const query_collection = `
query collectorGallery($address: String!) {
  hic_et_nunc_token_holder(where: {holder_id: {_eq: $address}, token: {creator: {address: {_neq: $address}}}, quantity: {_gt: "0"}}, order_by: {token_id: desc}) {
	token {
	  id
	  artifact_uri
	  display_uri
	  thumbnail_uri
	  timestamp
	  mime
	  title
	  description
	  supply
	  royalties
	  creator {
		address
	  }
	}
  }
}
`
*/
const query_creations = `
query creatorGallery($address: String!) {
  hic_et_nunc_token(where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    mime
    title
    description
    supply
    swaps(order_by: {price: asc}, limit: 1, where: {amount_left: {_gte: "1"}, status: {_eq: "0"}}) {
      status
      amount_left
      creator_id
      creator {
        address
      }
      price
    }
  }
}
`

export const WidgetPanel = ({ sendObjkt, activeAddress, currentSkin }: IObjktPanel) => {
	const useStyles = makeStyles((theme: Theme) =>
		createStyles({
			container: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 10,
				width: '100%',
				'& > *': {
					marginRight: 10
				}
				
			},
			input: {
				fontFamily: currentSkin.fontFamily,
				color: currentSkin.color,
			},
			button: {
			  fontFamily: currentSkin.fontFamily,
			  color: currentSkin.color,	
			  border: currentSkin.border,	
			  fontSize: 15,
			  paddingInline: 5
		 	 },

			root: {
			display: 'flex',
			},
			size: {
			width: theme.spacing(12),
			height: theme.spacing(12),
			},
		}),
	);
	const classes = useStyles();
	const [inputObjkt, setInputObjkt] = useState('');
	const [collections, setCollections] = useState([]);
	const [creations, setCreations] = useState([]);
	

	useEffect(() => {
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

		/*async function fetchCollection(addr) {
			const { errors, data } = await fetchGraphQL(
			  query_collection,
			  'collectorGallery',
			  { address: addr }
			)
			if (errors) {
			  console.error(errors)
			}
			const result = data.hic_et_nunc_token_holder
			console.log( result );
			setCollections(result)
			return result
		  }*/

		  async function fetchCreations(addr) {
			const { errors, data } = await fetchGraphQL(
			  query_creations,
			  'creatorGallery',
			  { address: addr }
			)
			if (errors) {
			  console.error(errors)
			}
			const result = data ? data.hic_et_nunc_token: null;
			console.log( result )
			setCreations(result)
			return result
		  }
		  //fetchCollection(activeAddress);

		  fetchCreations("tz2UzpCpfT8v65Z7N53yzzDaXU8mMg5Ef93Y");



	}, []);

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
	const onKeyPressChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			sendObjkt (inputObjkt, 'objktStat');
		}
	};
	return (
		<div >
			<div style={{ width: "100vw", overflow: "none"}} >
				<div  className="background-icon-list"  style={{ display: "flex", width: "100%", overflowY: "auto"}}>
					{		creations && 			
					creations.map(({ display_uri, id, mime}) => (
						(mime === "image/svg+xml" ) &&
						<IconButton
							key={id}
							onClick={() => {
								console.log("clickk")
								sendObjkt (id, 'objktStat');
							}}
						>
							{ id === 542098 ? 
							<img  alt="objkt542098" src={objkt542098} style={{ width: 200, height: 200}} />
							:
							<iframe title="SVG renderer" width="200" muted height="200" src={ HashToURL(display_uri, "IPFS") +"?creator=false&amp;viewer=false&amp;objkt=false"} style={{pointerEvents: "none"}}  sandbox="allow-scripts" scrolling="no"></iframe>}
						</IconButton>
					))
					}
				</div>

				<div style={{ display:"flex", paddingTop: 10, justifyContent: "center"}}>
					<div style={{ paddingBlock: 5, paddingInline: 20 }}>
						<TextField
							inputProps={{ className: classes.input }}
							color="primary" focused
							value={inputObjkt}
							variant="outlined"
							onChange={(e) => setInputObjkt(e.target.value)}
							placeholder="enter interactive objkt id"
							onKeyPress={onKeyPressChat}
							className={classes.input}
						/>
					</div>
						<Button
							className={classes.button}

							onClick={() => {
								sendObjkt (inputObjkt, 'objktStat');
							}}
						>
							Add Widget
						</Button>
				</div>
			</div>

		</div>
	);


};