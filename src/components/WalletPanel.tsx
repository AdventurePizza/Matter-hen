// @ts-nocheck
import { Button, TextField, makeStyles,	Avatar, IconButton,	createStyles,  Theme } from '@material-ui/core';
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		'& > *': {
			marginRight: 10
		}
		
	},
	input: {
		fontFamily: "poxel-font",
		color: "black",
	},
	  button: {
		color: "black",
		fontFamily: 'poxel-font',
		fontSize: 15,
		border: '1px dashed black',
		paddingInline: 5
	},
});

interface IWalletPanel {
	sendWallet: (address: string) => void;
}
/*
<div  className="background-icon-list"  style={{ display: "flex", width: "100%", overflowY: "auto"}}>
{		wallets && 			
creations.map(({ display_uri, id}) => (
	<IconButton
		key={id}
		onClick={() => {
			sendObjkt (id, 'objkt');
		}}
	>
		<Avatar variant="rounded" src={HashToURL( display_uri, 'IPFS')} alt={id} className={classes.size} />
		
	</IconButton>
))
}

</div>
*/
export const WalletPanel = ({ sendWallet }: IWalletPanel) => {
	const firebaseContext = useContext(FirebaseContext);
	const classes = useStyles();
	const [inputAddress, setInputAddress] = useState('');
	const [wallets, setWallets] = useState();
	const onKeyPressChat = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			sendWallet (inputAddress);
		}
	};

	//useeffect 						firebaseContext.deleteChat(room);
	useEffect(() => {
		async function getWallets() {
			firebaseContext.getAllWallets().then((result) => {
				if (result.isSuccessful) {
					setWallets(result.data);
				} else {
					console.log("couldnt fetch walelts from database")
				}
			});
			console.log(wallets);
		}
		getWallets();
		

	}, [])
	return (
		<div style={{ width: "100vw", overflow: "none"}} >
			<div  className="background-icon-list"  style={{ display: "flex", width: "100%", overflowY: "auto"}}>
			{wallets && wallets.map(({ address, domain}) => (
				<div style={{ padding: 10}}>
					<Button
						className={classes.button} 
						key={address}
						onClick={() => {
							sendWallet (address);
						}}
					>		
					{domain ? domain : address}
					</Button>
				</div>

			))
			}

			</div>
			<div className={classes.container}>
				<div style={{ display:'flex' }}>
					<div style={{ paddingBlock: 5, paddingInline: 20, border: '1px dashed black'}}>
						<TextField
							inputProps={{ className: classes.input }}
							color="primary" focused
							value={inputAddress}
							variant="standard"
							onChange={(e) => setInputAddress(e.target.value)}
							placeholder="enter wallet address"
							className={classes.input}
						/>
					</div>
						<Button
							variant="contained" color="primary"
							onClick={() => {
								sendWallet (inputAddress);
							}}
						>
							Add
						</Button>
				</div>

			</div>

		</div>
	);
};