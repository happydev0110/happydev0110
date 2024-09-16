
import React from 'react';
import Meta from '../../components/Meta';
import { dropModalShow } from '../../redux/counterSlice';
import { useDispatch } from 'react-redux';
import DropTabList from '../../components/categories/dropTabList'

const Drop = () => {
	const dispatch = useDispatch()

	return (
		<>
			<Meta title="Rankings || Astromarket" />
			<section className="relative pt-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img
						src="/images/gradient_light.jpg"
						alt="gradient"
						className="h-full w-full"
					/>
				</picture>
				<div className="container">
					<div className="mx-auto max-w-2xl py-16 text-center">
						<h1 className="font-display text-jacarta-700 mb-8 text-4xl font-medium dark:text-white">
							Upcoming Mints
						</h1>
						<p className="dark:text-jacarta-300 text-sm leading-normal">
							View upcoming mints taking place on AstroGen and various launchpads across the NEAR ecosystem.
						</p>
					</div>
					<div className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border px-5 py-3 mx-20 text-center transition-shadow hover:shadow-lg">
						<span className="text-accent text-lg uppercase"><span>&#9888;</span></span>
						<span className="text-jacarta-700 text-base dark:text-white">Projects listed here are not endorsed by AstroMarket. There is no guarantee of listing on AstroMarket post-mint. Project owners are responsible for providing the details.
							Please, always, DYOR before making any cryptocurrency/NFT investment.</span>
					</div>
				</div>
			</section>
			{/* <!-- Drops --> */}
			<section className="relative lg:mt-24">
				<div className="container">
					<button className="hover:bg-accent border-jacarta-100 dark:border-jacarta-600 text-white mt-2 rounded-2lg border-2 py-2 px-8 text-center text-sm font-semibold transition-all" onClick={() => dispatch(dropModalShow())}>
						Add your drop
					</button>
					<DropTabList />
				</div>
			</section>
			{/* <!-- end rankings --> */}
		</>
	);
};

export default Drop;
