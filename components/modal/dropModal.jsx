import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dropModalHide } from '../../redux/counterSlice';

const Proparties_modal = () => {
	const { dropModal } = useSelector((state) => state.counter);
	const dispatch = useDispatch();

	const [preview, setPreview] = useState();
	const [profilePhoto, setProfilePhoto] = useState();

	const handleProfilePhoto = (e) => {
		const file = e.target.files[0];
		console.log(file)
		if (file && file.type.substr(0, 5) === 'image') {
			setProfilePhoto(file);
		} else {
			setProfilePhoto(null);
		}
	};

	useEffect(() => {
		if (profilePhoto) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(profilePhoto);
		} else {
			setPreview(null);
		}
	}, [profilePhoto]);
	return (
		<div>
			<div className={dropModal ? 'modal fade show block' : 'modal fade'}>
				<div className="modal-dialog max-w-2xl">
					<div className="modal-content  dark:border-jacarta-600 border">
						<div className="modal-header">
							<h5 className="modal-title" id="addPropertiesLabel">
								create Drop Item
							</h5>
							<button
								type="button"
								className="btn-close"
								onClick={() => dispatch(dropModalHide())}
							>
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
						<div className="modal-body p-6 min-w-[25rem]">
							<div className="flex space-x-5 justify-between">
								<label
									htmlFor="item-name"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Image
								</label>
								<form className="shrink-0">
									<figure className="relative inline-block">
										<Image
											src={preview ? preview : '/images/user/user_avatar.gif'}
											alt="collection avatar"
											className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
											height={140}
											width={140}
										/>
										<div className="group hover:bg-accent border-jacarta-100 absolute -right-3 -bottom-2 h-8 w-8 overflow-hidden rounded-full border bg-white text-center hover:border-transparent">
											<input
												type="file"
												accept="image/*"
												className="absolute top-0 left-0 w-full cursor-pointer opacity-0"
												onChange={(e) => handleProfilePhoto(e)}
											/>
											<div className="flex h-full items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													className="fill-jacarta-400 h-4 w-4 group-hover:fill-white"
												>
													<path fill="none" d="M0 0h24v24H0z" />
													<path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" />
												</svg>
											</div>
										</div>
									</figure>
								</form>
							</div>
							<div className="mb-6">
								<label
									htmlFor="item-name"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Title:
								</label>
								<input
									type="text"
									id="item-name"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									placeholder="Please type title"
									required
								/>
							</div>
							<div className="mb-6">
								<label
									htmlFor="item-name"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Website:
								</label>
								<input
									type="text"
									id="item-name"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									placeholder="Please tye website url"
									required
								/>
							</div>
							<div className="mb-6">
								<label
									htmlFor="item-name"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Twitter
								</label>
								<input
									type="text"
									id="item-name"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									placeholder="Please type twitter"
									required
								/>
							</div>
							<div className="mb-6">
								<label
									htmlFor="item-name"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Discord
								</label>
								<input
									type="text"
									id="item-name"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									placeholder="Please type discord"
									required
								/>
							</div><div className="mb-6">
								<label
									htmlFor="item-name"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Count:
								</label>
								<input
									type="number"
									id="item-name"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									placeholder="Enter number"
									required
								/>
							</div>
							<div className="mb-6">
								<label
									htmlFor="item-description"
									className="font-display text-jacarta-700 mb-2 block dark:text-white"
								>
									Description
								</label>
								<textarea
									id="item-description"
									className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
									rows="4"
									required
									placeholder="Provide a detailed description of your item."
								></textarea>
							</div>
						</div>
						{/* <!-- end body --> */}

						<div className="modal-footer">
							<div className="flex items-center justify-center space-x-4">
								<button
									type="button"
									className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
								>
									Create new drop
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Proparties_modal;
