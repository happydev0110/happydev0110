
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { prettyTruncate } from '../../utils/common'
import Meta from '../../components/Meta';
import { rankings_data } from '../../data/rankings_data';
import { collectRenkingData } from '../../redux/counterSlice';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useWalletSelector } from '../../hooks/WalletSelectorContext'
import Tippy from '@tippyjs/react';

const DropListItem = ({ is_trending, is_active, admin }) => {
    const { filteredRenkingData } = useSelector((state) => state.counter);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(collectRenkingData(rankings_data));
    }, [dispatch]);

    const TOKENS_PER_PAGE = 10;
    const { accountId, modal } = useWalletSelector()
    // const navigate = useNavigate();
    const store = useStore()
    const [query, setQuery] = useState({ page: 0 });
    const [drops, setDrops] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false); // Can load more tokens
    const [favorInfo, setFavorInfo] = useState(null);
    const [changed, setchanged] = useState(1);
    const [filterstr, setFilterstr] = useState("");
    const [status_up, setstatus_up] = useState(0);
    const [status_proj, setstatus_proj] = useState(0);
    const [status_when, setstatus_when] = useState(0);

    const makeFavorInfo = (data) => {
        let tmparray = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let upvote = element.upvote;
            let cnt = upvote.length;
            let status = upvote.includes(accountId);
            let _id = element._id;
            tmparray.push({ _id, cnt, status })
        }
        return tmparray
    }

    const getDrops = async () => {
        setLoading(true);
        try {
            if (!is_active) {
                setLoading(false);
                return;
            }
            let sort = makeSort();
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/drops`, {
                params: {
                    is_trending: is_trending,
                    __skip: 0,
                    __limit: TOKENS_PER_PAGE,
                    filter: filterstr,
                    sort: sort,
                },
            })
            setQuery({ page: 0 });
            if (res?.data?.data?.results && res.data.data.results.length > 0) {
                setDrops(res.data.data.results);
                setFavorInfo(makeFavorInfo(res.data.data.results));
                if (res.data.data.results.length >= TOKENS_PER_PAGE) setHasMore(true);
            }
        } catch (error) {
            console.log(error);
            setDrops(null);
        }
        setLoading(false);
    };

    const fetchMoreDrops = async (query) => {
        try {
            let sort = makeSort();
            const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/drops`, {
                params: {
                    is_trending: is_trending,
                    __skip: (query.page + 1) * TOKENS_PER_PAGE,
                    __limit: TOKENS_PER_PAGE,
                    filter: filterstr,
                    sort: sort,
                },
            })
            const data = await resCollections.data.data.results;
            if (data && data.length > 0) {
                setQuery({ ...query, page: query.page + 1 });
                if (data.length < TOKENS_PER_PAGE) setHasMore(false);
                const newData = [...drops, ...data]
                setDrops(newData);
                setFavorInfo(makeFavorInfo(newData));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateFavor = async (_id) => {
        if (!accountId) {
            modal.show()
            return;
        }
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/update_drops`, {
            params: {
                is_favor: true,
                accountId: accountId,
                _id: _id
            },
        })
        if (res?.data?.data === 'success') {
            let cnt = res.data.res.cnt;
            let contain = res.data.res.contain;
            let tmparray = favorInfo;
            for (let i = 0; i < favorInfo.length; i++) {
                const element = favorInfo[i];
                if (element._id === _id) {
                    let tmpjson = { _id, cnt, status: contain }
                    tmparray.splice(i, 1, tmpjson);
                    setFavorInfo(tmparray)
                    setchanged(Math.random() / 9 + 1);
                    return;
                }
            }
        }
    }

    // function isValidDate(d) {
    //     return d instanceof Date && !isNaN(d);
    //   }

    const updateChecked = async (status, _id) => {
        if (!accountId) {
            return;
        }
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/update_drops`, {
            params: {
                admin_check: true,
                is_checked: status,
                _id: _id
            },
        })
    }

    const deleteItem = async (_id) => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/delete_drops`, {
            params: {
                _id: _id
            },
        })
        if (res?.data?.data === 'success') {
            let tmparray = drops;
            for (let i = 0; i < drops.length; i++) {
                const element = drops[i];
                if (element._id === _id) {
                    tmparray.splice(i, 1);
                    setDrops(tmparray)
                    setchanged(Math.random() / 9 + 1);
                    return;
                }
            }
        }
    }

    const onClkUp = () => {
        if (admin) return;
        switch (status_up) {
            case 0:
                setstatus_up(1);
                break;
            case 1:
                setstatus_up(2);
                break;
            default:
                setstatus_up(0);
                break;
        }
        setstatus_proj(0);
        setstatus_when(0);
    }

    const onClkProj = () => {
        if (admin) return;
        switch (status_proj) {
            case 0:
                setstatus_proj(1);
                break;
            case 1:
                setstatus_proj(2);
                break;
            default:
                setstatus_proj(0);
                break;
        }
        setstatus_up(0);
        setstatus_when(0);
    }

    // const onClkWhen = () => {
    //     if(admin) return;
    //     switch (status_when) {
    //         case 0:
    //             setstatus_when(1);
    //             break;
    //         case 1:
    //             setstatus_when(2);
    //             break;
    //         default:
    //             setstatus_when(0);
    //             break;
    //     }
    //     setstatus_proj(0);
    //     setstatus_up(0);
    // }

    const makeSort = () => {
        let sort = ""
        if (status_up === 0 && status_proj === 0 && status_when === 0)
            sort = "";
        else if (status_up !== 0) {
            if (status_up === 1)
                sort = "upvote-1"
            else
                sort = "upvote-2"
        }
        else if (status_proj !== 0) {
            if (status_proj === 1)
                sort = "name-1"
            else
                sort = "name-2"
        }
        else if (status_when !== 0) {
            if (status_when === 1)
                sort = "updated_at-1"
            else
                sort = "updated_at-2"
        }
        return sort;
    }

    useEffect(() => {
        //auth
        if (admin) {
            if (!accountId || !store.adminWallet.includes(accountId)) {
                navigate("/");
                return
            }
        }

        getDrops();
    }, [is_trending, is_active, filterstr, status_up, status_proj, status_when, accountId]);

    return (
        <>
            <Meta title="Rankings || Astromarket" />
            {/* <!-- Table --> */}
            <div className="scrollbar-custom overflow-x-auto mt-5">
                <div
                    role="table"
                    className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 lg:rounded-2lg w-full min-w-[736px] border bg-white text-sm dark:text-white"
                >
                    <div className="dark:bg-jacarta-600 bg-jacarta-50 rounded-t-2lg flex" role="row">
                        <div className="w-[8%] py-3 px-4" role="columnheader">
                            <button >
                                <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis" onClick={()=>onClkUp()}>
                                    {
                                        !admin && status_up !== 0 && (
                                            status_up === 1 ?
                                                <i className="fas fa-caret-down"></i>
                                                :
                                                <i className="fas fa-caret-up"></i>
                                        )
                                    }
                                    &nbsp;#Upvotes
                                </span>
                            </button>
                        </div>
                        <div className="w-[24%] py-3 px-4" role="columnheader">
                            <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                                Project Name
                            </span>
                        </div>
                        <div className="w-[12%] py-3 px-4" role="columnheader">
                            <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                                Links
                            </span>
                        </div>
                        <div className="w-[12%] py-3 px-4" role="columnheader">
                            <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                                Count
                            </span>
                        </div>
                        <div className="w-[44%] py-3 px-4" role="columnheader">
                            <span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
                                Description
                            </span>
                        </div>
                    </div>
                    {changed !== 0 && drops?.map((item, index) => {
                        return (
                            <div key={index} className="flex transition-shadow hover:shadow-lg" role="row">
                                {/* <Link href={/user/ + itemLink} key={id}>
                                    <a className="flex transition-shadow hover:shadow-lg" role="row"> */}
                                <div
                                    className="dark:border-jacarta-600 border-jacarta-100 flex w-[8%] items-center border-t py-4 px-4"
                                    role="cell"
                                    onClick={()=>updateFavor(item._id)}
                                >
                                    <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl bg-white py-2 px-4">
                                        {/* <Tippy content={<span>{content?content:'like'}</span>}> */}
                                        <Tippy>
                                            <svg className="icon icon-heart-fill dark:fill-jacarta-200 fill-jacarta-500 hover:fill-red dark:hover:fill-red h-4 w-4">
                                            <use xlinkHref="/icons.svg#icon-hert-fill"></use>
                                            </svg>
                                        </Tippy>
                                        <span className="dark:text-jacarta-200 text-sm">{item.upvote?.length>0 ? favorInfo[index]?.cnt : 0}</span>
                                        </div>
                                </div>    
                                <div
                                    className="dark:border-jacarta-600 border-jacarta-100 flex w-[24%] items-center border-t py-4 px-4"
                                    role="cell"
                                >
                                    <figure className="relative mr-2 w-8 shrink-0 self-start lg:mr-5 lg:w-12">
                                        {
                                            item?.image ?
                                                <Image
                                                    src={item.image}
                                                    alt={prettyTruncate(item?.name, 30)}
                                                    height={32}
                                                    width={32}
                                                    layout="responsive"
                                                    objectFit="contain"
                                                    className="rounded-2lg"
                                                /> :
                                                <Image
                                                    src="/images/avatars/avatar_1.jpg"
                                                    alt={prettyTruncate(item?.name, 30)}
                                                    height={32}
                                                    width={32}
                                                    layout="responsive"
                                                    objectFit="contain"
                                                    className="rounded-2lg"
                                                />
                                        }

                                        {/* {icon && (
                                            <div
                                                className="dark:border-jacarta-600 bg-green absolute -right-2 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                                                data-tippy-content="Verified Collection"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="24"
                                                    height="24"
                                                    className="h-[.875rem] w-[.875rem] fill-white"
                                                >
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                                                </svg>
                                            </div>
                                        )} */}
                                    </figure>
                                    <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
                                        {prettyTruncate(item?.name, 30)}
                                    </span>
                                </div>
                                <div
                                    className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center whitespace-nowrap border-t py-4 px-4"
                                    role="cell"
                                >
                                    <ul className='flex space-x-3 justify-between'>
                                        <li className={`${item.website ? 'text-accent': ''}`} >
                                            <Link href={item.website}>
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group cursor-pointer"
                                                >
                                                    <svg 
                                                        className={`icon  h-5 w-5  ${item.website ? 'fill-accent group-hover:fill-accent dark:group-hover:fill-white': 'fill-jacarta-300'}`}
                                                    >
                                                        <use xlinkHref={`/icons.svg#icon-world`}></use>
                                                    </svg>
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={item.twitter}>
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group cursor-pointer"
                                                >
                                                    <svg className={`icon  h-5 w-5  ${item.website ? 'fill-accent group-hover:fill-accent dark:group-hover:fill-white': 'fill-jacarta-300'}`}>
                                                        <use xlinkHref={`/icons.svg#icon-twitter`}></use>
                                                    </svg>
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={item.discord}>
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group cursor-pointer"
                                                >
                                                    <svg className={`icon  h-5 w-5  ${item.website ? 'fill-accent group-hover:fill-accent dark:group-hover:fill-white': 'fill-jacarta-300'}`}>
                                                        <use xlinkHref={`/icons.svg#icon-discord`}></use>
                                                    </svg>
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div
                                    className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center border-t py-4 px-4"
                                    role="cell"
                                >
                                    <span>{item.count}</span>
                                </div>
                                <div
                                    className="dark:border-jacarta-600 border-jacarta-100 flex w-[44%] items-center border-t py-4 px-4"
                                    role="cell"
                                >
                                    <span>{item.description}</span>
                                </div>
                                {/* <div
                                    className="dark:border-jacarta-600 border-jacarta-100 flex w-[20%] items-center border-t py-4 px-4"
                                    role="cell"
                                >
                                    <span className="-ml-1" data-tippy-content="ETH">
                                        <svg className="icon mr-1 h-4 w-4">
                                            <use xlinkHref="/icons.svg#icon-ETH"></use>
                                        </svg>
                                    </span>
                                    <span className="text-sm font-medium tracking-tight">{price}</span>
                                </div> */}
                                {/* </a>
                                </Link> */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default DropListItem;
