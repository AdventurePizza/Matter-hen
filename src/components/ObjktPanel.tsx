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

interface IObjktPanel {
	sendObjkt: (id: string, type: string) => void;
}

export const ObjktPanel = ({ sendObjkt }: IObjktPanel) => {
	const classes = useStyles();
	const [inputObjkt, setInputObjkt] = useState('');
	const [inputObjktStat, setinputObjktStat] = useState('');

	return (
		<div className={classes.container}>
			<div>
				<div style={{ paddingBlock: 5, paddingInline: 20, border: '1px dashed black' }}>
					<TextField
						inputProps={{ className: classes.input }}
						color="primary" focused
						value={inputObjkt}
						variant="standard"
						onChange={(e) => setInputObjkt(e.target.value)}
						placeholder="enter objkt id"
						className={classes.input}
					/>
				</div>
					<Button
						variant="contained" color="primary"
						onClick={() => {
							sendObjkt (inputObjkt, 'objkt');
						}}
					>
						List Objkt
					</Button>
			</div>
			<div>
				<div style={{ paddingBlock: 5, paddingInline: 20, border: '1px dashed black' }}>
					<TextField
						inputProps={{ className: classes.input }}
						color="primary" focused
						value={inputObjktStat}
						variant="standard"
						onChange={(e) => setinputObjktStat(e.target.value)}
						placeholder="enter objkt id"
						className={classes.input}
					/>
				</div>
					<Button
						variant="contained" color="primary"
						onClick={() => {
							sendObjkt (inputObjktStat, 'objktStat');
						}}
					>
						Objkt Stats
					</Button>
			</div>
		</div>
	);
};