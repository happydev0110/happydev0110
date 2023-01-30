import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
import { prettyTruncate,prettyBalance } from "../../utils/common";

const CategoryItem = ({ creatorId, content }) => {
  const { sortedtrendingCategoryItemData } = useSelector(
    (state) => state.counter
  );
  const dispatch = useDispatch();
  const TOKENS_PER_PAGE = 20;

  // const { accountId, modal, selector } = useWalletSelector()

  // const [modalShow, setModalShow] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [query, setQuery] = useState({ page: 0 });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false); // Can load more tokens
  const [status, setstatus] = useState(0); // Can load more tokens
  const [selectedlist, setselectedlist] = useState([]);
  const [changed, setchanged] = useState(1);
  const [transfermodalShow, setTransferModalShow] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false)

  const handleTransferModal = async () => {
    if (!accountId) {
      modal.show()
      return
    }
    if (!selectedlist.length) return;

    setTransferModalShow(true)
  }

  const handleTransfer = async (account_id) => {
    const wallet = await selector.wallet();
    try {
      const txs = []
      for (const item of selectedlist) {
        txs.push(
          {
            receiverId: item.contract_id,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "nft_transfer",
                  args: {
                    token_id: item.token_id,
                    receiver_id: account_id
                  },
                  gas: GAS_FEE_200,
                  deposit: '1',
                },
              },
            ],
          }
        )
      }


      await wallet.signAndSendTransactions({
        transactions: txs
      });


    } catch (e) {
      console.log(e)
    }
  }

  const isContain = (token_id, contract_id) => {
    let contain = false;
    for (let i = 0; i < selectedlist.length; i++) {
      const element = selectedlist[i];
      if (element.token_id === token_id && element.contract_id === contract_id) {
        contain = true;
        break;
      }
    }
    return contain
  }

  const select = (token_id, contract_id) => {
    let list = selectedlist;
    let contain = false;
    for (let i = 0; i < selectedlist.length; i++) {
      const element = selectedlist[i];
      if (element.token_id === token_id && element.contract_id === contract_id) {
        list.splice(i, 1);
        contain = true;
        break;
      }
    }
    if (!contain) {
      if (selectedlist.length < 25)
        list.push({ token_id, contract_id })
    }
    setselectedlist(list);
    setchanged(Math.random() / 9 + 1);
  }

  const getImg = (token_id) => {
    let imgurl;
    for (let i = 0; i < tokenInfo.length; i++) {
      const element = tokenInfo[i];
      if (element.token_id === token_id) {
        imgurl = element.media_url;
        break;
      }
    }
    return imgurl;
  }

  const cancelAll = () => {
    setselectedlist([]);
    setchanged(Math.random() / 9 + 1);
  }

  const getTokenInfo = async (param) => {
    setLoading(true);
    try {
      if (creatorId === '') return;
      setQuery({ page: 0 });
      let tmpparam;
      if (param) tmpparam = param;
      else tmpparam = { owner_id: creatorId, __skip: 0, __limit: TOKENS_PER_PAGE };
      if (content === 'favorite') tmpparam = { __skip: 0, __limit: TOKENS_PER_PAGE, is_favor: creatorId };
      const tmptokeninfo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tokens`, {
        params: tmpparam
      })

      setTokenInfo(tmptokeninfo.data.data.results);
      if (tmptokeninfo.data.data.results.length >= TOKENS_PER_PAGE) setHasMore(true);
    } catch (error) {
      console.log(error);
      setTokenInfo(null);
    }

    setLoading(false);
  };

  const fetchMoreTokenInfo = async (query) => {
    try {
      if (creatorId === '') return;
      let param = {
        ...query.filters,
        owner_id: creatorId,
        __skip: (query.page + 1) * TOKENS_PER_PAGE,
        __limit: TOKENS_PER_PAGE,
      }
      if (status === 1) param.itemstatus = true;
      if (status === 2) param.is_offer = true;
      if (content === 'favorite') param.is_favor = creatorId;

      const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tokens`, {
        params: param,
      })

      const data = await resCollections.data.data.results;

      setQuery({ ...query, page: query.page + 1 });

      if (data.length < TOKENS_PER_PAGE) setHasMore(false);
      setTokenInfo([...tokenInfo, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRadio = (value) => {
    let param;
    if (value === 1) {
      param = { owner_id: creatorId, __skip: 0, __limit: TOKENS_PER_PAGE, itemstatus: true }
    } else if (value === 2) {
      param = { owner_id: creatorId, __skip: 0, __limit: TOKENS_PER_PAGE, is_offer: true }
    }
    getTokenInfo(param);
    setstatus(value)
  }

  // useEffect(() => {
  //     if(!creatorId) return;
  //     setIsUserValid(accountId === creatorId)
  //     getTokenInfo();
  // }, [creatorId, accountId]);

  useEffect(() => {
    if (!creatorId) return;
    // setIsUserValid(accountId === creatorId)
    getTokenInfo();
  }, [creatorId]);

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {
        tokenInfo?.length==0?<div className="p-3">No results</div>:''
      }
      {tokenInfo?.length>0 && tokenInfo.map((item,id) => {
        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/item/${item.contract_id}/${item.token_id}`}>
                  <a>
                    <img
                      src={item?.media_url?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/") || item?.metadata?.image.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")}
                      alt="item 5"
                      className="w-full h-[230px] rounded-[0.625rem] object-cover"
                    />
                  </a>
                </Link>

                {/* <Likes like={likes} /> */}

                {/* <div className="absolute left-3 -bottom-3">
                  <div className="flex -space-x-2">
                    <Link href={`/item/${itemLink}`}>
                      <a>
                        <Tippy content={<span>creator: {creator.name}</span>}>
                          <img
                            src={creator.image}
                            alt="creator"
                            className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                          />
                        </Tippy>
                      </a>
                    </Link>
                    <Link href={`/item/${itemLink}`}>
                      <a>
                        <Tippy content={<span>creator: {owner.name}</span>}>
                          <img
                            src={owner.image}
                            alt="owner"
                            layout="fill"
                            className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                          />
                        </Tippy>
                      </a>
                    </Link>
                  </div>
                </div> */}
              </figure>
              <div className="mt-2 text-sm flex items-center justify-between">
                <p>
                  {/* {price} */}
                  collection
                </p>
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  {item?.contract_id? prettyTruncate(item.contract_id, 14, 'address') : 'Not Set'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link href={`/item/${item.contract_id}/${item.token_id}`}>
                  <a>
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      {item?.metadata?.name || item?.metadata?.title}
                    </span>
                  </a>
                </Link>
                {/* <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropup hover:bg-jacarta-100 rounded-full" /> */}
              </div>
              <div className="mt-2 text-sm flex items-center justify-between">
                <p>
                  {/* {price} */}
                  price
                </p>
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  {/* {bidCount}/{bidLimit} */}
                  {item?.price? prettyBalance(item.price)+' Near'  : 'Not Listed'}
                </span>
              </div>

              {/* <div className="mt-8 flex items-center justify-between">
                <button
                  className="text-accent font-display text-sm font-semibold"
                  onClick={() => dispatch(buyModalShow())}
                >
                  Buy now
                </button>
                <Link href={`/item/${itemLink}`}>
                  <a className="group flex items-center">
                    <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                      <use xlinkHref="/icons.svg#icon-history"></use>
                    </svg>
                    <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                      View History
                    </span>
                  </a>
                </Link>
              </div> */}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CategoryItem;
