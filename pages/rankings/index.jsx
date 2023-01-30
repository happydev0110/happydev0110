import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Recently_added_dropdown from '../../components/dropdown/recently_added_dropdown';
import Head from 'next/head';
import Meta from '../../components/Meta';
import { useSelector, useDispatch, useStore } from 'react-redux';
import {prettyBalance} from "../../utils/common"

const Index = () => {
	const { filteredRenkingData } = useSelector((state) => state.counter);
	const [rankdata, setrankdata] = useState(null);
	const [loading, setLoading] = useState(false);
	const [searchStr , setsearchStr] = useState('');
	const [totalMarketCap, setTotalMarketCap] = useState(0)
	const [volume_7d, setVolume_7d] = useState(0)
	const [visible , setVisible] = useState(6);

	const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 3);
    }
	const dispatch = useDispatch();
	const store = useStore()

	const categoryText = [
		{
			id: 1,
			text: 'All',
		},
		{
			id: 2,
			text: 'Art',
		},
		{
			id: 3,
			text: 'Collectibles',
		},
		{
			id: 4,
			text: 'Domain',
		},
		{
			id: 5,
			text: 'Music',
		},
		{
			id: 6,
			text: 'Photography',
		},
		{
			id: 7,
			text: 'Virtual World',
		},
	];
	const blockchainText = [
		{
			id: 1,
			text: 'Ethereum',
		},
		{
			id: 2,
			text: 'Polygon',
		},
		{
			id: 3,
			text: 'Flow',
		},
		{
			id: 4,
			text: 'Tezos',
		},
	];
	const last7DaysRanks = [
		{
			id: 1,
			text: 'Last 7 Days',
		},
		{
			id: 2,
			text: 'Last 14 Days',
		},
		{
			id: 3,
			text: 'Last 30 Days',
		},
		{
			id: 4,
			text: 'Last 60 Days',
		},
		{
			id: 5,
			text: 'Last 90 Days',
		},
		{
			id: 6,
			text: 'Last Year',
		},
		{
			id: 7,
			text: 'All Time',
		},
	];

	const getRankings = async () => {
		setLoading(true);
		const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rankings`, {
			params: {
				filter: searchStr,
			},
		})
		if (res?.data?.data) {
			setrankdata(makeData(res?.data?.data));
		}
		setLoading(false);
	}

	const makeData = (data) => {
		let tmparray = [];
		let tmpTotalMarket = 0
		let tmpChange = 0
		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			let tmpdata = {
				banimg_url: element.banimg_url,
				contract_id: element.contract_id,
				total_count: element.total_count,
				name: element.name,
				sale_items: []
			}
			if (element.stats.length > 0) {
				// tmpdata.total_volumn = element.stats[0].total_volumn;
				tmpdata.total_volumn = element.stats[0].floor_price * element.total_count;
				tmpdata.floor_price = element.stats[0].floor_price;
				tmpdata.sale_items = element.stats[0]?.sale_items || [];
				if (element.stats.length === 1) {
					tmpdata.change_1 = 0;
					tmpdata.change_7 = 0;
				} else {
					let change_7d;
					if (parseFloat(element.stats[element.stats.length - 1].total_volumn) === 0)
						change_7d = 0;
					else
						change_7d = parseFloat(element.stats[0].total_volumn) /
							parseFloat(element.stats[element.stats.length - 1].total_volumn) * 100;
					tmpdata.change_7 = change_7d.toFixed(0);
					let lastDay = element.stats[0].issued_at;
					let today = new Date();
					if (today.toISOString().split('T')[0] === lastDay) {
						tmpdata.change_1 = parseFloat(element.stats[0].total_volumn) /
							parseFloat(element.stats[1].total_volumn) * 100;
					} else {
						tmpdata.change_1 = 0;
					}
				}
			} else {
				tmpdata.total_volumn = 0;
				tmpdata.floor_price = 0;
				tmpdata.change_1 = 0;
				tmpdata.change_7 = 0;
			}
			tmpTotalMarket += tmpdata.total_volumn
			tmpChange += tmpdata.change_7
			tmparray.push(tmpdata);
		}
		tmparray = tmparray.sort((a, b) => b.total_volumn - a.total_volumn)
		setTotalMarketCap(tmpTotalMarket)
		setVolume_7d(tmpChange)
		return tmparray
	}

	useEffect(() => {
		getRankings();
	}, [searchStr]);

	return (
		<>
			<Meta title="Rankings || Astromarket" />
			{/* <!-- Rankings --> */}
			<section className="relative lg:mt-24 lg:pb-24 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<Image
						src="/images/gradient_light.jpg"
						layout="fill"
						alt="gradient"
						className="h-full w-full"
					/>
				</picture>
				<div className="container">
					<h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
						Rankings
					</h1>
					<div className='lg:flex justify-between'>
						<div className='flex flex-row'> 
							<div className='w-50 pr-4 pb-5'> 
								<a className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border p-5 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Total Market Cap</span>
									<div className='flex justify-between px-6'>
										<span className="text-jacarta-700 text-base dark:text-white">{prettyBalance(totalMarketCap * store.nearUsdPrice)}Ⓝ</span>
										<span className="text-jacarta-400 text-sm">0%</span>
									</div>
								</a>
							</div>
							<div className='w-50 pr-4 pb-5'> 
								<a className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border p-5 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">7 Day Volume</span>
									<div className='flex justify-between px-6'>
										<span className="text-jacarta-700 text-base dark:text-white">{prettyBalance(totalMarketCap * store.nearUsdPrice)}Ⓝ</span>
										<span className="text-jacarta-400 text-sm">0%</span>
									</div>
								</a>
							</div>
							<div className='w-50 pr-4 pb-5'> 
								<a className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border p-5 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">NEAR/USD</span>
									<div className='flex justify-between px-6'>
										<span className="text-jacarta-700 text-base dark:text-white">${store.nearUsdPrice} &nbsp;</span>
										<span className="text-jacarta-400 text-sm">{store.nearCapInfo?store.nearCapInfo.usd_24h_change>0?(<p className='text-green'><i className={"fas fa-caret-up"}></i> {store.nearCapInfo.usd_24h_change.toFixed(2)}%</p>):(<p className='text-red'><i className={"fas fa-caret-down"}></i> {store.nearCapInfo.usd_24h_change.toFixed(2)}%</p>):""}</span>
									</div>
								</a>
							</div>
						</div>
						{/* <!-- Filters --> */}
						<div className="flex flex-wrap items-end mb-4">
								<input
									type="text"
									placeholder="Collection Name"
									className="dark:bg-jacarta-700 dark:border-jacarta-600 focus:ring-accent border-jacarta-100 w-80 rounded-lg border py-3 px-4 dark:text-white dark:placeholder-jacarta-300"
									onChange={(ev) => setsearchStr(ev.target.value)}
									/>
								{/* <!-- Categories --> */}
								{/* <Recently_added_dropdown data={categoryText} dropdownFor="rankingCategories" /> */}

								{/* <!-- Chains --> */}
								{/* <Recently_added_dropdown data={blockchainText} dropdownFor="blockchain" /> */}
							</div>

							{/* last 7 days */}
							{/* <Recently_added_dropdown data={last7DaysRanks} dropdownFor="last7Days-ranks" /> */}

							{/* <!--  --> */}
					</div>
					{/* <!-- end filters --> */}

					{/* <!-- Table --> */}
					<div className="scrollbar-custom overflow-x-auto">
						<div
							role="table"
							className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 lg:rounded-2lg w-full min-w-[736px] border bg-white text-sm dark:text-white"
						>
							<div className="dark:bg-jacarta-600 bg-jacarta-50 rounded-t-2lg flex" role="row">
								<div className="w-[30%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Name
									</span>
								</div>
								<div className="w-[14%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Market Cap
									</span>
								</div>
								<div className="w-[14%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Floor Price
									</span>
								</div>
								<div className="w-[14%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Floor 24%
									</span>
								</div>
								<div className="w-[14%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Volume(7D)
									</span>
								</div>
								<div className="w-[14%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Listed
									</span>
								</div>
							</div>
							{!loading && rankdata?.slice(0,visible).map((item,index) => {
								return (
									// <Link href="#" key={index}>
									<div key={index}>
										<a className="flex transition-shadow hover:shadow-lg" role="row">
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[30%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className="mr-2 lg:mr-4">{index+1}</span>
												<figure className="relative mr-2 w-8 shrink-0 self-start lg:mr-5 lg:w-12">
													{/* <img src={image} alt={title} className="rounded-2lg" loading="lazy" /> */}
													{
														item.banimg_url? 
														<Image
															src={item.banimg_url}
															alt={item.name}
															height={32}
															width={32}
															layout="responsive"
															objectFit="contain"
															className="rounded-2lg"
														/>:''
													}

													{/* {icon && (
														<div
															className="dark:border-jacarta-600 bg-green absolute -right-2 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
															data-tippy-content="Verified Collection"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																width="24"
																height="24"
																className="h-[.875rem] w-[.875rem] fill-white"
															>
																<path fill="none" d="M0 0h24v24H0z"></path>
																<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
															</svg>
														</div>
													)} */}
												</figure>
												<div className='flex flex-col'>
													<span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
														{item.name}
													</span>
													<span className="font-display text-jacarta-300 text-sm dark:text-white">
														{item.total_count}
													</span>
												</div>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[14%] items-center whitespace-nowrap border-t py-4 px-4"
												role="cell"
											>
												<span className="text-sm font-medium tracking-tight">{prettyBalance(item.total_volumn)}Ⓝ</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[14%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className={`text-${item.floor_price}`}>{prettyBalance(item.floor_price)}Ⓝ</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[14%] items-center border-t py-4 px-4"
												role="cell"
											>
												{/* {item.change_1 < 0 ? */}
													<span className={`text-green`}>{item.change_1}%</span>
												{/* } */}
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[14%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className="text-sm font-medium tracking-tight">{item.change_7}Ⓝ</span>
											</div>
											<div
												className="flex flex-col dark:border-jacarta-600 border-jacarta-100 w-[14%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span>{(item.sale_items.length/item.total_count*100).toFixed(2)} %</span>
												<span>{item.sale_items.length}</span>
											</div>
										</a>
									</div>
									// </Link>
								);
							})}
						</div>
							<div className='flex justify-center py-4'>
							<button
								className='dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
								onClick={showMoreItems}
							>
								{/* <svg
								className=
								'icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white'
								>
								<use xlinkHref={`/icons.svg#icon-listing`}></use>
								</svg> */}
								<span className="text-sm font-medium capitalize">Load More</span>
							</button>
							</div>
					</div>
				</div>
			</section>
			{/* <!-- end rankings --> */}
		</>
	);
};

export default Index;
