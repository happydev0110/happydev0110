import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from "react-scroll-to-top";

import { prettyTruncate } from '../../utils/common.js'

const TOKENS_PER_PAGE = 20;
const Explore_collection_item = ({ itemFor }) => {
	// const { sortedCollectionData } = useSelector((state) => state.counter);

	// const [itemData, setItemData] = useState([]);

	// const fetchrandomusers = async () => {
	// 	let params = {
	// 		__skip: 0,
	// 		__limit: 40,
	// 	}
	// 	try {
	// 		const initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
	// 			params
	// 		})
	// 		if (initdata?.data.data != null) {
	// 			setItemData(initdata.data.data.results);
	// 		}
	// 	} catch (error) {
	// 		setItemData([]);
	// 	}
	// }

	// useEffect(() => {
	// 	async function fetchData() {
	// 		await fetchrandomusers()
	// 	}
	// 	fetchData()
	// }, [])

	const [collectionSelect, SetCollectionSelect] = useState('All Collections');
	const [query, setQuery] = useState({ page: 0 });
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false); // Can load more tokens

	const [modalShow, setModalShow] = useState(false);

	const getCollections = async (query) => {
		try {
			const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
				params: {
					...query.params,
					__skip: query.page * TOKENS_PER_PAGE,
					__limit: TOKENS_PER_PAGE,
				},
			})

			setCollections(resCollections.data.data.results);

			if (resCollections.data.data.results.length >= TOKENS_PER_PAGE) setHasMore(true);

		} catch (error) {
			console.log(error);
			setCollections([]);
		}
		setLoading(false);

	};

	const fetchMoreCollections = async (query) => {
		try {
			const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
				params: {
					...query.params,
					__skip: (query.page + 1) * TOKENS_PER_PAGE,
					__limit: TOKENS_PER_PAGE,
				},
			})

			const data = await resCollections.data.data.results;

			setQuery({ ...query, page: query.page + 1 });

			if (data.length < TOKENS_PER_PAGE) setHasMore(false);
			const newData = [...collections, ...data]
			setCollections(newData);
		} catch (error) {
			console.log(error);
		}

	};

	useEffect(() => {
		setLoading(true);
		getCollections(query);
	}, [query.params]);

	useEffect(() => {
		if (collectionSelect === "All Collections") {
			setQuery({ page: 0 })
		} else if (collectionSelect === "Newest") {
			setQuery({ page: 0, params: { is_newer: true } })
		} else if (collectionSelect === "Oldest") {
			setQuery({ page: 0, params: { is_older: true } })
		} else if (collectionSelect === "Trending") {
			setQuery({ page: 0, params: { is_trending: true } })
		}

	}, [collectionSelect]);
	
	return (
		<>
			<div className='flex flex-row-reverse'>
				<select className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 min-w-[12rem] rounded-lg py-3 text-sm dark:text-white mb-6" value={collectionSelect} onChange={(evt) => SetCollectionSelect(evt.target.value)}>
					<option value="All Collections">All Collections</option>
					<option value="Newest">Newest</option>
					<option value="Oldest">Oldest</option>
					<option value="Trending">Trending</option>
				</select>
			</div>
			<InfiniteScroll
				dataLength={collections.length}
				next={() => fetchMoreCollections(query)}
				hasMore={hasMore}
				loader={
					collections?.length > 0 ?
						<div className="p-3">Loading...</div> :
						<div className="p-3">No results</div>
				}
				className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4"
				scrollThreshold={0.1}
			>
				{/* <CollectionItem tokens={tokens} /> */}
				{collections.map((item, key) => {
					return (
						<article key={key}>
							<div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
								<Link href={`/collection/${item.contract_id}`}>
									<a className="flex space-x-[0.625rem]">
										<span className="w-[100%]">
											<img
												src={item.bgimg_url.replace("https://", "https://ablumgatfr.cloudimg.io/").concat("?width=500") || imgTop1}
												alt="item 1"
												className="h-40 w-full rounded-[0.625rem] object-cover"
												loading="lazy"
											/>
										</span>
									</a>
								</Link>

								<Link href={`/collection/${item.contract_id}`}>
									<a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
										{item.name}
									</a>
								</Link>

								<div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
									<div className="flex flex-wrap items-center">
										<Link href={`/user/${item.creator_id}`}>
											<a className="mr-2 shrink-0">
												<img src={item.banimg_url} alt="owner" className="h-5 w-5 rounded-full" />
											</a>
										</Link>
										<span className="dark:text-jacarta-400 mr-1">by</span>
										<Link href={`/user/${item.creator_id}`}>
											<a className="text-accent">
												<span>{prettyTruncate(item.creator_id)}</span>
											</a>
										</Link>
									</div>
									<span className="dark:text-jacarta-300 text-sm">{item.total_count} Items</span>
								</div>
							</div>
						</article>
					);
				})}
			</InfiniteScroll>
			<ScrollToTop width={20} height={20} style={{ fontSize: '15px', padding: '10px' }} />
		</>
	);
};

export default Explore_collection_item;
