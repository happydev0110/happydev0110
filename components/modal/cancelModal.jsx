import Link from 'next/link';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { buyModalHide } from '../../redux/counterSlice';
import { Confirm_checkout } from '../metamask/Metamask';

const CancelModal = (props) => {
	const { buyModal } = useSelector((state) => state.counter);
	const dispatch = useDispatch();

	return (
		<div>
			{/* <!-- Buy Now Modal --> */}
			<div className={props.show ? 'modal fade show block' : 'modal fade'}>
				<div className="modal-dialog max-w-2xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="buyNowModalLabel">
								Cancel Offer
							</h5>
							<button type="button" className="btn-close" onClick={() => props.onHide()}>
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
						<div className="modal-body p-6 w-80">
							<div className="mb-2 flex items-center justify-between">
								<span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
									Collection
								</span>
								{/* <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
									Subtotal
								</span> */}
							</div>

							<div className="dark:border-jacarta-600 border-jacarta-100 relative flex items-center border-b py-4">
								<h4>{props.name}</h4>
							</div>

							{/* <!-- Total --> */}
							<div className="dark:border-jacarta-600 border-jacarta-100 mb-2 flex items-center justify-between border-b py-2.5">
								<span className="font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
									Your offer
								</span>
								<div className="ml-auto">
									<span className="flex items-center whitespace-nowrap">
										<span data-tippy-content="ETH">
											<svg className="h-4 w-4">
												<use xlinkHref="/icons.svg#icon-ETH"></use>
											</svg>
										</span>
										<span className="text-green font-medium tracking-tight">{props.price} Ⓝ</span>
										{/* <div className="dark:text-jacarta-300 text-right">$130.82</div> */}
									</span>
								</div>
							</div>

							{/* <!-- Terms --> */}
							{/* <div className="mt-4 flex items-center space-x-2">
								<input
									type="checkbox"
									id="buyNowTerms"
									className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
								/>
								<label htmlFor="buyNowTerms" className="dark:text-jacarta-200 text-sm">
									By checking this box, I agree to {"Xhibiter's"}{' '}
									<Link href="/tarms">
										<a className="text-accent">Terms of Service</a>
									</Link>
								</label>
							</div> */}
						</div>
						{/* <!-- end body --> */}

						<div className="modal-footer">
							<div className="flex items-center justify-center space-x-4">
								<button
									type="button"
									className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
									onClick={() => props.handleCancelOffer()}
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CancelModal;
