// @ts-nocheck
import { Button, TextField, makeStyles,	Avatar, IconButton,	createStyles,  Theme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';




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
		fontFamily: "roboto",
		color: "black",
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
interface IPetPanel {
	sendObjkt: (id: string, type: string) => void;
	activeAddress: string;
}

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


export const PetPanel = ({ sendObjkt, activeAddress }: IPetPanel) => {
	const classes = useStyles();
	const [inputPet, setInputPet] = useState('');
	const [pets, setPets] = useState([]);
	//let pets = [];

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

		async function fetchObjkt(id) {

			const { errors, data } = await fetchGraphQL(query_objkt, 'objkt', {
				id: id
			})
			if (errors) {
				console.error(errors)
			}
			if(data){
				const result = data.hic_et_nunc_token_by_pk
				console.log(result);
				return result;
			}
	
		}
		if(pets.length === 0){
			fetchObjkt(535951).then(function(result) {
				console.log(result);
				setPets((pets) => pets.concat(result))
			})
			fetchObjkt(535914).then(function(result) {
				console.log(result);
				setPets((pets) => pets.concat(result))
			})
			console.log(pets);
		}
	}, [pets]);
    
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
			sendPet (inputPet, 'PetStat');
		}
	};
	return (
		<div >
			<div style={{ width: "100vw", overflow: "none"}} >
                <div  className="background-icon-list"  style={{ display: "flex", width: "100%", overflowY: "auto"}}>
					{		pets && 			
					pets.map(({ display_uri, id}) => (
						<IconButton
							key={id}
							onClick={() => {
								console.log("clickk")
								sendObjkt (id, 'objkt');
							}}
						>
							<Avatar variant="rounded" src={HashToURL( display_uri, 'IPFS')} alt={id} className={classes.size} />
						</IconButton>
					))
					}
				</div>

			</div>

		</div>
	);


};