import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import near from '../../lib/near';
import { bidsModalHide } from '../../redux/counterSlice';
import { prettyBalance } from '../../utils/common';

const TransferModal = (props) => {
	const { bidsModal } = useSelector((state) => state.counter);
	const dispatch = useDispatch();
	const [address, setAddress] = useState('');

	const handleAddress = (e) => {
		e.preventDefault();
		setAddress(e.target.value);
	};

	const handleTransfer = async() => {
		const accountExist = await near.doesAccountExist(address);
		if(!accountExist) {
			alert('Account Not Exists')
			return
		}
		props.handleTransfer(address)
	  }

	return (
		<div>
			<div className={props.show ? 'modal fade show block' : 'modal fade'}>
				<div className="modal-dialog max-w-2xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="placeBidLabel">
								List a NFT on the market
							</h5>
							<button type="button" className="btn-close" onClick={() => props.onHide()}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									className="fill-jacarta-700 h-6 w-6 dark:fill-white"
								>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
								</svg>
							</button>
						</div>

						{/* <!-- Body --> */}
						<div className="modal-body p-6">
							<div className="mb-7 flex items-center">
								<span className="font-display text-jacarta-700 text-lg font-semibold dark:text-white">
									{props.title}
								</span>
							</div>

							<div className="dark:border-jacarta-600 border-jacarta-100 relative mb-2 flex items-center overflow-hidden rounded-lg border">
								<input
									type="text"
									className="focus:ring-accent h-12 w-full flex-[3] border-0 focus:ring-inse dark:text-jacarta-700"
									placeholder="Receiver address"
									value={address}
									onChange={(e) => handleAddress(e)}
								/>

								{/* <div className="bg-jacarta-50 border-jacarta-100 flex flex-1 justify-end self-stretch border-l dark:text-jacarta-700">
									<span className="self-center px-2 text-sm">$130.82</span>
								</div> */}
							</div>
						</div>
						{/* <!-- end body --> */}

						<div className="modal-footer">
							<div className="flex items-center justify-center space-x-4">
								<button
									type="button"
									className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
									onClick={()=>handleTransfer()}
								>
									Transfer
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransferModal;
