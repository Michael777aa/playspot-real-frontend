import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
const TuiEditor = dynamic(() => import('../community/Teditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<div
				id="write-article-page"
				style={{
					padding: '16px',
					backgroundColor: '#f9f9f9',
					minHeight: '100vh',
				}}
			>
				<Stack
					style={{
						marginBottom: '16px',
						textAlign: 'center',
					}}
				>
					<Typography
						style={{
							fontSize: '18px',
							fontWeight: 'bold',
							marginBottom: '8px',
							color: '#333',
						}}
					>
						Write an Article
					</Typography>
					<Typography
						style={{
							fontSize: '14px',
							color: '#777',
						}}
					>
						Feel free to write your ideas!
					</Typography>
				</Stack>

				<div
					style={{
						backgroundColor: '#fff',
						borderRadius: '8px',
						boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
						padding: '16px',
					}}
				>
					<TuiEditor />
				</div>
			</div>
		);
	} else
		return (
			<div id="write-article-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Write an Article</Typography>
						<Typography className="sub-title">Feel free to write your ideas!</Typography>
					</Stack>
				</Stack>
				<TuiEditor />
			</div>
		);
};

export default WriteArticle;
