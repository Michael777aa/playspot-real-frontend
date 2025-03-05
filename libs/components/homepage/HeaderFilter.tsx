import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { facilitySquare } from '../../config';
import { FacilityLocation, FacilityType } from '../../enums/facility.enum';
import { FacilitiesInquiry } from '../../types/facility/facility.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: FacilitiesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<FacilitiesInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const balconiesRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openRooms, setOpenRooms] = useState(false);
	const [facilityTypes, setfacilityTypes] = useState<FacilityType[]>(Object.values(FacilityType));
	const [facilityLocations, setFacilityLocations] = useState<FacilityLocation[]>(Object.values(FacilityLocation));
	const [yearCheck, setYearCheck] = useState({ start: 1970, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');

	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!balconiesRef?.current?.contains(event.target)) {
				setOpenRooms(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenRooms(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenRooms(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenRooms(false);
	};

	const roomStateChangeHandler = () => {
		setOpenRooms((prev) => !prev);
		setOpenType(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenRooms(false);
		setOpenType(false);
		setOpenLocation(false);
	};

	const FacilityLocationSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, FacilityLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const facilityTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				roomStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, facilityTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);
	const facilityPriceHandler = useCallback(
		(value: number, type: string) => {
			if (type === 'start') {
				setSearchFilter((prevFilter: any) => ({
					...prevFilter,
					search: {
						...prevFilter.search,
						pricesRange: { ...prevFilter.search.pricesRange, start: value * 1 },
					},
				}));
			} else {
				setSearchFilter((prevFilter: any) => ({
					...prevFilter,
					search: {
						...prevFilter.search,
						pricesRange: { ...prevFilter.search.pricesRange, end: value * 1 },
					},
				}));
			}
		},
		[setSearchFilter],
	);

	const facilityBalconieselectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						balconiesList: [value],
					},
				});
				disableAllStateHandler();
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
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						squaresRange: { ...searchFilter.search.squaresRange, start: parseInt(value) },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						squaresRange: { ...searchFilter.search.squaresRange, end: parseInt(value) },
					},
				});
			}
		},
		[searchFilter],
	);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 1970, end: thisYear });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.balconiesList?.length == 0) {
				delete searchFilter.search.balconiesList;
			}

			await router.push(
				`/facility?input=${JSON.stringify(searchFilter)}`,
				`/facility?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return (
			<>
				<div>Hello world</div>
			</>
		);
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Stack component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Stack>{' '}
						<Stack className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Facility type')} </span>
							<ExpandMoreIcon />
						</Stack>
						<Stack className={`box ${openRooms ? 'on' : ''}`} onClick={roomStateChangeHandler}>
							<span>
								{searchFilter?.search?.balconiesList
									? `${searchFilter?.search?.balconiesList[0]} balconies`
									: t('Balconies')}
							</span>
							<ExpandMoreIcon />
						</Stack>
					</Stack>
					<Stack className={'search-box-other'}>
						<Stack className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Stack>
						<Stack className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Stack>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{facilityLocations.map((location: string) => {
							return (
								<div onClick={() => FacilityLocationSelectHandler(location)} key={location}>
									<img src={`img/banner/cities/${location}.webp`} alt="" />
									<span>{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{facilityTypes.map((type: string) => {
							return (
								<div style={{ cursor: 'pointer' }} onClick={() => facilityTypeSelectHandler(type)} key={type}>
									<span>{type}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-rooms ${openRooms ? 'on' : ''}`} ref={balconiesRef}>
						{[1, 2, 3, 4, 5, 6, 7, 8].map((balcon: number) => {
							return (
								<span onClick={() => facilityBalconieselectHandler(balcon)} key={balcon}>
									{balcon} balcon{balcon > 1 ? 'ies' : ''}
								</span>
							);
						})}
					</div>
				</Stack>

				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Stack sx={style}>
						<Stack className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>{t('Find Your Favorite Sport Complex')}</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Price Range</span>

										<Stack className="square-year-input">
											<input
												type="number"
												placeholder="0"
												min={0}
												onChange={(e: any) => {
													if (e.target.value >= 0) {
														facilityPriceHandler(parseInt(e.target.value, 10), 'start');
													}
												}}
											/>
											<div className="central-divider"></div>
											<input
												type="number"
												placeholder="$50000 max"
												min={0}
												onChange={(e: any) => {
													if (e.target.value >= 0) {
														facilityPriceHandler(parseInt(e.target.value, 10), 'end');
													}
												}}
											/>
										</Stack>
									</div>
									<div className={'box'}>
										<span>Area unit</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.squaresRange?.start}
													onChange={(e: any) => facilitySquareHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{facilitySquare.map((square: number) => (
														<MenuItem
															value={square}
															disabled={(searchFilter?.search?.squaresRange?.end || 0) < square}
															key={square}
														>
															{square}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.squaresRange?.end}
													onChange={(e: any) => facilitySquareHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{facilitySquare.map((square: number) => (
														<MenuItem
															value={square}
															disabled={(searchFilter?.search?.squaresRange?.start || 0) > square}
															key={square}
														>
															{square}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={
										<img src={'/img/icons/search.svg'} alt="search-icon" style={{ width: '18px', height: '18px' }} />
									}
									style={{
										backgroundColor: '#1976d2', // Main color, adjust to your primary color
										color: 'white',
										padding: '10px 20px',
										fontSize: '16px',
										fontWeight: 'bold',
										borderRadius: '8px',
										boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
										textTransform: 'none',
										transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
									}}
									onClick={pushSearchHandler}
									onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1565c0')}
									onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
								>
									Search
								</Button>
							</div>
						</Stack>
					</Stack>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 500000,
			},
		},
	},
};

export default HeaderFilter;
