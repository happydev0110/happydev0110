import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { items_data } from '../../../data/items_data';
import Auctions_dropdown from '../../../components/dropdown/Auctions_dropdown';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import BN from 'bn.js';
import Items_Countdown_timer from '../../../components/items_countdown_timer';
import { ItemsTabs } from '../../../components/component';
import More_items from '../more_items';
import Likes from '../../../components/likes';
import Meta from '../../../components/Meta';
import { useDispatch } from 'react-redux';
import { bidsModalShow } from '../../../redux/counterSlice';
import axios from 'axios';
import { prettyTruncate, prettyBalance } from '../../../utils/common';
import { MdTakeoutDining } from 'react-icons/md';
import { useWalletSelector } from '../../../hooks/WalletSelectorContext';
import near, {amountInYocto, getAmount} from '../../../lib/near'
import { GAS_FEE_150, GAS_FEE_200, STORAGE_ADD_MARKET_FEE, STORAGE_APPROVE_FEE } from '../../../config/constants';
import BidModal from '../../../components/modal/bidsModal'
import CancelModal from '../../../components/modal/cancelModal'
import BuyModal from '../../../components/modal/buyModal'
import ListModal from '../../../components/modal/listModal'
import TransferModal from '../../../components/modal/transferModal'

const Item = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { accountId, modal, selector } = useWalletSelector()

	const [imageModal, setImageModal] = useState(false);

	const collectionId = router.query.item;
	const tokenId = router.query.token;

	const [offermodalShow, setOfferModalShow] = useState(false);
	const [unoffermodalShow, setUnOfferModalShow] = useState(false);
	const [buymodalShow, setBuyModalShow] = useState(false);
    const [listmodalShow, setListModalShow] = useState(false);
    const [delistmodalShow, setDelistModalShow] = useState(false);
    const [transfermodalShow, setTransferModalShow] = useState(false);

	const [token, setToken] = useState(null)
	const [likeCount, setLikeCount] = useState(0)
	const [viewCount, setViewCount] = useState(0)
	const [royalty, setRoyalty] = useState("");

	const getRoyalty = useCallback(async () => {
		if (!token) return
		try {
			const royaltyDataContract = await near.viewFunction({
				methodName: 'nft_payout',
				contractId: token.contract_id,
				args: {
					token_id: token.token_id,
					balance: '100',
					max_len_payout: 7
				}
			})
			const payout = royaltyDataContract.payout;
			const params = (100 - parseFloat(payout[token.owner_id]))//.toFixed(2).toPrecision()
			setRoyalty(params || 10)
		} catch (e) {
			console.log(e)
			setRoyalty("");
		}
	}, [token])


	const getToken = useCallback(async (collection_id, token_id) => {
		try {
			if (!collection_id || !token_id) return
			const resToken = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
				params: {
					collection_id: collection_id,
					token_id: token_id,
				},
			})
			if (resToken.data.data) {
				let res = resToken.data.data.results;
				setToken(res);
				setLikeCount(res.likes ? res.likes : 0);
				setViewCount(res.views ? res.views : 0);
			}
		} catch (error) {
			console.log(error);
			setToken(null);
		}

	}, [collectionId, tokenId]);

	const hasStorageBalance = async () => {
		try {
			const currentStorage = await near.viewFunction({
				methodName: 'storage_balance_of',
				contractId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
				args: { account_id: accountId },
			})

			const supplyPerOwner = await near.viewFunction({
				methodName: 'get_supply_by_owner_id',
				contractId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
				args: { account_id: accountId },
			})

            const usedStorage = new BN(parseInt(supplyPerOwner) + 1).mul( new BN(STORAGE_ADD_MARKET_FEE))

			if (new BN(currentStorage).gte(usedStorage)) {
				return false
			}
			return true
		} catch (err) {
			console.log(err)
		}
	}

	const handleOffer = async(balance) => {
        const wallet = await selector.wallet();
        try{
            const hasDepositStorage = await hasStorageBalance()

            const params = {
				nft_contract_id: token?.contract_id,
				token_id: token?.token_id,
				ft_token_id: 'near',
				price: amountInYocto(balance.toString()),
			}
            if (hasDepositStorage) {
                await wallet.signAndSendTransactions({
                    transactions: [
                      {
                        receiverId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                        actions: [
                          {
                            type: "FunctionCall",
                            params: {
                              methodName: "storage_deposit",
                              args: {},
                              gas: GAS_FEE_150,
                              deposit: getAmount(STORAGE_ADD_MARKET_FEE),
                            },
                          },
                        ],
                      },
                      {
                        receiverId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                        actions: [
                          {
                            type: "FunctionCall",
                            params: {
                              methodName: "add_offer",
                              args: params,
                              gas: GAS_FEE_150,
                              deposit: amountInYocto(balance.toString()),
                            },
                          },
                        ],
                      },
                    ],
                  });
            } else {
                await wallet.signAndSendTransactions({
                    transactions: [
                      {
                        receiverId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                        actions: [
                          {
                            type: "FunctionCall",
                            params: {
                              methodName: "add_offer",
                              args: params,
                              gas: GAS_FEE_150,
                              deposit: amountInYocto(balance.toString()),
                            },
                          },
                        ],
                      },
                    ],
                  });
            }

        } catch(e) {
            console.log(e)
        }
    }

	const handleBuy = async () => {
        const wallet = await selector.wallet();
        try{
            const txs = []
            const params = {
				token_id: token?.token_id,
                nft_contract_id: token?.contract_id,
                ft_token_id: token?.ft_token_id,
                price: token?.price
			}
            txs.push(
                {
                    receiverId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                    actions: [
                        {
                        type: "FunctionCall",
                        params: {
                            methodName: "buy",
                            args: params,
                            gas: GAS_FEE_200,
                            deposit: getAmount(token?.price),
                        },
                        },
                    ],
                }
            )
            
            await wallet.signAndSendTransactions({
                transactions: txs
            });

        } catch(e) {
            console.log(e)
        }
    }

	const handleCancelOffer = async()=>{
        const wallet = await selector.wallet();
        try{
            const txs = []
            const params = {
				token_id: token?.token_id,
                nft_contract_id: token?.contract_id,
			}

            txs.push(
                {
                    receiverId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                    actions: [
                        {
                        type: "FunctionCall",
                        params: {
                            methodName: "delete_offer",
                            args: params,
                            gas: GAS_FEE_200,
                            deposit: '1',
                        },
                        },
                    ],
                }
            )
            
            await wallet.signAndSendTransactions({
                transactions: txs
            });
            

        } catch(e) {
            console.log(e)
        }
    }

	const handleListing = async(balance) => {
        const wallet = await selector.wallet();
        try{
            const hasDepositStorage = await hasStorageBalance()
            const txs = []
            const params = {
				token_id: token?.token_id,
                account_id: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                msg: JSON.stringify({
					price: amountInYocto(balance.toString()),
					market_type: 'sale',
					ft_token_id: `near`,
				}),
			}
            if (hasDepositStorage) {
                txs.push(
                    {
                        receiverId: process.env.NEXT_PUBLIC_MARKET_CONTRACT,
                        actions: [
                          {
                            type: "FunctionCall",
                            params: {
                              methodName: "storage_deposit",
                              args: {},
                              gas: GAS_FEE_150,
                              deposit: getAmount(STORAGE_ADD_MARKET_FEE),
                            },
                          },
                        ],
                      }
                )
            }

            txs.push(
                {
                    receiverId: token?.contract_id,
                    actions: [
                        {
                        type: "FunctionCall",
                        params: {
                            methodName: "nft_approve",
                            args: params,
                            gas: GAS_FEE_200,
                            deposit: getAmount(STORAGE_APPROVE_FEE),
                        },
                        },
                    ],
                }
            )
            
            await wallet.signAndSendTransactions({
                transactions: txs
            });
            

        } catch(e) {
            console.log(e)
        }

    }

	const handleTransfer =async (account_id) => {
        const wallet = await selector.wallet();
        try{
            const txs = []
            txs.push(
                {
                    receiverId: token?.contract_id,
                    actions: [
                        {
                        type: "FunctionCall",
                        params: {
                            methodName: "nft_transfer",
                            args: {
                                token_id: token?.token_id,
                                receiver_id: account_id
                            },
                            gas: GAS_FEE_200,
                            deposit: '1',
                        },
                        },
                    ],
                }
            )
            
            await wallet.signAndSendTransactions({
                transactions: txs
            });
            

        } catch(e) {
            console.log(e)
        }
    }

	useEffect(() => {
		if (!token) return
		getRoyalty()
	}, [token]);

	useEffect(() => {

		if (!collectionId || !tokenId) return
		getToken(collectionId, tokenId)
	}, [collectionId, tokenId]);

	const image = '/images/products/item_20_square.jpg'
	const handleWalletConnect = (e) => {
		e.preventDefault()
		if (!accountId) {
			modal.show()
			return
		}
	}

	return (
		<>
			<Meta title={`Item Detail || Astromarket`} />
			{/*  <!-- Item --> */}
			<section className="relative lg:mt-24 lg:pt-24 lg:pb-48 mt-24 pt-12 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>
				<div className="container">
					{/* <!-- Item --> */}
					<div className="md:flex md:flex-wrap">
						{/* <!-- Image --> */}
						<figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
							<button className=" w-full" onClick={() => setImageModal(true)}>
								<img src={token?.media_url?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/").replace("https://", "https://ablumgatfr.cloudimg.io/").concat("?width=500") || image} alt='' className="rounded-2xl cursor-pointer  w-full" />
							</button>

							<div className={imageModal ? 'modal fade show block' : 'modal fade'}>
								<div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
									<img src={token?.media_url?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/").replace("https://", "https://ablumgatfr.cloudimg.io/").concat("?width=500") || image} alt='' className="h-full rounded-2xl" />
								</div>

								<button
									type="button"
									className="btn-close absolute top-6 right-6"
									onClick={() => setImageModal(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="24"
										height="24"
										className="h-6 w-6 fill-white"
									>
										<path fill="none" d="M0 0h24v24H0z" />
										<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
									</svg>
								</button>
							</div>
						</figure>

						{/* <!-- Details --> */}
						<div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
							{/* <!-- Collection / Likes / Actions --> */}
							<div className="mb-3 flex">
								{/* <!-- Collection --> */}
								<div className="group flex items-center">
									<Link href={`/collection/${token?.contract_id}`}>
										<a className="group-hover:text-accent mr-2 text-sm font-bold">{token?.contract_name || "Collection"}</a>
									</Link>
									{
										token?.contract_verified ?
											<span
												className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
												data-tippy-content="Verified Collection"
											>
												<Tippy content={<span>Verified Collection</span>}>
													<svg className="icon h-[.875rem] w-[.875rem] fill-white">
														<use xlinkHref="/icons.svg#icon-right-sign"></use>
													</svg>
												</Tippy>
											</span> : <></>
									}
								</div>

								{/* <!-- Likes / Actions --> */}
								<div className="ml-auto flex items-stretch space-x-2 relative">
									<Likes
										like={viewCount}
										classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-2 px-4"
									/>
									<Likes
										like={likeCount}
										classes="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-2 px-4"
									/>

									{/* <!-- Actions --> */}
									{/* <Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white" /> */}
								</div>
							</div>

							<h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
								{token?.metadata?.name || token?.metadata?.title || "Token Name"}
							</h1>

							<div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
								<div className="flex items-center">
									<Tippy content={<span>ETH</span>}>
										<span className="-ml-1">
											<svg className="icon mr-1 h-4 w-4">
												<use xlinkHref="/icons.svg#icon-ETH"></use>
											</svg>
										</span>
									</Tippy>
									<span className="text-green text-sm font-medium tracking-tight">
										Rank
									</span>
								</div>
								<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
									#{token?.rank}
								</span>
							</div>
							<p className="dark:text-jacarta-300 mb-10">{token?.metadata.description || ""}</p>

							{/* <!-- Creator / Owner --> */}
							<div className="mb-8 flex flex-wrap justify-between">
								<div className="mr-8 mb-4 flex">
									{/* <figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={creatorImage}
																alt={creatorname}
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified Collection</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure> */}
									<div className="flex flex-col justify-center">
										<span className="text-jacarta-400 block text-sm dark:text-white">
											<strong>Owned By</strong>
										</span>
										<Link href={`/users/${token?.owner_id}`}>
											<a className="group block">
												<span className="group-hover:text-accent dark:text-jacarta-300 text-sm font-bold">{prettyTruncate(token?.owner_id || "", 16, `address`)}</span>
											</a>
										</Link>
									</div>
								</div>
								<div className="mr-8 mb-4 flex">
									<div className="flex flex-col justify-center">
										<span className="text-jacarta-400 block text-sm dark:text-white">
											<strong>Royalty</strong>
										</span>
										<span className="text-sm dark:text-jacarta-300">{royalty}%</span>
									</div>
								</div>
								<div className="mr-8 mb-4 flex">
									<div className="flex flex-col justify-center">
										<span className="text-jacarta-400 block text-sm dark:text-white">
											<strong>Market Fee</strong>
										</span>
										<span className="text-sm dark:text-jacarta-300">{2}%</span>
									</div>
								</div>
								{/* 	
											<div className="mb-4 flex">
												<figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={ownerImage}
																alt={ownerName}
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified Collection</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure>
												<div className="flex flex-col justify-center">
													<span className="text-jacarta-400 block text-sm dark:text-white">
														Owned by
													</span>
													<Link href="/user/avatar_6">
														<a className="text-accent block">
															<span className="text-sm font-bold">{ownerName}</span>
														</a>
													</Link>
												</div>
											</div> */}
							</div>

							{/* <!-- Bid --> */}
							<div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-4">
								<div className="sm:flex sm:flex-wrap">
									{
										token && token.is_sale?(
											<div className="flex justify-between w-full px-5">
												<div className="flex jsutify-between">
													<h1>Current Price</h1>
													{/* <div>
														<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
															{prettyBalance(token?.price)}
														</span>
														<span>$</span>
														<span>${prettyBalance(new BN(token.price) * store.nearUsdPrice, 24, 4)}</span>
													</div> */}
												</div>
												<div className="flex">
													{/* <figure className="mr-4 shrink-0">
														<Link href="#">
															<a className="relative block">
																<img
																	src="/images/avatars/avatar_4.jpg"
																	alt="avatar"
																	className="rounded-2lg h-12 w-12"
																	loading="lazy"
																/>
															</a>
														</Link>
													</figure> */}
													<div className='flex justify-between'>
														<div className="flex items-center whitespace-nowrap ml-3">
															<Tippy content={<span>NEAR</span>}>
																<span className="-ml-1">
																	<svg className="icon mr-1 h-4 w-4">
																		<use xlinkHref="/icons.svg#icon-ETH"></use>
																	</svg>
																</span>
															</Tippy>
															<span className="text-green text-lg font-medium leading-tight tracking-tight">
																{prettyBalance(token?.price)}<span className='text-white'> NEAR</span>
															</span>
														</div>
														{/* <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
															~10,864.10
														</span> */}
													</div>
												</div>
											</div>
										):(
											<div>
												<span className='dark:text-jacarta-300 text-sm'>Not for Sale</span>
											</div>
										)
									}

									{/* <!-- Countdown --> */}
									{/* <div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 sm:border-l sm:pl-4 lg:pl-8">
										<span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
											Auction ends in
										</span>
										<Items_Countdown_timer time={+636234213} />
									</div> */}
								</div>
							</div>
							<div className='pt-8'>
								{token && accountId ? (
									<>
										{
											token.owner_id === accountId ? (

												<div className="flex justify-center">
													{token.is_sale ? (
														<>
															<div className="grid grid-col-6" >
																<button
																	className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
																	onClick={() => dispatch(bidsModalShow())}
																>
																	detail
																</button>
															</div>
														</>) : (<>
															<div className="grid grid-col-6" >
																<button
																	className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-55 rounded-full py-3 px-8 mx-5 text-center font-semibold text-white transition-all"
																	onClick={() => setListModalShow(true)}
																>
																	List for sale
																</button>
															</div>
															<div className="grid grid-col-6" >
																<button
																	className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
																	onClick={() => setTransferModalShow(true)}
																>
																	Transfer
																</button>
															</div>
														</>)}
												</div>
											) : (
												<>
												<div className='flex justify-center'>
													{token.is_sale && (
														<>
															<div className="grid grid-col-6" >
																<button
																	className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-55 rounded-full py-3 px-8 text-center font-semibold mx-5 text-white transition-all"
																	onClick={() => setBuyModalShow(true)}
																>
																	Buy Now
																</button>
															</div>
														</>
													)}
													{
														token.offers.length > 0 && token.offers.filter(e => e.buyer_id === accountId).length > 0 ? (
															<div className="grid grid-col-6" >
																<button
																	className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-55 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
																	onClick={()=>setUnOfferModalShow(true)}
																>
																	Cancel offer
																</button>
															</div>
														) : (
															<div className="grid grid-col-6" >
																<button
																	className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-55 rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
																	onClick={() => setOfferModalShow(true)}
																>
																	Place an offer
																</button>
															</div>
														)
													}
												</div>
												</>
											)
										}
									</>
								) : (<>
									<div>
										<button
											className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
											onClick={handleWalletConnect}
										>
											Wallet Connect
										</button>
									</div>
								</>)}
							</div>
							{/* <!-- end bid --> */}
						</div>
						{/* <!-- end details --> */}
					</div>
					<ItemsTabs {...token} collectionId={collectionId} tokenId={tokenId} />

					<BidModal 
						show={offermodalShow}
						onHide={() => setOfferModalShow(false)}
						handleOffer={handleOffer}
					/>
					<CancelModal 
						name={token?.metadata?.name || token?.metadata?.title || "Token Name"}
						show={unoffermodalShow}
						onHide={() => setUnOfferModalShow(false)}
						handleCancelOffer={handleCancelOffer}
					/>
					<BuyModal 
						title={token?.metadata?.title || ""}
						token_id={token?.token_id || ""}
						contract_id={token?.contract_id || ""}
						price={token?.price || ""}
						show={buymodalShow}
						onHide={() => setBuyModalShow(false)}
						handleBuy={handleBuy}
					/>
					<ListModal
						title={token?.metadata?.title || ""}
						show={listmodalShow}
						onHide={() => setListModalShow(false)}
						handleList={handleListing}
					/>
					<TransferModal 
						title={token?.metadata?.title || ""}
						show={transfermodalShow}
						onHide={() => setTransferModalShow(false)}
						handleTransfer={handleTransfer}
					/>
				</div>
			</section>
			{/* <!-- end item --> */}

			{/* <More_items /> */}
		</>
	);
};

export default Item;
