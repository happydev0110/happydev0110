import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { collectionCategoryData } from '../../data/collection_data';
import { prettyBalance } from '../categories/common';

const Top_Collections = ({ bgWhite = false }) => {
	const [collectionSelect, SetCollectionSelect] = useState('Today');
    const [visible , setVisible] = useState(12);
    // const [userdata, setuserdata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rankdata, setrankdata] = useState(null);

    const getRankings = async () => {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rankings`, {
        })
        if(res?.data?.data){
            setrankdata(makeData(res?.data?.data));
        }
        setLoading(false);
    }

    const makeData = (data) => {
        let tmparray = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let tmpdata = {
                banimg_url: element.banimg_url,
                contract_id: element.contract_id,
                total_count: element.total_count,
                name: element.name,
            }
            if(element.stats.length > 0){
                tmpdata.total_volumn = element.stats[0].total_volumn;
                tmpdata.floor_price = element.stats[0].floor_price;
                if(element.stats.length === 1){
                    tmpdata.change_1 = 0;
                    tmpdata.change_7 = 0;
                }else{
                    let change_7d;
                    if(parseFloat(element.stats[element.stats.length - 1].total_volumn) === 0)
                        change_7d = 100;
                    else
                        change_7d = parseFloat(element.stats[0].total_volumn) / 
                        parseFloat(element.stats[element.stats.length - 1].total_volumn) * 100;
                    tmpdata.change_7 = change_7d.toFixed(0);
                    let lastDay = element.stats[0].issued_at;
                    let today = new Date();
                    if(today.toISOString().split('T')[0] === lastDay){
                        tmpdata.change_1 = parseFloat(element.stats[0].total_volumn) / 
                        parseFloat(element.stats[1].total_volumn) * 100;
                    }else{
                        tmpdata.change_1 = 0;
                    }
                }
            }else{
                tmpdata.total_volumn = 0;
                tmpdata.floor_price = 0;
                tmpdata.change_1 = 0;
                tmpdata.change_7 = 0;
            }
            tmparray.push(tmpdata);
        }
        tmparray.sort((a, b) => b.total_volumn - a.total_volumn)
        return tmparray
    }

    useEffect(() => {
       	getRankings()
	},[collectionSelect]);

	const title=[{title:'Top Collections'},{title:'Top Sellers'},{title:'Top Buyers'},]

	return (
		<div>
			{/* <!-- Today's Drops / Sellers / Buyers --> */}
			<section className="py-24 relative">
				{/* {bgWhite && (
					<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
						<Image
							src="/images/gradient_light.jpg"
							alt="gradient"
							className="h-full"
							layout="fill"
						/>
					</picture>
				)} */}
				<div className="container">
					<div className="flex flex-col space-y-5 lg:flex-row lg:space-y-0 lg:space-x-7">
						{
							title.map((title_item,title_id) => {
								return(
									<div
										className="dark:bg-jacarta-800  rounded-2.5xl p-8 container"
										key={title_id}
									>
										<h2 className="text-jacarta-700 font-display mb-8 text-center text-3xl font-semibold dark:text-white">
											{title_item.title}
										</h2>
										<div className="space-y-5">
											{!loading && rankdata?.slice(title_id*4,(title_id+1)*4).map((item,id) => {
												return (
													<>
														<div
															key={id}
															className="border-jacarta-100 dark:bg-jacarta-700 rounded-2xl flex border bg-white py-4 px-7 transition-shadow hover:shadow-lg dark:border-transparent"
														>
															<figure className="mr-4 shrink-0">
																<Link href={`/collection/${item.contract_id}`}>
																	<a className="relative block">
																		<img src={item.banimg_url} alt='' className="rounded-2lg h-12 w-12" />
																		<div className="dark:border-jacarta-600 bg-jacarta-700 absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-2/4 items-center justify-center rounded-full border-2 border-white text-xs text-white">
																			{title_id*4+id+1}
																		</div>
																		{/* {icon && (
																			<div
																				className="dark:border-jacarta-600 bg-green absolute -left-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
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
																	</a>
																</Link>
															</figure>
															<div style={{width:'100%'}}>
																<div className='group mt-2 text-sm flex items-center justify-between'>
																	<Link href={`/collection/${item.contract_id}`}>
																		<a className="block">
																			<span className="group-hover:text-accent font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
																				{item.name}
																			</span>
																		</a>
																	</Link>
																	<p className='align-righter'>{prettyBalance(item.total_volumn)}Ⓝ</p>
																</div>
																<div className='mt-2 text-sm flex items-center justify-between'>
																	<span className="dark:text-jacarta-300 text-sm">Floor: {prettyBalance(item.floor_price)}Ⓝ</span>
																	<p>{collectionSelect === 'Today'?'1D':collectionSelect === 'Last 7 days'?'7D':'All'} VOLUME</p>
																</div>
															</div>
														</div>
													</>
												);
											})}
										</div>
										<Link href="/collection/avatar_1">
											<a className="text-accent mt-8 block text-center text-sm font-bold tracking-tight">
												View All Drops
											</a>
										</Link>
									</div>
								)
							})
						}
							{/* );
						})} */}
					</div>
				</div>
			</section>
			{/* <!-- end today's drops / sellers / buyers --> */}
		</div>
	);
};

export default Top_Collections;
