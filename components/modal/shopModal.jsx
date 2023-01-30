import Link from 'next/link';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BN from 'bn.js';
import { buyModalHide, shopModalhide } from '../../redux/counterSlice';
import { prettyBalance, prettyTruncate } from '../../utils/common';
import { Confirm_checkout } from '../metamask/Metamask';
import useStore from '../../lib/store';
import { cartsActions } from '../../redux/cart';
import { useWalletSelector } from '../../hooks/WalletSelectorContext';
import { GAS_FEE_200 } from '../../config/constants';
import near, { getAmount } from '../../lib/near';

const ShopModal = (props) => {
	const dispatch = useDispatch();
	const store = useStore()
	const myopencarts = useSelector(state => Object.values(state.cart.items));
	const shopModal = useSelector((state) => state.counter.shopModal);
	const { accountId, modal, selector } = useWalletSelector()

	const cartLimit = 25

	const cancelCart = (token_id, contract_id) => {
		let tmparray = myopencarts;
		for (let i = 0; i < myopencarts.length; i++) {
			const element = myopencarts[i];
			if (token_id === element.token_id && contract_id === element.contract_id) {
				tmparray.splice(i, 1);
				dispatch(cartsActions.update(tmparray));
				break;
			}
		}
	}

	const clear = () => {
        dispatch(cartsActions.update([]));
    }

	const handleBuy = async () => {
		if (!accountId) return
		const wallet = await selector.wallet();
		const txs = []
		for (let i = 0; i < myopencarts.length; i++) {
			const element = myopencarts[i];
			const params = {
				token_id: element.token_id,
				nft_contract_id: element.contract_id,
				ft_token_id: "near",
				price: element.price
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
								deposit: getAmount(element.price),
							},
						},
					],
				}
			)
		}

		try {
			await wallet.signAndSendTransactions({
				transactions: txs
			});
		} catch (e) {
			console.log(e)
		}
	}

	const handleWallet = () => {
		modal.show()
	}

	const getTotalPrice = () => {
		let total = 0;
		for (let i = 0; i < myopencarts.length; i++) {
			const element = myopencarts[i];
			let price = parseFloat(element.price) / 10e23;
			total += price;
		}
		let res;
		if (myopencarts.length === 0)
			res = 0;
		else
			res = total.toFixed(2);
		return res;
	}

	return (
		<div>
			{/* <!-- Buy Now Modal --> */}
			{/* <div className={shopModal
				? "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:shadow-2xl show lg:visible lg:opacity-100"
				: "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:shadow-2xl hidden lg:invisible lg:opacity-0"}> */}
			<div className={shopModal ? 'absolute fade show block top-0 right-[1rem]' : 'modal fade'}>
				<div className="modal-dialog max-w-2xl w-96 ">
					<div className="modal-content dark:border-jacarta-600 border">
						<div className="modal-header">
							<div className='flex'>
								<h5 className="modal-title" id="buyNowModalLabel">
									My Cart
								</h5>
								<span className='dark:text-jacarta-300 pl-2 pt-2'>{myopencarts.length} / {cartLimit}</span>
							</div>
							<button type="button" className="btn-close" onClick={() => dispatch(shopModalhide())}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									className="fill-jacarta-700 h-6 w-6 dark:fill-white"
								>
									<path fill="none" d="M0 0h24v24H0z" />
									<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
								</svg>
							</button>
						</div>

						{/* <!-- Body --> */}
						<div className="modal-body p-4 pb-0">
							
							<div className='scrollbar-custom dark:bg-jacarta-700 rounded-3lg dark:border-jacarta-600 border-jacarta-100 w-full max-h-60 h-60 overflow-y-auto'>
								{
									myopencarts.length > 0 && myopencarts.map((data, id) => {
										return (
											<div
												key={id}
												className="border-jacarta-100 dark:bg-jacarta-700 rounded-2xl flex border bg-white py-2 px-4 transition-shadow hover:shadow-lg dark:border-transparent border-t"
											>
												<figure className="mr-4 shrink-0">
													{/* <Link href={`/item/${data.contract_id}/${data.token_id}`}> */}
														<a className="relative block">
															<img src={data.media_url} alt='' className="rounded-2lg h-12 w-12" />
															<div className="dark:border-jacarta-600 bg-jacarta-700 absolute -right-3 top-0 flex h-6 w-6 -translate-y-2/4 items-center justify-center rounded-full border-2 border-white text-xs text-white"
																onClick={() => cancelCart(data.token_id, data.contract_id)}
															>
																{/* {title_id * 4 + id + 1} */}
																<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.41 11.9999L17.71 7.70994C17.8983 7.52164 18.0041 7.26624 18.0041 6.99994C18.0041 6.73364 17.8983 6.47825 17.71 6.28994C17.5217 6.10164 17.2663 5.99585 17 5.99585C16.7337 5.99585 16.4783 6.10164 16.29 6.28994L12 10.5899L7.71 6.28994C7.5217 6.10164 7.2663 5.99585 7 5.99585C6.7337 5.99585 6.4783 6.10164 6.29 6.28994C6.1017 6.47825 5.99591 6.73364 5.99591 6.99994C5.99591 7.26624 6.1017 7.52164 6.29 7.70994L10.59 11.9999L6.29 16.2899C6.19627 16.3829 6.12188 16.4935 6.07111 16.6154C6.02034 16.7372 5.9942 16.8679 5.9942 16.9999C5.9942 17.132 6.02034 17.2627 6.07111 17.3845C6.12188 17.5064 6.19627 17.617 6.29 17.7099C6.38296 17.8037 6.49356 17.8781 6.61542 17.9288C6.73728 17.9796 6.86799 18.0057 7 18.0057C7.13201 18.0057 7.26272 17.9796 7.38458 17.9288C7.50644 17.8781 7.61704 17.8037 7.71 17.7099L12 13.4099L16.29 17.7099C16.383 17.8037 16.4936 17.8781 16.6154 17.9288C16.7373 17.9796 16.868 18.0057 17 18.0057C17.132 18.0057 17.2627 17.9796 17.3846 17.9288C17.5064 17.8781 17.617 17.8037 17.71 17.7099C17.8037 17.617 17.8781 17.5064 17.9289 17.3845C17.9797 17.2627 18.0058 17.132 18.0058 16.9999C18.0058 16.8679 17.9797 16.7372 17.9289 16.6154C17.8781 16.4935 17.8037 16.3829 17.71 16.2899L13.41 11.9999Z" fill="#ECEEFA"></path></svg>
															</div>
														</a>
													{/* </Link> */}
												</figure>
												<div style={{ width: '100%' }}>
													<div className='group text-sm flex items-center justify-between'>
														<Link href={`/item/${data.contract_id}/${data.token_id}`}>
															<a className="block">
																<span className="group-hover:text-accent font-display text-jacarta-700 hover:text-accent  font-semibold dark:text-white">
																	{prettyTruncate(data.contract_id, 14, `address`)}
																</span>
															</a>
														</Link>
														<p className='align-righter'>{prettyBalance(data.price)} Ⓝ</p>
													</div>
													<div className='mt-2 text-sm flex items-center justify-between'>
														<span className="dark:text-jacarta-300 text-sm overflow-hidden truncate w-1/2">{data.token_id}</span>
														<p>= ${prettyBalance(new BN(data.price) * store.nearUsdPrice, 24, 2)}</p>
													</div>
												</div>
											</div>
										)
									})
								}
							</div>

							{/* <!-- Total --> */}
							<div className="dark:border-jacarta-600 border-jacarta-100 flex items-center justify-between border-t py-2.5">
								<div className='w-1/2 px-3'>
									<span className="font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
										Your Balance
									</span>
									<div className="ml-auto flex">
										<span className="flex items-center whitespace-nowrap">
											<span data-tippy-content="ETH">
												<svg className="h-4 w-4">
													<use xlinkHref="/icons.svg#icon-ETH"></use>
												</svg>
											</span>
											<span className="text-green font-medium tracking-tight">{prettyBalance(near.currentUser ? near.currentUser.balance.total : "0")} Ⓝ</span>
										</span>
										<div className="dark:text-jacarta-300 text-right">{`= $${prettyBalance(new BN(near.currentUser ? near.currentUser.balance.total : "0") * store.nearUsdPrice, 24, 4)}`}</div>
									</div>
								</div>
								<div className='w-1/2 border-l px-3 dark:border-jacarta-600'>
									<span className="font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
										Your Total
									</span>
									<div className="ml-auto flex">
										<span className="flex items-center whitespace-nowrap">
											<span data-tippy-content="ETH">
												<svg className="h-4 w-4">
													<use xlinkHref="/icons.svg#icon-ETH"></use>
												</svg>
											</span>
											<span className="text-green font-medium tracking-tight">{getTotalPrice()} Ⓝ</span>
										</span>
										<div className="dark:text-jacarta-300 text-right">=$ {prettyBalance(getTotalPrice() * store.nearUsdPrice, 0, 2)}</div>
									</div>
								</div>
							</div>
						</div>
						{/* <!-- end body --> */}

						<div className="modal-footer">
							<div className="flex items-center justify-center">
								{/* {accountId?(
									<button className="btn btn-primary mt-2" onClick={handleBuy} aria-label="Close">Confirm</button>
								):(
									<button className="btn btn-primary mt-2" onClick={handleWallet} aria-label="Close">Connect Wallet</button>
								)} */}
								{
									accountId ? (
										<>
											<button
												type="button"
												className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
												onClick={handleBuy}
											>
												Confirm
											</button>
											<button
												type="button"
												className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all ml-4"
												onClick={()=>clear()}
											>
												Clear
											</button>
											
										</>
									) : (
										<button
											type="button"
											className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
											onClick={handleWallet}
										>
											Connect Wallet
										</button>

									)
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShopModal;
