
import React, { useState, useEffect } from 'react';
import { rankings_data } from '../../data/rankings_data';
import Meta from '../../components/Meta';
import { collectRenkingData } from '../../redux/counterSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DropListItem from './dropListItem';

const DropTabList = () => {
    const [itemsTabs, setItemsTabs] = useState(1);

    const DropTabList = [
        {
            id: 1,
            text: 'Trending',
            icon: 'items',
        },
        {
            id: 2,
            text: 'All Drops',
            icon: 'activities',
        },
    ];

	return (
		<>
			<Meta title="Rankings || Astromarket" />
            {/* <!-- Table --> */}
            <Tabs className="tabs">
                <TabList className="nav nav-tabs dark:border-jacarta-600 border-jacarta-100 mb-12 flex items-center justify-center border-b">
                    {DropTabList.map(({ id, text, icon }) => {
                        return (
                            <Tab className="nav-item" key={id} onClick={() => setItemsTabs(id)}>
                                <button
                                    className={
                                        itemsTabs === id
                                            ? 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active'
                                            : 'nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white'
                                    }
                                >
                                    <svg className="icon icon-items mr-1 h-5 w-5 fill-current">
                                        <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                                    </svg>
                                    <span className="font-display text-base font-medium">{text}</span>
                                </button>
                            </Tab>
                        );
                    })}
                </TabList>
                <TabPanel>
                    <DropListItem is_active={itemsTabs === 1 ? true: false} is_trending={true} />
                </TabPanel>
                <TabPanel>
                    <DropListItem is_active={itemsTabs === 2 ? true: false} is_trending={false} />
                </TabPanel>
            </Tabs>
		</>
	);
};

export default DropTabList;
