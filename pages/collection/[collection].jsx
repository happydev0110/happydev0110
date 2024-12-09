import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { collection_item_data } from '../../data/collection_data';
import Auctions_dropdown from '../../components/dropdown/Auctions_dropdown';
import Social_dropdown from '../../components/dropdown/Social_dropdown';
import Collection_items from '../../components/collectrions/Collection_items';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import Meta from '../../components/Meta';
import { averageBalance, prettyBalance } from '../../utils/common';

const Collection = () => {
	const [likesImage, setLikesImage] = useState(false);
	const [collectionInfo, setCollectionInfo] = useState(null);

	const router = useRouter();
	const pid = router.query.collection;

	const handleLikes = () => {
		if (!likesImage) {
			setLikesImage(true);
		} else {
			setLikesImage(false);
		}
	};

	const getCollectionStats = async (collectionId) => {
		try {
			const resCollectionStat = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collection-stats`, {
				params: {
					nft_contract_id: collectionId
				},
			})
			setCollectionInfo(resCollectionStat.data.data);
		} catch (error) {
			console.error(error);
			setCollectionInfo(null);
		}

	};

	useEffect(() => {
		async function init() {
			await getCollectionStats(pid)
		}

		init()
	}, [pid])

	return (
		<>
			{/* <Meta title={`${pid} || Astromarket`} /> */}
			<Meta title={`Collections || Astromarket`} />
			{collectionInfo !== null && (
				<div className="pt-[5.5rem] lg:pt-24">
					{/* <!-- Banner --> */}
					<div className="relative h-[300px]">
						<Image
							src={collectionInfo?.bgimg_url}
							alt="banner"
							width={1920}
							height={789}
							layout="fill"
							objectFit="cover"
							className="m-auto"
						/>
					</div>
					{/* <!-- end banner --> */}
					<section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
						{/* <!-- Avatar --> */}
						<div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
							<figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white">
								<img
									src={collectionInfo?.banimg_url}
									alt={collectionInfo.name}
									layout="fill"
									objectFit="contain"
									className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
								/>
								{/* <div
									className="dark:border-jacarta-600 bg-green absolute -right-3 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
									data-tippy-content="Verified Collection"
								>
									{icon && (
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
									)}
								</div> */}
							</figure>
						</div>

						<div className="container">
							<div className="text-center">
								<h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
									{collectionInfo.name}
								</h2>
								<div className="mb-8">
									<span className="text-jacarta-400 text-sm font-bold">Created by </span>
									<Link href={`/user/${collectionInfo.creator_id}`}>
										<a className="text-accent text-sm font-bold">{collectionInfo.creator_id}</a>
									</Link>
								</div>

								{/* <div className="dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex flex-wrap items-center justify-center rounded-xl border bg-white">
									{details.map(({ id, detailsNumber, detailsText }) => {
										return (
											<Link href="#" key={id}>
												<a className="dark:border-jacarta-600 border-jacarta-100 w-1/2 rounded-l-xl border-r py-4 hover:shadow-md sm:w-32">
													<div className="text-jacarta-700 mb-1 text-base font-bold dark:text-white">
														{detailsNumber}
													</div>
													<div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
														{detailsText}
													</div>
												</a>
											</Link>
										);
									})}
								</div> */}

								<p className="dark:text-jacarta-300 mx-auto max-w-xl text-lg">{collectionInfo.description}</p>

								<div className="mt-6 flex items-center justify-center space-x-2.5 relative">
									<div className="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white">
										{/* <Likes data={} /> */}
										<div
											className="js-likes relative inline-flex h-10 w-10 cursor-pointer items-center justify-center text-sm"
											onClick={() => handleLikes()}
										>
											<button>
												{likesImage ? (
													<svg className="icon dark:fill-jacarta-200 fill-jacarta-500 h-4 w-4">
														<use xlinkHref="/icons.svg#icon-heart-fill"></use>
													</svg>
												) : (
													<svg className="icon dark:fill-jacarta-200 fill-jacarta-500 h-4 w-4">
														<use xlinkHref="/icons.svg#icon-heart"></use>
													</svg>
												)}
											</button>
										</div>
									</div>

									<Social_dropdown />

									<Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white relative" />
								</div>
							</div>
							<div className='grid grid-cols-2 gap-[1.875rem] md:grid-cols-3 lg:grid-cols-6 flex justify-between px-20 pt-10'>
								<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Floor Price</span>
									<span className="text-jacarta-700 text-base dark:text-white pt-5">{prettyBalance(collectionInfo?.floor_price || '')} Ⓝ</span>
								</div>
								<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Total Volume</span>
									<span className="text-jacarta-700 text-base dark:text-white pt-5">{prettyBalance(collectionInfo?.volume || '')} Ⓝ</span>
								</div>
								<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Total items</span>
									<span className="text-jacarta-700 text-base dark:text-white pt-5">{collectionInfo?.total_count || '---'}</span>
								</div>
								<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Listed Amount</span>
									<span className="text-jacarta-700 text-base dark:text-white">{(collectionInfo?.sale_items?.length || '0')}</span>
								</div>
								<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Avg Sale Price(24hr)</span>
									<span className="text-jacarta-700 text-base dark:text-white">{(averageBalance(collectionInfo?.avg_price))} Ⓝ</span>
								</div>
								<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 text-center transition-shadow hover:shadow-lg">
									<span className="text-accent text-sm uppercase">Unique Holders</span>
									<span className="text-jacarta-700 text-base dark:text-white">{(collectionInfo?.owners?.length || '0')}</span>
								</div>
							</div>
						</div>
					</section>
				</div>
			)}
			<Collection_items collectionAttributes={collectionInfo?.attributes}/>
		</>
	);
};

export default Collection;
