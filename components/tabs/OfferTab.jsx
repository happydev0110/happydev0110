import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
// import { items_offer_data } from '../../data/items_tabs_data';
import axios from 'axios';
import BN from 'bn.js';
import { prettyTruncate, parseFilter, prettyBalance } from '../../utils/common';
import { useStore } from 'react-redux';

const OfferTab = ({contract_id,token_id}) => {
	const [activity, setActivity] = useState([])
	// const [contract_id,setContractId] = useState(null);
	// const [token_id,settokenId] = useState(null);
	// console.log(collectionId,tokenId,'api')
	const store = useStore()
    const getActivities = useCallback(async () => {
        if(!contract_id || !token_id) return;
        try {
            const resActivity = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/activities`, {
                params: {
                    nft_contract_id: contract_id,
                    token_id: token_id
                },
		    })
            setActivity(resActivity.data.data.results);
    
        } catch (error) {
            console.log(error);
            setActivity([]);
        }
    },[contract_id, token_id]);

    useEffect(() => {
        if(!contract_id || !token_id) return;
        getActivities();
    }, [contract_id, token_id]);

	return (
		<>
			{/* <!-- Offers --> */}
			<div
				className="tab-pane fade show active"
				id="offers"
				role="tabpanel"
				aria-labelledby="offers-tab"
			>
				<div
					role="table"
					className="scrollbar-custom dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 grid max-h-72 w-full grid-cols-4 overflow-y-auto rounded-lg rounded-tl-none border bg-white text-sm dark:text-white"
				>
					<div className="contents" role="row">
						<div
							className="dark:bg-jacarta-600 bg-light-base sticky top-0 py-2 px-4"
							role="columnheader"
						>
							<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
								From
							</span>
						</div>
						<div
							className="dark:bg-jacarta-600 bg-light-base sticky top-0 py-2 px-4"
							role="columnheader"
						>
							<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
								To
							</span>
						</div>
						<div
							className="dark:bg-jacarta-600 bg-light-base sticky top-0 py-2 px-4"
							role="columnheader"
						>
							<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
								Type/Time
							</span>
						</div>
						<div
							className="dark:bg-jacarta-600 bg-light-base sticky top-0 py-2 px-4"
							role="columnheader"
						>
							<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
								Price
							</span>
						</div>
						{/* <div
							className="dark:bg-jacarta-600 bg-light-base sticky top-0 py-2 px-4"
							role="columnheader"
						>
							<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
								From
							</span>
						</div> */}
					</div>
					{activity.length ==0 || !activity?(<div className='py-3 pl-5' role="row">No results</div>):<></>}
					{activity.length>0&&activity.map((item, id) => {
						return (
							<div className="contents" role="row" key={id}>
								<div
									className="group dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-4 px-4"
									role="cell"
								>
									<Link href={`/collection/${item.from}`}>
										<a className="group-hover:text-accent">{prettyTruncate(item.from, 16, 'address')}</a>
									</Link>
								</div>
								<div
									className="group dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-4 px-4"
									role="cell"
								>
									{
										item.to?
										(<Link href={`/collection/${item.to}`}>
											<a className="group-hover:text-accent">{prettyTruncate(item.from, 16, 'address')}</a>
										</Link>):(<></>)
									}
								</div>
								<div
									className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap border-t py-4 px-4"
									role="cell"
								>
									<span className="-ml-1" data-tippy-content="ETH">
										{/* <svg className="icon mr-1 h-4 w-4">
											<use xlinkHref="/icons.svg#icon-ETH"></use>
										</svg> */}
										{parseFilter(item.type)}
									</span>
									<span className="text-green text-sm font-medium tracking-tight">
										{item.issued_at}
									</span>
								</div>
								<div
									className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap border-t py-4 px-4"
									role="cell"
								>
									<span className="-ml-1" data-tippy-content="ETH">
										{/* <svg className="icon mr-1 h-4 w-4">
											<use xlinkHref="/icons.svg#icon-ETH"></use>
										</svg> */}
										{item.price?prettyBalance(item.price)+" NEAR":""}
									</span>
									<span className="text-green text-sm font-medium tracking-tight">
										{/*Insert BN  */}
										{/* {item.price?`= $${prettyBalance(item.price)}`:""} */}
										{item.price?`= $${prettyBalance(new BN(item.price) * store.nearUsdPrice, 24, 4)}`:""}
									</span>
								</div>
								{/* <div
									className="dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-4 px-4"
									role="cell"
								>
									{usdPrice}
								</div>
								<div
									className="dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-4 px-4"
									role="cell"
								>
									{difference} below
								</div> */}
								{/* <div
									className="dark:border-jacarta-600 border-jacarta-100 flex items-center border-t py-4 px-4"
									role="cell"
								>
									in {Expiration} months
								</div> */}
								
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default OfferTab;
