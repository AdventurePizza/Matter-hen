import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles({
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
		fontFamily: "poxel-font",
		color: "black",
	  },
});

interface IWalletPanel {
	sendWallet: (address: string) => void;
}

export const WalletPanel = ({ sendWallet }: IWalletPanel) => {
	const classes = useStyles();
	const [inputAddress, setInputAddress] = useState('');

	return (
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
	);
};