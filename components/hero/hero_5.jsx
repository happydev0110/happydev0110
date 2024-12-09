import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { hero_5_data } from '../../data/coverflow_data';

const Hero_5 = () => {
	const [userdata, setuserdata] = useState([]);

	const fetchrandomusers = async () => {
		let params = {
			is_popular: true,
			__skip: 1,
			__limit: 3,

		}
		try {
			const initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
				params
			})
			if (initdata?.data.data != null) {
				const changeArray = (arraydata) => {
					let array1 = [];
					arraydata.forEach((element, id) => {
						if (id === 2) {
							array1[1]['subItem'] = element;
						} else {
							array1.push(element)
						}
					});
					return array1
				}
				setuserdata(changeArray(initdata.data.data.results));
			}
		} catch (error) {
			setuserdata([]);
		}
	}

	useEffect(() => {
		async function fetchData() {
			await fetchrandomusers()
		}
		fetchData()
	}, [])

	const [featureditem, setfeatureditem] = useState([]);

	const getfeatureditems = async () => {
		let initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getfeatureditem`, {
			params: {},
		})
		if (initdata?.data.data != null) {
			setfeatureditem(initdata.data.data.results);
		}
	}

	useEffect(() => {
		getfeatureditems();
	}, []);

	return (
		<>
			{/* <!-- Hero --> */}
			<section className="relative py-20 md:pt-32">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient.jpg" alt="gradient" className="h-full" />
				</picture>
				<picture className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
					<img src="/images/gradient_dark.jpg" alt="gradient dark" className="h-full" />
				</picture>

				<div className="h-full px-6 xl:px-20">
					<div className="grid h-full items-center gap-4 lg:grid-cols-12">
						<div className="col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-5 xl:pl-[20%] xl:pr-[10%]">

							<h1 className="mb-6 text-center font-display text-5xl text-jacarta-700 dark:text-white md:text-left lg:text-5xl xl:text-6xl">
								Collect, Trade & Create Digital Collectibles on NEAR Protocol
							</h1>
							<p className="mb-8 text-center text-lg dark:text-jacarta-200 md:text-left">
								NFT Marketplace On NEAR Protocol
							</p>
							<div className="flex space-x-4">
								<Link href="/create">
									<a className="w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark">
										Upload
									</a>
								</Link>
								<Link href="/explore_collection">
									<a className="w-36 rounded-full bg-white py-3 px-8 text-center font-semibold text-accent shadow-white-volume transition-all hover:bg-accent-dark hover:text-white hover:shadow-accent-volume">
										Explore
									</a>
								</Link>
							</div>
						</div>

						{/* <!-- Hero images --> */}
						<div className="relative col-span-6 xl:col-span-6 xl:col-start-7">
							<img
								src="/images/hero/badge.png"
								className="absolute top-0 z-10 -ml-16 animate-spin-slow md:top-[12%]"
								alt=""
							/>
							<div className="md:flex md:space-x-6 xl:space-x-12">
								{featureditem.length !== 0 && featureditem?.map((item, index) => {
									return (
										<div
											// className={
											// 	index === 0
											// 		? 'mb-6 md:flex md:w-1/2 max-w-[437px] md:items-center'
											// 		: 'space-y-6 md:w-1/2 max-w-[437px] xl:space-y-12'
											// }
											className='space-y-6 md:w-1/2 max-w-[437px] xl:space-y-12'
											key={index}
										>
											<article>
												<div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700 ">
													<figure className="relative">
														<Link href={item?.linkedurl}>
															<a>
																<Image
																	src={item?.itemImg}
																	className="w-full object-cover"
																	height="437"
																	width="406"
																	alt={item?.description}
																/>
															</a>
														</Link>
													</figure>
													<div className="p-6">
														<div className="flex">
															{/* <Link href="/user/avatar_6">
																<a className="shrink-0">
																	<img
																		src={item.banimg_url}
																		alt="avatar"
																		className="mr-4 h-10 w-10 rounded-full"
																	/>
																</a>
															</Link> */}
															<div>
																<Link href={item?.linkedurl}>
																	<a className="block">
																		<span className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
																			{item?.title}
																		</span>
																	</a>
																</Link>
															</div>
														</div>
														<span className='dark:text-jacarta-300 text-sm'>{item?.description}</span>
													</div>
												</div>
											</article>
											{/* 
											{item.subItem &&
												(
														<div className="md:w-3/4" >
															<article>
																<div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
																	<figure className="relative">
																		<Link href={`/collection/${item.subItem.contract_id}`}>
																			<a>
																				<img
																					src={item?.subItem?.bgimg_url}
																					alt="item 1"
																					className="w-full object-cover"
																					height="437"
																					width="406"
																					style={{height:140}}

																				/>
																			</a>
																		</Link>
																	</figure>
																	<div className="p-6">
																		<div className="flex">
																			<Link href="/user/avatar_6">
																				<a className="shrink-0">
																					<img
																						src={item?.subItem?.banimg_url}
																						alt="avatar"
																						className="mr-4 h-10 w-10 rounded-full"
																					/>
																				</a>
																			</Link>
																			<div>
																				<Link href={`/collection/${item?.subItem?.contract_id}`}>
																					<a className="block">
																						<span className="font-display text-sm leading-none text-jacarta-700 hover:text-accent dark:text-white">
																							{item.name}
																						</span>
																					</a>
																				</Link>
																			</div>
																		</div>
																	</div>
																</div>
															</article>
														</div>
													)} */}
										</div>
									);
								})}
								{/* {hero_5_data.map((item, index) => {
									const { id, img, title, authorImage, authorName, subItem } = item;
									const itemLink = img
										.split('/')
										.slice(-1)
										.toString()
										.replace('_2lg.jpg', '')
										.replace('.gif', '');
									return (
										<div
											className={
												index === 0
													? 'mb-6 md:flex md:w-1/2 md:items-center'
													: 'space-y-6 md:w-1/2 xl:space-y-12'
											}
											key={id}
										>
											<article>
												<div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
													<figure className="relative">
														<Link href={`/item/${itemLink}`}>
															<a>
																<img
																	src={img}
																	alt="item 1"
																	className="w-full object-cover"
																	height="437"
																	width="406"
																/>
															</a>
														</Link>
													</figure>
													<div className="p-6">
														<div className="flex">
															<Link href="/user/avatar_6">
																<a className="shrink-0">
																	<img
																		src={authorImage}
																		alt="avatar"
																		className="mr-4 h-10 w-10 rounded-full"
																	/>
																</a>
															</Link>
															<div>
																<Link href={`/item/${itemLink}`}>
																	<a className="block">
																		<span className="font-display text-lg leading-none text-jacarta-700 hover:text-accent dark:text-white">
																			{title}
																		</span>
																	</a>
																</Link>
																<Link href="/user/avatar_6">
																	<a className="text-2xs text-accent">{authorName}</a>
																</Link>
															</div>
														</div>
													</div>
												</div>
											</article>

											{subItem &&
												subItem.map(({ id, img, title, authorImage, authorName }) => {
													const itemLink = img
														.split('/')
														.slice(-1)
														.toString()
														.replace('.jpg', '')
														.replace('.gif', '')
														.replace('_lg', '');
													return (
														<div className="md:w-3/4" key={id}>
															<article>
																<div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
																	<figure className="relative">
																		<Link href={`/item/${itemLink}`}>
																			<a>
																				<img
																					src={img}
																					alt="item 1"
																					className="w-full object-cover"
																					height="437"
																					width="406"
																				/>
																			</a>
																		</Link>
																	</figure>
																	<div className="p-6">
																		<div className="flex">
																			<Link href="/user/avatar_6">
																				<a className="shrink-0">
																					<img
																						src={authorImage}
																						alt="avatar"
																						className="mr-4 h-10 w-10 rounded-full"
																					/>
																				</a>
																			</Link>
																			<div>
																				<Link href={`/item/${itemLink}`}>
																					<a className="block">
																						<span className="font-display text-lg leading-none text-jacarta-700 hover:text-accent dark:text-white">
																							{title}
																						</span>
																					</a>
																				</Link>
																				<Link href="/user/avatar_6">
																					<a className="text-2xs text-accent">{authorName}</a>
																				</Link>
																			</div>
																		</div>
																	</div>
																</div>
															</article>
														</div>
													);
												})}
										</div>
									);
								})} */}
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* <!-- end hero --> */}
		</>
	);
};

export default Hero_5;
