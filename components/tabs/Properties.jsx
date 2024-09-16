import Link from 'next/link';
import React from 'react';
import { items_Properties_data } from '../../data/items_tabs_data';

const Properties = (token) => {
	return (
		<>
			{/* <!-- Properties --> */}
			<div
				className="tab-pane fade"
				id="properties"
				role="tabpanel"
				aria-labelledby="properties-tab"
			>
				<div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-t-2lg rounded-b-2lg rounded-tl-none border bg-white p-6 md:p-10">
					<div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
						{token?.metadata?.attributes.map((item,id) => {
							// const { id, category, product, trait } = item;
							return (
								<Link href="#" key={id}>
									<a className="dark:bg-jacarta-800 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col space-y-2 border p-5 text-center transition-shadow hover:shadow-lg">
										<span className="text-accent text-sm uppercase">{item.trait_type}</span>
										<span className="text-jacarta-700 text-base dark:text-white">{item.value}</span>
										<span className="text-jacarta-400 text-sm">{token.contract_attributes? (parseInt(token.contract_attributes[item.trait_type][item.value]["count"])*100/token.contract_amount).toFixed(2) : 100}% have this trait</span>
									</a>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Properties;
