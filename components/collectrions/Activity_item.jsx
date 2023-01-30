import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from "react-scroll-to-top";
import { collection_activity_item_data } from '../../data/collection_data';
import { parseDateFilter, parseFilter, parseTimeForFilter, prettyBalance, prettyTruncate, unParseFilter } from '../../utils/common'

const defaultPhotoUrl = '/images/avatars/avt-2.jpg';

const Activity_item = () => {
	const [dataFilter, setdataFilter] = useState(
		[
			{
				icon: 'listing',
				name: 'Listings',
				state: false
			},
			{
				icon: 'purchases',
				name: 'Sales',
				state: false
			},
			{
				icon: 'transfer',
				name: 'Transfers',
				state: false
			},
			{
				icon: 'bids',
				name: 'Offers',
				state: false
			},
		]
	)
	const ACTIVITIES_PER_PAGE = 10;

	const [filterVal, setFilterVal] = useState(null);
	const [activities, setactivities] = useState([]);
	const [loading, setloading] = useState(false);
	const [query, setQuery] = useState({ page: 0 });
	const [hasMore, setHasMore] = useState(false); // Can load more tokens
	const [filterdate, setfilterdate] = useState('Last 7 Days');

	const [itemImg, setItemImg] = useState(defaultPhotoUrl)

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	const [data, setData] = useState(collection_activity_item_data);
	const [filterData, setfilterData] = useState(
		collection_activity_item_data.map((item) => {
			const { category } = item;
			return category;
		})
	);

	const [inputText, setInputText] = useState('');

	const handleFilter = (category) => {
		setData(collection_activity_item_data.filter((item) => item.category === category));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const newArray = collection_activity_item_data.filter((item) => {
			return item.title.toLowerCase().includes(inputText);
		});
		setData(newArray);
		setInputText('');
	};

	const hitFilter = async (index) => {
        let tmpdata = dataFilter;
        tmpdata[index].state = !dataFilter[index].state;
        setdataFilter(tmpdata)
        getActivities(tmpdata)
    }
	
	const fetchMoreActivities = async () => {
		try {
			let tmpfilters = []
			for (let i = 0; i < dataFilter.length; i++) {
				if (dataFilter[i].state)
					tmpfilters.push(unParseFilter(dataFilter[i].name))
			}
			if (tmpfilters.length == 0)
				setQuery({ page: 0 })
			if (tmpfilters.length > 0)
				setQuery({ page: 0, params: { filter: tmpfilters.join('||') } })
			const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/activities`, {
				params: {
					...query.params,
					datefilter: parseDateFilter(filterdate),
					__skip: (query.page + 1) * ACTIVITIES_PER_PAGE,
					__limit: ACTIVITIES_PER_PAGE,
				},
			})

			const data = await resCollections.data.data.results;

			setQuery({ ...query, page: query.page + 1 });

			if (data.length < ACTIVITIES_PER_PAGE) setHasMore(false);
			const newData = [...activities, ...data]
			setactivities(newData);
		} catch (error) {
			console.log(error);
		}
	};

	const getActivities = async (tmpdata) => {
		setloading(true);
		let tmpfilters = []
		let tmpfilterdata;
		if (tmpdata)
			tmpfilterdata = tmpdata;
		else
			tmpfilterdata = dataFilter;

		for (let i = 0; i < tmpfilterdata.length; i++) {
			if (tmpfilterdata[i].state)
				tmpfilters.push(unParseFilter(tmpfilterdata[i].name))
		}

		setQuery({ page: 0, params: { filter: tmpfilters.join('||') } })
		let initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/activities`, {
			params: {
				filter: tmpfilters.join('||'),
				datefilter: parseDateFilter(filterdate),
				__skip: 0 * ACTIVITIES_PER_PAGE,
				__limit: ACTIVITIES_PER_PAGE,
			},
		})
		if (initdata?.data.data != null) {
			setactivities(initdata.data.data.results);
			if (initdata.data.data.results.length >= ACTIVITIES_PER_PAGE) setHasMore(true);
		}
		setloading(false);
	}

	const handlechangefiter = (evt) => {
		setfilterdate(evt.target.value)
	}

	useEffect(() => {
		getActivities();
	}, [filterdate]);

	useEffect(() => {
		// if(item.tokens[0].media_url){setItemImg(item.tokens[0].media_url)}
		setfilterData(filterData.filter(onlyUnique));
	}, []);

	return (
		<>
			{/* <!-- Activity Tab --> */}
			<div className="tab-pane fade">
				{/* <!-- Records / Filter --> */}
				<div className="flex md:flex-col lg:flex-row flex-col-reverse">
					{/* <!-- Records --> */}
					<div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
						{!loading && activities.length > 0 && (
							<InfiniteScroll
								dataLength={activities.length}
								next={() => fetchMoreActivities()}
								hasMore={hasMore}
								loader={
									<div className='pl-7 text-align-center'>Loading...</div>
								}
							>
								{activities.map((item, id) => {
									return (
										<div key={id} className="pb-5" >
											<div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl relative flex items-center border bg-white p-8 transition-shadow hover:shadow-lg">
												<figure className="mr-5 self-start">
													<Image
														// src={defaultPhotoUrl}
														src={item?.tokens[0]?.media_url? item.tokens[0].media_url : defaultPhotoUrl}
														alt=''
														height={50}
														width={50}
														objectFit="cover"
														className="rounded-2lg"
														loading="lazy"
													/>
												</figure>
												<div style={{ width: '100%' }}>
													<Link href={`/collection/${item?.contract_id}`}>
														<a>
															<h3 className="group-hover:text-accent font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">
																{prettyTruncate(item?.contract_id, 14, 'address')}
															</h3>
														</a>
													</Link>
													<div className="mt-1 flex items-center justify-between">
														<Link href={`/item/${item?.contract_id}/${item?.token_id}`}>
															<a className="group flex items-center">
																<span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
																	{prettyTruncate(item?.tokens[0]?.metadata.title || '', 16)}
																</span>
															</a>
														</Link>
														<h5>{prettyBalance(item?.price || '')} Ⓝ</h5>
													</div>
													<div className="mt-1 flex items-center justify-between">
														<div>
															<span>from</span>
															<h1 className="dark:text-jacarta-200 block text-sm">{prettyTruncate(item?.from, 10, 'address')}</h1>
														</div>
														<div>
															<span>to</span>
															<h1 className="text-jacarta-300 block text-sm">{prettyTruncate(item?.to, 10, 'address')}</h1>
														</div>
														<div>
															<span>time</span>
															<h1 className="text-jacarta-300 block text-sm">{parseTimeForFilter(item?.issued_at)}</h1>
														</div>
														<div>
															<span>type</span>
															<h1 className="text-jacarta-300 block text-sm">{parseFilter(item?.type)}</h1>
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</InfiniteScroll>
						)}
					</div>
					<ScrollToTop width={20} height={20} style={{ fontSize: '15px', padding: '10px' }} />
					{/* <!-- Filters --> */}
					<aside className="basis-4/12 lg:pl-5">
						<select className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mr-8 min-w-[12rem] rounded-lg py-3 text-sm dark:text-white" value={filterdate} onChange={handlechangefiter.bind(this)}>
							<option value="Last 7 Days">Last 7 Days</option>
							<option value="Last 30 Days">Last 30 Days</option>
							<option value="all-time">All Time</option>
						</select>
						<h3 className="mt-4 font-display text-jacarta-500 mb-4 font-semibold dark:text-white">
							Filters
						</h3>
						<div className="flex flex-wrap">
							{dataFilter.map((item, index) => {
								return (
									<button
										className={
											item.state
												? 'dark:border-jacarta-600 group bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border px-4 py-3 border-transparent text-white dark:border-transparent'
												: 'dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
										}
										key={index}
										onClick={() => hitFilter(index)}
									>
										<svg
											className={
												item.state
													? 'icon mr-2 h-4 w-4 fill-white'
													: 'icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white'
											}
										>
											<use xlinkHref={`/icons.svg#icon-${item.icon}`}></use>
										</svg>
										<span className="text-2xs font-medium capitalize">{item.name}</span>
									</button>
								);
							})}
						</div>
					</aside>
				</div>
			</div>
		</>
	);
};

export default Activity_item;
