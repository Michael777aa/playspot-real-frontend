import React, { useMemo, useRef, useState } from 'react';
import { Stack, Button, FormControl, MenuItem, Typography, Select, TextField } from '@mui/material';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const device = useDeviceDetect();
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);

	/** APOLLO REQUESTS **/
	const [createboardArticle] = useMutation(CREATE_BOARD_ARTICLE);

	const memoizedValues = useMemo(() => {
		const articleTitle = '',
			articleContent = '',
			articleImage = '';

		return { articleTitle, articleContent, articleImage };
	}, []);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('=responseImage: ', responseImage);
			memoizedValues.articleImage = responseImage;

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		console.log(e.target.value);
		memoizedValues.articleTitle = e.target.value;
	};

	const handleRegisterButton = async () => {
		try {
			if (!memoizedValues.articleTitle || !editorRef.current?.getInstance().getMarkdown()) {
				alert('Please provide both a title and content for the article.');
				return;
			}

			const articleContent = editorRef.current.getInstance().getMarkdown();
			memoizedValues.articleContent = articleContent;

			const articleData = {
				articleTitle: memoizedValues.articleTitle,
				articleContent: memoizedValues.articleContent,
				articleImage: memoizedValues.articleImage,
				articleCategory,
			};

			const { data } = await createboardArticle({
				variables: {
					input: articleData,
				},
			});

			if (data?.createBoardArticle) {
				alert('Article successfully created!');
				router.push('/community');
			} else {
				alert('Failed to create the article. Please try again.');
			}
		} catch (error) {
			console.error('Error while creating article:', error);
			alert('An error occurred while creating the article.');
		}
	};

	const doDisabledCheck = () => {
		if (memoizedValues.articleContent === '' || memoizedValues.articleTitle === '') {
			return true;
		}
	};
	if (device === 'mobile') {
		return (
			<Stack
				style={{
					padding: '16px',
					backgroundColor: '#f9f9f9',
					minHeight: '100vh',
				}}
			>
				<Stack
					direction="column"
					style={{
						marginBottom: '16px',
						gap: '16px',
					}}
				>
					<Stack component={'div'} style={{ width: '100%' }}>
						<Typography
							style={{
								color: '#7f838d',
								marginBottom: '8px',
								fontSize: '16px',
								fontWeight: 'bold',
							}}
						>
							Category
						</Typography>
						<FormControl
							sx={{
								width: '100%',
								background: 'white',
								borderRadius: '8px',
							}}
						>
							<Select
								value={articleCategory}
								onChange={changeCategoryHandler}
								displayEmpty
								inputProps={{ 'aria-label': 'Without label' }}
								sx={{ fontSize: '14px' }}
							>
								<MenuItem value={BoardArticleCategory.FREE}>Free</MenuItem>
								<MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
								<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
								<MenuItem value={BoardArticleCategory.RECOMMEND}>Recommendation</MenuItem>
							</Select>
						</FormControl>
					</Stack>

					<Stack component={'div'} style={{ width: '100%' }}>
						<Typography
							style={{
								color: '#7f838d',
								marginBottom: '8px',
								fontSize: '16px',
								fontWeight: 'bold',
							}}
						>
							Title
						</Typography>
						<TextField
							onChange={articleTitleHandler}
							id="filled-basic"
							label="Type Title"
							variant="outlined"
							style={{
								width: '100%',
								background: 'white',
								borderRadius: '8px',
							}}
						/>
					</Stack>
				</Stack>

				<Editor
					initialValue={'Type here'}
					placeholder={'Type here'}
					previewStyle={'vertical'}
					height={'400px'}
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const uploadedImageURL = await uploadImage(image);
							callback(uploadedImageURL);
							return false;
						},
					}}
				/>

				<Stack direction="row" justifyContent="center">
					<Button
						variant="contained"
						color="primary"
						style={{
							marginTop: '16px',
							width: '100%',
							maxWidth: '250px',
							height: '45px',
							fontSize: '16px',
							fontWeight: 'bold',
						}}
						onClick={handleRegisterButton}
					>
						Register
					</Button>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack>
				<Stack direction="row" style={{ margin: '40px' }} justifyContent="space-evenly">
					<Stack component={'div'} className={'form_row'} style={{ width: '300px' }}>
						<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
							Category
						</Typography>
						<FormControl sx={{ width: '100%', background: 'white' }}>
							<Select
								value={articleCategory}
								onChange={changeCategoryHandler}
								displayEmpty
								inputProps={{ 'aria-label': 'Without label' }}
							>
								<MenuItem value={BoardArticleCategory.FREE}>
									<span>Free</span>
								</MenuItem>
								<MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
								<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
								<MenuItem value={BoardArticleCategory.RECOMMEND}>Recommendation</MenuItem>
							</Select>
						</FormControl>
					</Stack>
					<Stack component={'div'} style={{ width: '300px', flexDirection: 'column' }}>
						<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
							Title
						</Typography>
						<TextField
							onChange={articleTitleHandler}
							id="filled-basic"
							label="Type Title"
							style={{ width: '300px', background: 'white' }}
						/>
					</Stack>
				</Stack>

				<Editor
					initialValue={'Type here'}
					placeholder={'Type here'}
					previewStyle={'vertical'}
					height={'640px'}
					// @ts-ignore
					initialEditType={'WYSIWYG'}
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const uploadedImageURL = await uploadImage(image);
							callback(uploadedImageURL);
							return false;
						},
					}}
					events={{
						load: function (param: any) {},
					}}
				/>

				<Stack direction="row" justifyContent="center">
					<Button
						variant="contained"
						color="primary"
						style={{ margin: '30px', width: '250px', height: '45px' }}
						onClick={handleRegisterButton}
					>
						Register
					</Button>
				</Stack>
			</Stack>
		);
	}
};

export default TuiEditor;
