import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { FacilityLocation, FacilityType } from '../../enums/facility.enum';
import { FacilitiesInquiry } from '../../types/facility/facility.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { facilitySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: FacilitiesInquiry;
	setSearchFilter: any;
	initialInput: FacilitiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [facilityLocation, setFacilityLocation] = useState<FacilityLocation[]>(Object.values(FacilityLocation));
	const [facilityType, setfacilityType] = useState<FacilityType[]>(Object.values(FacilityType));
	const [searchText, setSearchText] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			router
				.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.balconiesList?.length == 0) {
			delete searchFilter.search.balconiesList;
			router
				.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const FacilityLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('FacilityLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, FacilityLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const facilityTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('facilityTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, facilityTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const facilityBalconieselectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.balconiesList?.includes(number)) {
						await router.push(
							`/facility?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: searchFilter?.search?.balconiesList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/facility?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: searchFilter?.search?.balconiesList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/facility?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: [...(searchFilter?.search?.balconiesList || []), number],
								},
							})}`,
							`/facility?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									balconiesList: [...(searchFilter?.search?.balconiesList || []), number],
								},
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.balconiesList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/facility?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('facilityBalconieselectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, facilityBalconieselectHandler:', err);
			}
		},
		[searchFilter],
	);

	const facilitySquareHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const facilityPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/facility?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);
	const [filterOpen, setFilterOpen] = useState(false);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/facility?input=${JSON.stringify(initialInput)}`,
				`/facility?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="filter-main"
				style={{
					padding: '10px',
					backgroundColor: '#ffffff',
					borderRadius: '8px',
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				{/* Toggle Button for Filter */}
				<Stack flexDirection={'row'} alignItems={'center'} position={'absolute'} top={0} left={290}>
					<div>Reset </div>
					<Tooltip title="Reset">
						<IconButton onClick={refreshHandler}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</Stack>
				<Button
					onClick={() => setFilterOpen(!filterOpen)}
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						padding: '10px 15px',
						backgroundColor: '#f1f1f1',
						borderRadius: '8px',
						border: 'none',
						boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
						fontSize: '16px',
						fontWeight: '600',
					}}
				>
					Filter Options
					<span style={{ transform: filterOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
				</Button>

				{/* Filter Options - Collapsible */}
				{filterOpen && (
					<Stack style={{ marginTop: '15px', gap: '15px' }}>
						{/* Search Section */}
						<Stack style={{ gap: '10px' }}>
							<Typography style={{ fontSize: '14px', fontWeight: '500' }}>Find Your Sport</Typography>
							<Stack
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
									padding: '10px',
									border: '1px solid #ddd',
									borderRadius: '8px',
									backgroundColor: '#fff',
								}}
							>
								<OutlinedInput
									value={searchText}
									type="text"
									placeholder="Search"
									onChange={(e) => setSearchText(e.target.value)}
									style={{
										flex: 1,
										fontSize: '14px',
										border: 'none',
										outline: 'none',
									}}
								/>
							</Stack>
							<CancelRoundedIcon
								onClick={() => setSearchText('')}
								style={{
									position: 'absolute',
									right: '35px',
									top: '216px',
									cursor: 'pointer',
									color: '#888',
								}}
							/>
						</Stack>

						{/* Location Section */}
						<Stack>
							<Typography style={{ fontSize: '14px', fontWeight: '500' }}>Location</Typography>
							<Stack style={{ maxHeight: '100px', overflowY: 'scroll', gap: '10px' }}>
								{facilityLocation.map((location: string) => (
									<Stack
										key={location}
										direction="row"
										alignItems="center"
										style={{
											padding: '5px 0',
											borderBottom: '1px solid #f1f1f1',
										}}
									>
										<Checkbox
											size="small"
											value={location}
											checked={(searchFilter?.search?.locationList || []).includes(location as FacilityLocation)}
											onChange={FacilityLocationSelectHandler}
										/>
										<Typography style={{ fontSize: '12px', color: '#555' }}>{location}</Typography>
									</Stack>
								))}
							</Stack>
						</Stack>

						{/* Facility Type */}
						<Stack>
							<Typography style={{ fontSize: '14px', fontWeight: '500' }}>Facility Type</Typography>
							<Stack style={{ gap: '10px' }}>
								{facilityType.map((type: string) => (
									<Stack
										key={type}
										direction="row"
										alignItems="center"
										style={{
											padding: '8px',
											backgroundColor: '#f9f9f9',
											borderRadius: '8px',
										}}
									>
										<Checkbox
											size="small"
											value={type}
											onChange={facilityTypeSelectHandler}
											checked={(searchFilter?.search?.typeList || []).includes(type as FacilityType)}
										/>
										<Typography style={{ fontSize: '12px', color: '#555' }}>{type}</Typography>
									</Stack>
								))}
							</Stack>
						</Stack>

						{/* Balconies Section */}
						<Stack>
							<Typography style={{ fontSize: '14px', fontWeight: '500' }}>Balconies</Typography>
							<Stack direction="row" gap="10px">
								{[0, 1, 2, 3, 4, 5].map((num) => (
									<Button
										key={num}
										onClick={() => facilityBalconieselectHandler(num)}
										style={{
											flex: 1,
											padding: '5px',
											fontSize: '12px',
											borderRadius: '8px',
											backgroundColor: searchFilter?.search?.balconiesList?.includes(num) ? '#007bff' : '#f9f9f9',
											color: searchFilter?.search?.balconiesList?.includes(num) ? '#fff' : '#555',
											border: 'none',
										}}
									>
										{num === 0 ? 'Any' : num === 5 ? '5+' : num}
									</Button>
								))}
							</Stack>
						</Stack>

						{/* Area Unit */}
						<Stack>
							<Typography style={{ fontSize: '14px', fontWeight: '500' }}>Area Unit</Typography>
							<Stack
								direction="row"
								alignItems="center"
								style={{
									padding: '10px',
									gap: '10px',
									backgroundColor: '#f9f9f9',
									borderRadius: '8px',
								}}
							>
								<input
									type="number"
									placeholder="Min"
									value={searchFilter?.search?.squaresRange?.start || ''}
									onChange={(e) => facilitySquareHandler(e, 'start')}
									style={{
										flex: 1,
										padding: '5px',
										border: '1px solid #ddd',
										borderRadius: '5px',
										fontSize: '12px',
									}}
								/>
								<span style={{ fontSize: '14px', color: '#555' }}>-</span>
								<input
									type="number"
									placeholder="Max"
									value={searchFilter?.search?.squaresRange?.end || ''}
									onChange={(e) => facilitySquareHandler(e, 'end')}
									style={{
										flex: 1,
										padding: '5px',
										border: '1px solid #ddd',
										borderRadius: '5px',
										fontSize: '12px',
									}}
								/>
							</Stack>
						</Stack>
					</Stack>
				)}
			</Stack>
		);
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Sport</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'Search'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack className="facility-location" style={{ height: '400px' }}>
						{facilityLocation.map((location: string) => (
							<Stack className="input-box" key={location}>
								<Checkbox
									id={location}
									className="facility-checkbox"
									color="default"
									size="small"
									value={location}
									checked={(searchFilter?.search?.locationList || []).includes(location as FacilityLocation)}
									onChange={FacilityLocationSelectHandler}
								/>
								<label className="label">
									<Typography className="facility-type">{location}</Typography>
								</label>{' '}
							</Stack>
						))}{' '}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Facility Type</Typography>
					{facilityType.map((type: string) => (
						<Stack
							className={'input-box'}
							key={type}
							sx={{
								display: 'flex',
								alignItems: 'center',
								backgroundColor: '#f7f7f7',
								padding: '10px 15px',
								borderRadius: '8px',
								boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
								transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
								'&:hover': {
									backgroundColor: '#ececec',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
								},
							}}
						>
							<Checkbox
								id={type}
								className="facility-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={facilityTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as FacilityType)}
								sx={{
									marginRight: '10px',
									'&.Mui-checked': {
										color: '#007bff',
									},
								}}
							/>
							<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<Typography
									className="facility_type"
									sx={{
										fontSize: '14px',
										color: '#333',
										transition: 'color 0.3s ease',
										'&:hover': {
											color: '#000',
										},
									}}
								>
									{type}
								</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Balconies</Typography>
					<Stack
						className="button-group"
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: '5px', // Adds some space between the buttons for better layout
						}}
					>
						<Button
							sx={{
								flex: 1, // Ensures all buttons have equal width
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.balconiesList ? '2px solid #181A20' : '1px solid #b9b9b9',
								backgroundColor: !searchFilter?.search?.balconiesList ? '#f5f5f5' : 'white',
								color: '#181A20',
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: '#e0e0e0',
									borderColor: '#181A20',
								},
							}}
							onClick={() => facilityBalconieselectHandler(0)}
						>
							Any
						</Button>
						{[1, 2, 3, 4].map((num) => (
							<Button
								key={num}
								sx={{
									flex: 1,
									borderRadius: 0,
									border: searchFilter?.search?.balconiesList?.includes(num)
										? '2px solid #181A20'
										: '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.balconiesList?.includes(num) ? undefined : 'none',
									backgroundColor: searchFilter?.search?.balconiesList?.includes(num) ? '#f5f5f5' : 'white',
									color: '#181A20',
									fontWeight: 'bold',
									'&:hover': {
										backgroundColor: '#e0e0e0',
										borderColor: '#181A20',
									},
								}}
								onClick={() => facilityBalconieselectHandler(num)}
							>
								{num}
							</Button>
						))}
						<Button
							sx={{
								flex: 1,
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.balconiesList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
								backgroundColor: searchFilter?.search?.balconiesList?.includes(5) ? '#f5f5f5' : 'white',
								color: '#181A20',
								fontWeight: 'bold',
								'&:hover': {
									backgroundColor: '#e0e0e0',
									borderColor: '#181A20',
								},
							}}
							onClick={() => facilityBalconieselectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Area unit</Typography>
					<Stack
						className="square-year-input"
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '15px', // Adds space between elements for better readability
							backgroundColor: '#f9f9f9', // Light background for contrast
							padding: '10px',
							borderRadius: '8px',
							boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
						}}
					>
						<FormControl
							sx={{
								minWidth: '110px',
								backgroundColor: '#fff',
								borderRadius: '8px',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#ccc', // Default border color
									},
									'&:hover fieldset': {
										borderColor: '#888', // Hover border color
									},
									'&.Mui-focused fieldset': {
										borderColor: '#007bff', // Focus border color
										boxShadow: '0 0 5px rgba(0, 123, 255, 0.3)', // Focus shadow
									},
								},
								'& .MuiSelect-icon': {
									color: '#888', // Icon color
									transition: 'color 0.3s ease',
								},
								'&:hover .MuiSelect-icon': {
									color: '#555',
								},
							}}
						>
							<InputLabel
								id="demo-simple-select-label"
								sx={{
									color: '#717171',
									'&.Mui-focused': {
										color: '#007bff', // Label focus color
									},
								}}
							>
								Min
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => facilitySquareHandler(e, 'start')}
								MenuProps={MenuProps}
								sx={{
									padding: '10px',
									color: '#333',
									'&:focus': {
										backgroundColor: '#f9f9f9',
									},
								}}
							>
								{facilitySquare.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.end || 0) < square}
										key={square}
										sx={{
											'&.Mui-disabled': {
												color: '#bbb',
											},
											'&:hover': {
												backgroundColor: '#e0e0e0',
											},
										}}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<div
							className="central-divider"
							style={{
								width: '5px',
								height: '10px',
								transform: 'rotate(90deg)',
								backgroundColor: '#ccc',
								margin: '0 10px',
							}}
						></div>

						<FormControl
							sx={{
								minWidth: '120px',
								backgroundColor: '#fff',
								borderRadius: '8px',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#ccc',
									},
									'&:hover fieldset': {
										borderColor: '#888',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#007bff',
										boxShadow: '0 0 5px rgba(0, 123, 255, 0.3)',
									},
								},
								'& .MuiSelect-icon': {
									color: '#888',
									transition: 'color 0.3s ease',
								},
								'&:hover .MuiSelect-icon': {
									color: '#555',
								},
							}}
						>
							<InputLabel
								id="demo-simple-select-label"
								sx={{
									color: '#717171',
									'&.Mui-focused': {
										color: '#007bff',
									},
								}}
							>
								Max
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.end ?? 500}
								label="Max"
								onChange={(e: any) => facilitySquareHandler(e, 'end')}
								MenuProps={MenuProps}
								sx={{
									padding: '10px',
									color: '#333',
									'&:focus': {
										backgroundColor: '#f9f9f9',
									},
								}}
							>
								{facilitySquare.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.start || 0) > square}
										key={square}
										sx={{
											'&.Mui-disabled': {
												color: '#bbb',
											},
											'&:hover': {
												backgroundColor: '#e0e0e0',
											},
										}}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack
						className="square-year-input"
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							padding: '10px',
							backgroundColor: '#f9f9f9',
							boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
						}}
					>
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									facilityPriceHandler(e.target.value, 'start');
								}
							}}
							style={{
								flex: 1,
								height: '40px',
								borderRadius: '5px',
								border: '1px solid #ddd',
								padding: '0 10px',
								fontSize: '14px',
								outline: 'none',
								transition: 'border-color 0.3s ease',
							}}
						/>
						<div
							className="central-divider"
							style={{
								width: '2px',
								height: '10px',
								backgroundColor: '#ccc',
								transform: 'rotate(90deg)',
							}}
						></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									facilityPriceHandler(e.target.value, 'end');
								}
							}}
							style={{
								flex: 1,
								height: '40px',
								borderRadius: '5px',
								border: '1px solid #ddd',
								padding: '0 10px',
								fontSize: '14px',
								outline: 'none',
								transition: 'border-color 0.3s ease',
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
