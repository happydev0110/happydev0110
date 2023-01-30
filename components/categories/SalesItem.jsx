import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
// import Img1 from 'card-item8.jpg'
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
import { prettyBalance, prettyTruncate } from '../../utils/common'

const SalesItem = () => {
  const [modalShow, setModalShow] = useState(false);
  const [userdata, setuserdata] = useState([]);
  const [visible, setVisible] = useState(8);

  const fetchrandomusers = async () => {
    let params = {
      type: "highest",
      random: true,
      __skip: 0,
      __limit: 10,
    }
    try {
      let initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tokens`, {
        params
      })
      if (initdata?.data.data != null) {
        setuserdata(initdata.data.data.results);
        // console.log('live nfts data', initdata.data.data.results)
      }
      // console.log(initdata.data.data.results)
      // console.log(userdata)
    } catch (error) {
      console.log(error);
      setuserdata([]);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchrandomusers();
    }
    fetchData()
  }, [])

  const { sortedtrendingCategoryItemData } = useSelector(
    (state) => state.counter
  );
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {userdata?.slice(0, visible).map((item, id) => {
        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/collection/${item.contract_id}/${item.token_id}`}>
                  <a>
                    {/* <img
                      src={item.media_url? item.media_url : item?.metadata?.image?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/") || img1 }
                      alt="item 5"
                      className="w-full h-[230px] rounded-[0.625rem] object-cover"
                    /> */}
                    <img
                      src={item.media_url}
                      alt="item 5"
                      className="w-full h-[230px] rounded-[0.625rem] object-cover"
                    />
                  </a>
                </Link>

                <Likes like={item?.metadata?.tokenId} />

              </figure>
              <div className="group mt-7 flex items-center justify-between">
                <Link href={`/collection/${item.contract_id}/${item.token_id}`}>
                  <a>
                    <span className="group-hover:text-accent font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      {item?.metadata?.name || item?.metadata?.title}
                    </span>
                  </a>
                </Link>
              </div>
              <div className="mt-2 text-sm flex items-center justify-between">
                <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  collection
                </span>
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  price
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Link href={`/collection/${item.contract_id}`}>
                  <a className="group flex items-center">
                    <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                      {prettyTruncate(item?.collection[0]?.name, 16, "")}
                    </span>
                    {item?.collection[0]?.verified ? <img src='/images/icon/verify.png' style={{ width: '20px', height: '20px' }} alt='Axies' /> : <></>}
                    {/* <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                      <use xlinkHref="/icons.svg#icon-history"></use>
                    </svg> */}
                  </a>
                </Link>
                <h5>{prettyBalance(item?.price || "")} Ⓝ</h5>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default SalesItem;
