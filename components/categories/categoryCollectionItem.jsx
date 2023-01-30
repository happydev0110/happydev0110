import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from "react-scroll-to-top";
import "tippy.js/dist/tippy.css";

import CollectionItem from "./collectionItem";
import CollectionSideBar from "./collectionSideBar";
import { sweepModalShow } from "../../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import { cartsActions } from "../../redux/cart";
import { GAS_FEE_200 } from "../../config/constants";
import { useWalletSelector } from "../../hooks/WalletSelectorContext";
import { getAmount } from "../../lib/near";

const CategoryCollectionItem = ({ contract_id, collectionAttributes }) => {
  const sideData = collectionAttributes;

  const dispatch = useDispatch()
  const [visible, setvisible] = useState(false);
  const [buyfloor, setbuyfloor] = useState(false);
  const myopencarts = useSelector(state => Object.values(state.cart.items));
  const myopencartscnt = useSelector(state => state.cart.itemcnt);
  const { accountId, modal, selector } = useWalletSelector()

  const logsetvisible = (ev) => {
    setvisible(ev)
  }

  const clickOneFilter = (i, j) => {
    if (i >= 0 || j >= 0) {
      clickFilter(i, j, true);
      done();
    }
  }
  const [finished, setfinished] = useState(false);
  const TOKENS_PER_PAGE = 8;
  const [query, setQuery] = useState({ page: 0 });
  const [tokens, setTokens] = useState([]);
  const [hasMore, setHasMore] = useState(false); // Can load more tokens
  const [collectionFilter, setcollectionFilter] = useState({});
  const [on_sale, seton_sale] = useState(false);
  const [on_viewed, seton_viewed] = useState(false);
  const [on_liked, seton_liked] = useState(false);

  const [filterchanged, setfilterchanged] = useState(1);
  const [loading, setLoading] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [changed, setchanged] = useState(1);
  const [traitfilter, settraitfilter] = useState(null);
  const [name, setName] = useState('');

  const [collectionSelect, SetCollectionSelect] = useState('Price: Low To High ')

  const clear = () => {
    let newfilterdata = [];
    Object.entries(sideData).forEach(([key, value]) => {
      let contents = []
      Object.entries(value).forEach(([key1, value1]) => {
        contents.push(0)
      });
      newfilterdata.push(contents)
    });
    setcollectionFilter(newfilterdata)
    setfilterchanged(Math.random() / 9 + 1)
    settraitfilter({ sort: parseSelection(collectionSelect) });
    if (collectionAttributes) {
      if (collectionAttributes.length === 0)
        setfinished(false);
      else
        setfinished(true)
    }
    else setfinished(false);
  }

  const done = (value) => {
    setvisible(false)
    setfilterchanged(Math.random() / 9 + 1)
    let index = 0, index1 = 0;
    let newfilterdata = []
    Object.entries(sideData).forEach(([key, value]) => {
      let singleFilterstr = '';
      index1 = 0;
      Object.entries(value).forEach(([key1, value1]) => {
        singleFilterstr += collectionFilter[index][index1] === 1 ? (singleFilterstr ? "||" + key1 : key1) : "";
        index1++;
      });

      if (singleFilterstr) {
        newfilterdata.push({
          "trait_type": key,
          "value": singleFilterstr,
        });
      }

      index++;
    });
    let sort;
    if (value)
      sort = parseSelection(value);
    else
      sort = parseSelection(collectionSelect);
    settraitfilter({ trait: newfilterdata, name: name, sort: sort, sale: on_sale, view: on_viewed, like: on_liked });
  }

  const clickFilter = (i, j, checked) => {
    let newfilterdata = collectionFilter;
    let topdata = newfilterdata[i]
    topdata.splice(j, 1, checked ? 1 : 0)
    newfilterdata.splice(i, 1, topdata)
    setcollectionFilter(newfilterdata)
    setfilterchanged(Math.random() / 9 + 1)
  }

  // const hitFilter = async (index) => {
  //   let tmpdata = dataFilter;
  //   tmpdata[index].state = !dataFilter[index].state;
  //   setdataFilter(tmpdata)
  //   // getActivities(tmpdata)
  // }

  const getTokens = useCallback(async (query) => {
    try {
      // if(storeChanged) return;
      if (contract_id === '') return;
      // if (state && traitfilter?.like == null) return;
      // if (!isActive) return;
      setLoading(true);
      setQuery({ page: 0 });
      const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tokens`, {
        params: {
          ...query.filters,
          nft_contract_id: contract_id,
          __skip: query.page * TOKENS_PER_PAGE,
          __limit: TOKENS_PER_PAGE,
          trait_filter: traitfilter?.trait,
          name: traitfilter?.name,
          price: traitfilter?.sort.price,
          rank: traitfilter?.sort.rank,
          id: traitfilter?.sort.id,
          itemstatus: traitfilter?.sale,
          is_view: traitfilter?.view,
          is_like: traitfilter?.like
        },
      })
      setTokens(resCollections.data.data.results);

      if (resCollections.data.data.results.length >= TOKENS_PER_PAGE) setHasMore(true);

    } catch (error) {
      console.log(error);
      setTokens([]);
    }
    setLoading(false);
  }, [contract_id, traitfilter]);

  const fetchMoreTokens = async (query) => {
    try {
      if (contract_id === '') return;
      // if (!isActive) return;
      const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tokens`, {
        params: {
          ...query.filters,
          nft_contract_id: contract_id,
          __skip: (query.page + 1) * TOKENS_PER_PAGE,
          __limit: TOKENS_PER_PAGE,
          trait_filter: traitfilter?.trait,
          name: traitfilter?.name,
          price: traitfilter?.sort.price,
          rank: traitfilter?.sort.rank,
          id: traitfilter?.sort.id,
          itemstatus: traitfilter?.sale,
          is_view: traitfilter?.view,
          is_like: traitfilter?.like
        },
      })
      const data = await resCollections.data.data.results;

      setQuery({ ...query, page: query.page + 1 });

      if (data.length < TOKENS_PER_PAGE) setHasMore(false);
      setTokens([...tokens, ...data]);
    } catch (error) {
      console.log(error);
    }

  };
  useEffect(() => {
    getTokens({ page: 0 });
    setCollectionId(contract_id);
  }, [contract_id, traitfilter]);

  const handlechangeselect = (evt) => {
    localStorage.setItem(`${contract_id}-sort`, JSON.stringify(evt.target.value));
    SetCollectionSelect(evt.target.value)
    done(evt.target.value);
  }

  const parseSelection = (str) => {
    if (str && typeof (str) == 'string') {
      let ret, ret2;
      if (str.includes('Low To High')) {
        ret = 1;
      } else {
        ret = -1;
      }
      if (str.includes('Price')) {
        ret2 = { price: ret }
      } else if (str.includes('Rank')) {
        ret2 = { rank: -ret }
      } else if (str.includes('ID')) {
        ret2 = { id: ret }
      }
      return ret2;
    } else
      return {};
  }

  const isContain = (token_id, contract_id) => {
    let contain = false;
    let tmparray = myopencarts;
    for (let i = 0; i < tmparray.length; i++) {
      const element = tmparray[i];
      if (element.token_id === token_id && element.contract_id === contract_id) {
        contain = true;
        break;
      }
    }
    return contain
  }

  const gotobuyfloor = async () => {
    try {
      if (contract_id === '') return
      const resCollections = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tokens`, {
        params: {
          ...query.filters,
          nft_contract_id: contract_id,
          __skip: 0,
          __limit: 1,
          trait_filter: traitfilter?.trait,
          name: traitfilter?.name,
          price: 1,
          itemstatus: true
        },
      })
      let res = resCollections.data.data.results
      if (res && res.length === 0) {
        toast('There is no sale nft!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'foo-bar'
        })
        noitem();
        return;
      }

      handleBuy(res[0])
      //navigation(`/collection/${contract_id}/${res[0].token_id}`)
    } catch (error) {
      console.log(error);
      setTokens([]);
    }
  }

  const handleBuy = async (token) => {
    if (!accountId) {
      modal.show()
      return
    }
    const wallet = await selector.wallet();
    try {
      const txs = []
      const params = {
        token_id: token?.token_id,
        nft_contract_id: token?.contract_id,
        ft_token_id: token?.ft_token_id,
        price: token?.price
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
                deposit: getAmount(token?.price),
              },
            },
          ],
        }
      )
      await wallet.signAndSendTransactions({
        transactions: txs
      });

    } catch (e) {
      console.log(e)
    }
  }
  const onSweepChange = () => {
    let tmparray = myopencarts;
    for (let i = 0; i < tokens.length; i++) {
      const element = tokens[i];
      if (myopencarts.length > myopencartscnt) {
        while (myopencarts.length > myopencartscnt) {
          tmparray.pop();
        }
        dispatch(cartsActions.update(tmparray));
        return
      }

      if (element.is_sale && !isContain(element.token_id, element.contract_id)) {
        tmparray.push({
          token_id: element.token_id, contract_id: element.contract_id,
          media_url: element.media_url, price: element.price, name: element.metadata.name
        });
        if (tmparray.length === myopencartscnt) {
          dispatch(cartsActions.update(tmparray));
          return;
        }
      }
    }
  }
  useEffect(() => {
    SetCollectionSelect(JSON.parse(localStorage.getItem(`${contract_id}-sort`)) || 'Price: Low To High ')
    clear();
  }, [collectionAttributes]);

  useEffect(() => {
    if (!buyfloor) return;
    gotobuyfloor();
  }, [buyfloor]);

  useEffect(() => {
    onSweepChange();
  }, [myopencartscnt]);
  return (
    <div className="mx-auto max-w-[100rem] md:flex">
      <div className="md:w-1/4 pr-5 hidden sm:block ">
        <CollectionSideBar data={collectionAttributes} visible={visible} setvisible={logsetvisible} clickOneFilter={clickOneFilter} finished={finished} clear={clear} done={done} clickFilter={clickFilter} collectionFilter={collectionFilter} setsale={seton_sale} setview={seton_viewed} setlike={seton_liked} sale={on_sale} view={on_viewed} like={on_liked}  />
      </div>
      <div className="md:w-3/4">
        <div className=" pb-5 lg:flex justify-between -mt-3">
          <div className="relative min-w-[20rem] mt-3">
            <input
              type="text"
              placeholder="Search"
              className="dark:bg-jacarta-700 dark:border-jacarta-600 focus:ring-accent border-jacarta-100 w-full rounded-lg border py-3 px-4 dark:text-white dark:placeholder-white"
              onChange={evt => setName(evt.target.value)}
            />
            <button
              className="hover:bg-accent-dark font-display bg-accent absolute top- right-0 rounded-lg px-8 py-6 text-sm text-white"
              onClick={done}
            >
              <span className="absolute  left-0 bottom-0 flex h-full w-full items-center justify-center rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-5 w-5 fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                </svg>
              </span>
            </button>
          </div>
          <div>
            <select className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mr-8 min-w-[12rem] rounded-lg py-3 text-sm dark:text-white mt-3" value={collectionSelect} onChange={(evt) => handlechangeselect(evt)}>
              <option value="Price: Low To High">Price: Low To High</option>
              <option value="Price: High To Low">Price: High To Low</option>
              <option value="Rank: Low To High">Rank: Low To High</option>
              <option value="Rank: High To Low">Rank: High To Low</option>
              <option value="NFT ID: Low To High">NFT ID: Low To High</option>
              <option value="NFT ID: High To Low">NFT ID: High To Low</option>
            </select>
            <div className="lg:inline-block mt-3">
              <button
                className='dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
                onClick={() => setbuyfloor(true)}
              >
                <svg
                  className=
                  'icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white'
                >
                  <use xlinkHref={`/icons.svg#icon-listing`}></use>
                </svg>
                <span className="text-sm font-medium capitalize">Buy Floor</span>
              </button>
              <button
                className=
                'dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
                onClick={() => dispatch(sweepModalShow())}
              >
                <svg
                  className=
                  'icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white'
                >
                  <use xlinkHref={`/icons.svg#icon-purchases`}></use>
                </svg>
                <span className="text-sm font-medium capitalize">Sweep</span>
              </button>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <button
            className=
            'fixed bottom-10 left-1/2 -ml-16 z-10 flex bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-55 rounded-full py-3 px-8 text-center font-semibold mx-5 text-white transition-all'
          // onClick={() => dispatch(sweepModalShow())}
            onClick={() => setvisible(true)}
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            <span className="text-sm font-medium capitalize">Filter</span>
          </button>
          <div className="fixed bottom-1 left-0 w-full px-10 z-20 mx-auto">
            {
              visible&&
              <CollectionSideBar data={collectionAttributes} visible={visible} setvisible={logsetvisible} clickOneFilter={clickOneFilter} finished={finished} clear={clear} done={done} clickFilter={clickFilter} collectionFilter={collectionFilter} setsale={seton_sale} setview={seton_viewed} setlike={seton_liked} sale={on_sale} view={on_viewed} like={on_liked}/>
            }
          </div>
        </div>

        <InfiniteScroll
          dataLength={tokens.length}
          next={() => fetchMoreTokens(query)}
          hasMore={hasMore}
          loader={
            tokens?.length > 0 ?
              <div className="p-3">Loading...</div> :
              <div className="p-3">No results</div>
          }
          className="grid grid-cols-1 gap-[0.5rem] md:grid-cols-2 lg:grid-cols-4"
          scrollThreshold={0.1}
        >
          <CollectionItem tokens={tokens} />
        </InfiniteScroll>
        <ScrollToTop width={20} height={20} style={{ fontSize: '15px', padding: '10px' }} />
      </div>
    </div>
  );
};

export default CategoryCollectionItem;
