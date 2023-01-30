import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OfferTab from './OfferTab';
import Properties from './Properties';
import Activity_tab from './Activity_tab';
import Price_history from './Price_history';
import 'react-tabs/style/react-tabs.css';
import Link from 'next/link';
import BN from 'bn.js';
import { prettyBalance, prettyTruncate } from '../../utils/common';
import { useStore } from 'react-redux';
import { useWalletSelector } from '../../hooks/WalletSelectorContext'

const ItemsTabs = (token) => {
	const [tabsActive, setTabsActive] = useState(1);
	const { accountId, modal, selector } = useWalletSelector()
	const store = useStore()
	const tabsHeadText = [
		{
			id: 1,

			text: 'Attributes',
			icon: 'properties',
		},
		{
			id: 2,
			text: 'Offers',
			icon: 'offers',
		},
		{
			id: 3,
			text: 'History',
			icon: 'details',
		},
	];
	return (
		<>
			<div className="scrollbar-custom mt-14 overflow-x-auto rounded-lg">
				{/* <!-- Tabs Nav --> */}
				<Tabs className="min-w-fit tabs">
					<TabList className="nav nav-tabs flex items-center">
						{/* <!-- Offers --> */}
						{tabsHeadText.map(({ id, text, icon }) => {
							return (
								<Tab className="nav-item bg-transparent" key={id}>
									<button
										className={
											tabsActive === id
												? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
												: 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
										}
										onClick={() => setTabsActive(id)}
									>
										<svg className="icon mr-1 h-5 w-5 fill-current">
											<use xlinkHref={`/icons.svg#icon-${icon}`}></use>
										</svg>
										<span className="font-display text-base font-medium">{text}</span>
									</button>
								</Tab>
							);
						})}
					</TabList>
					<TabPanel>
						<Properties {...token} />
					</TabPanel>
					<TabPanel>
						<div
							role="table"
							className="scrollbar-custom dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 grid max-h-72 w-full grid-cols-3 overflow-y-auto rounded-lg rounded-tl-none border bg-white text-sm dark:text-white"
						>
							{
								token?.offers?.length > 0 ? (
									token.offers.slice(0).reverse().map((item, id) => (
										<div className="contents" role="row" key={id}>
											<div
												className="group dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-4 px-4"
												role="cell"
											>
												<Link href={`/users/${item?.buyer_id}`} className="group">
													<a className="group-hover:text-accent">{prettyTruncate(item?.buyer_id || "", 16, `address`)}</a>
												</Link>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap border-t py-4 px-4"
												role="cell"
											>
												<span className="text-green text-sm font-medium tracking-tight">
													{item.issued_at}
												</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap border-t py-4 px-4"
												role="cell"
											>
												<span className="-ml-1" data-tippy-content="ETH">
													{prettyBalance(item.price)} NEAR
												</span>
												<span className="text-green text-sm font-medium tracking-tight">
													{/*Insert BN  */}
													= ${prettyBalance(new BN(item.price) * store.nearUsdPrice, 24, 4)}
												</span>
												{accountId && accountId === token.owner_id ? (
													<button
														className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 ml-6 text-center font-semibold text-white transition-all"
														onClick={() => { }}
													>
														Accept
													</button>) : (<></>)}
											</div>
										</div>
									))
								) : (
									<div className='dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-3 px-4' >No results</div>
								)
							}
						</div>
					</TabPanel>
					<TabPanel className="tab-content">
						<OfferTab contract_id={token?.collectionId} token_id={token?.tokenId} />
					</TabPanel>
				</Tabs>
			</div>
		</>
	);
};

export default ItemsTabs;
