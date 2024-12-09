import React, { useEffect } from 'react';
import { trendingCategoryData } from '../../data/categories_data';
// import Collection_category_filter from '../collectrions/collection_category_filter';
import CategoryCollectionItem from './categoryCollectionItem';
import { useDispatch } from 'react-redux';
import { updateTrendingCategoryItemData } from '../../redux/counterSlice';
import { useRouter } from 'next/router';

const FilterCategoryItem = (collectionAttributes) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const pid = router.query.collection;

	useEffect(() => {
		dispatch(updateTrendingCategoryItemData(trendingCategoryData.slice(0, 8)));
	}, []);

	return (
		<div>
			{/* <!-- Filter --> */}
			{/* <Collection_category_filter /> */}
			<CategoryCollectionItem contract_id={pid} collectionAttributes={collectionAttributes} />
		</div>
	);
};

export default FilterCategoryItem;
