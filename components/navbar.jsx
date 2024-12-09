/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import MblNavbar from "./mblNavbar";
import { useSelector, useDispatch } from "react-redux";
import { openMblMenu, shopModalShow } from "../redux/counterSlice";
import { useRouter } from "next/router";
import axios from "axios";
import { useWalletSelector } from "../hooks/WalletSelectorContext";
import UserId from "./userId";
import near from "../lib/near";
import { prettyBalance } from "../utils/common";
import { Metamask_comp_icon } from "./metamask/Metamask";
import ShopModal from "../components/modal/shopModal";
import SweepModal from "../components/modal/sweepModal";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [scroll, setScroll] = useState(false);
  const [home3, setHome3] = useState(false);

  const [searchstr, setsearchstr] = useState('');
  const [loading, setloading] = useState(false);
  const [userdata, setuserdata] = useState(null);
  const [collection, setcollection] = useState(null);
  const { accountId, setCommonModal, modal } = useWalletSelector()
  const [profileShow, setProfileShow] = useState(false);

  const [isfocus, setisfocus] = useState(false);
  const [isbox, setisbox] = useState(false);

  const { mblMenu, shopModal, sweepModal } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const handleSticky = function () {
    if (window.scrollY >= 100) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const handleTheme = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  const router = useRouter();
  const pid = router.asPath;

  // const router = useRouter();

  const getListedInformation = async () => {
    setloading(true);
    try {
      let initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get_users`, {
        params: {
          filter: searchstr,
          verified: true,
          __skip: 0,
          __limit: 4,
        },
      })
      if (initdata?.data.data != null) {
        setuserdata(initdata.data.data);
      }

      initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
        params: {
          filter: searchstr,
          __skip: 0,
          __limit: 4,
        }
      })

      if (initdata?.data.data != null) {
        setcollection(initdata.data.data.results);
      }
    } catch (error) {
      console.log(error);
      setuserdata([]);
    }
    setloading(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault()
    const wallet = await selector.wallet();
    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
    if (!accountId) {

      //setCommonModal('login')
      return
    }
  }

  useEffect(() => {
    if (searchstr.length > 2)
      getListedInformation();
  }, [searchstr]);

  // useEffect(() => {
  //   if (pid === "/") {
  //     setHome3(true);
  //     // console.log('home 3');
  //   } else {
  //     setHome3(false);
  //     // console.log('not home 3');
  //   }
  // }, [pid]);

  useEffect(() => {
    window.addEventListener("scroll", handleSticky);
  }, []);

  useEffect(() => {
    if (searchstr.length > 2)
      getListedInformation();
  }, [searchstr]);

  if (mblMenu) {
    return (
      <div>
        <header
          className={
            scroll
              ? "js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors js-page-header--is-sticky h-full"
              : "js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors h-full"
          }
        >
          {pid === "/platform_status" ? (
            <div className="container">
              <div className="flex items-center py-[1.5625rem] lg:py-[1.8125rem]">
                {/* <!-- Logo --> */}
                <Link href="/">
                  <a className="shrink-0 lg:mr-14">
                    <img
                      src="/images/logo.png"
                      className="max-h-16 dark:hidden"
                      alt="Xhibiter | NFT Marketplace"
                    />
                    <img
                      src="/images/logo_white.png"
                      className="hidden max-h-16 dark:block"
                      alt="Xhibiter | NFT Marketplace"
                    />
                  </a>
                </Link>

                <span className="font-display mt-1 hidden text-lg font-semibold lg:inline-block">
                  Status
                </span>

                <Link href="#">
                  <a className="bg-accent shadow-accent-volume hover:bg-accent-dark ml-auto inline-block rounded-full py-2.5 px-8 text-center text-sm font-semibold text-white transition-all">
                    <span className="hidden lg:block">
                      Subscribe to Updates
                    </span>
                    <span className="lg:hidden">Subscribe</span>
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center px-6 py-6 xl:px-24 ">
              {/* <!-- Logo --> */}

              <Link href="/">
                <a className="shrink-0 block dark:hidden">
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="max-h-16 h-auto"
                  />
                </a>
              </Link>
              <Link href="/">
                <a className="shrink-0 hidden dark:block">
                  <img
                    src="/images/logo_white.png"
                    className="max-h-16 h-auto"
                    alt="Xhibiter | NFT Marketplace"
                  />
                </a>
              </Link>

              {/* <!-- Search --> */}
              <form
                action="search"
                className="relative ml-12 mr-8 hidden basis-3/12 lg:block xl:ml-[8%]"
              >
                <input
                  type="search"
                  className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
                  placeholder="Search"
                  value={searchstr}
                  onChange={(evt) => { setsearchstr(evt.target.value) }}
                />
                <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 h-4 w-4 dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                  </svg>
                </span>
              </form>

              {/* <!-- Menu / Actions --> */}
              <MblNavbar theme={handleTheme} />

              {/* <!-- Mobile Menu Actions --> */}
              <div className="ml-auto flex lg:hidden">
                {/* <!-- Profile --> */}
                <Link href="/">
                  <a
                    className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                    aria-label="profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
                    </svg>
                  </a>
                </Link>

                {/* <!-- Dark Mode --> */}
                <button
                  className="js-dark-mode-trigger border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                  onClick={handleTheme}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 dark-mode-light h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:hidden"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 dark-mode-dark hidden h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:block dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
                  </svg>
                </button>

                {/* <!-- Mobile Menu Toggle --> */}
                <button
                  className="js-mobile-toggle border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                  aria-label="open mobile menu"
                  onClick={() => dispatch(openMblMenu())}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </header>
      </div>
    );
  } else {
    return (
      <div>
        <header
          className={
            scroll && home3
              ? "js-page-header page-header--transparent fixed top-0 z-20 w-full bg-white/[.15] backdrop-blur transition-colors js-page-header--is-sticky"
              : home3
                ? "js-page-header page-header--transparent fixed top-0 z-20 w-full bg-white/[.15] backdrop-blur transition-colors"
                : scroll
                  ? "js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors js-page-header--is-sticky"
                  : "js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors"
          }
        >
          {pid === "/platform_status" ? (
            <div className="container">
              <div className="flex items-center py-[1.5625rem] lg:py-[1.8125rem] ">
                {/* <!-- Logo --> */}
                <Link href="/">
                  <a className="shrink-0 lg:mr-14">
                    <img
                      src="/images/logo.png"
                      className="max-h-7 dark:hidden"
                      alt="Xhibiter | NFT Marketplace"
                    />
                    <img
                      src="/images/logo_white.png"
                      className="hidden max-h-7 dark:block"
                      alt="Xhibiter | NFT Marketplace"
                    />
                  </a>
                </Link>
                <span className="font-display mt-1 hidden text-lg font-semibold lg:inline-block">
                  Status
                </span>
                <Link href="#">
                  <a className="bg-accent shadow-accent-volume hover:bg-accent-dark ml-auto inline-block rounded-full py-2.5 px-8 text-center text-sm font-semibold text-white transition-all">
                    <span className="hidden lg:block">
                      Subscribe to Updates
                    </span>
                    <span className="lg:hidden">Subscribe</span>
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center px-6 py-6 xl:px-24 justify-between">
              {/* <!-- Logo --> */}
              {home3 ? (
                <Link href="/">
                  <a className="shrink-0">
                    <img
                      src="/images/logo_white.png"
                      className="max-h-16 h-auto"
                      alt="AstroVerse | NFT Marketplace"
                    />
                  </a>
                </Link>
              ) : (
                <Link href="/">
                  <a className="shrink-0">
                    <img
                      src="/images/logo.png"
                      alt=""
                      className="max-h-16 h-auto dark:hidden"
                    />

                    <img
                      src="/images/logo_white.png"
                      className="max-h-16 h-auto hidden dark:block"
                      alt="AstroVerse | NFT Marketplace"
                    />
                  </a>
                </Link>
              )}
              {/* <!-- Search --> */}
              {/* {home3 ? (
                <form
                  action="search"
                  className="relative ml-12 mr-8 hidden basis-3/12 lg:block xl:ml-[8%]"
                >
                  <input
                    type="search"
                    className=" focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 border-transparent bg-white/[.15] text-white placeholder-white"
                    placeholder="Search"
                    value={searchstr}
                    onChange={(evt) => { setsearchstr(evt.target.value) }}
                  />
                  <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className=" h-4 w-4 fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                    </svg>
                  </span>
                </form>
              ) : ( */}
              {/* <div className="flex justify-between">
                <div className="js-nav-dropdown group-dropdown relative"> */}
              {/* <form action="search" className="relative ml-12 mr-8 hidden basis-3/12 lg:block xl:ml-[8%]">
                  <input
                    type="search"
                    className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-20 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
                    placeholder="Search NFT Collections"
                    onChange={ (ev) => setsearchstr(ev.target.value) }
                    onFocus={() => setisfocus(true)} onBlur={() => setisfocus(false)} 
                  />
                  <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="fill-jacarta-500 h-4 w-4 dark:fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
                    </svg>
                  </span>
                </form> */}

              <form
                action="search"
                className="relative ml-12 mr-8 hidden basis-3/12 lg:block xl:ml-[8%]"
              >
                <input
                  type="search"
                  className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
                  placeholder="Search NFT Collections"
                  value={searchstr}
                  onChange={(evt) => { setsearchstr(evt.target.value) }}
                  onFocus={() => setisfocus(true)} onBlur={() => setisfocus(false)}
                />
                <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 h-4 w-4 dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                  </svg>
                </span>
                {
                  (isfocus || isbox) && searchstr?.length > 2 &&
                  <div className="dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible left-0 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl show lg:visible lg:opacity-100 border dark:border-jacarta-600 border-jacarta-100">
                    {
                      collection?.length == 0 && userdata?.length == 0 &&
                      <div className="px-3">
                        <h5>No Result</h5>
                      </div>
                    }
                    {
                      !loading && collection?.length > 0 &&
                      <>
                        <h4 className="text-lg font-bold px-4 pb-4">Collections</h4>
                        {
                          collection.map((item, id) => {
                            return (
                              <div
                                key={id}
                                className="border-jacarta-100 dark:bg-jacarta-700 rounded-2xl flex border bg-white py-3 px-7 transition-shadow hover:shadow-lg dark:border-jacarta-600 border-jacarta-100 mb-2"
                              >
                                <figure className="mr-4 shrink-0">
                                  <Link href={`/collection/${item.contract_id}`}>
                                    <a className="relative block">
                                      <img src={item.banimg_url} alt='' className="rounded-2lg h-12 w-12" />
                                      <div className="dark:border-jacarta-600 bg-jacarta-700 absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-2/4 items-center justify-center rounded-full text-xs text-white">
                                        {item.verified ?
                                          <img src="/images/icon/verify.png" alt='' className="rounded-2lg h-6 w-6" /> : <></>
                                        }
                                      </div>
                                    </a>
                                  </Link>
                                </figure>
                                <div style={{ width: '100%' }}>
                                  <div className='group text-sm flex items-center justify-between'>
                                    <Link href={`/collection/${item.contract_id}`}>
                                      <a className="block">
                                        <span className="group-hover:text-accent font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
                                          {item.name}
                                        </span>
                                      </a>
                                    </Link>
                                  </div>
                                  <div className='mt-2 text-sm flex items-center justify-between'>
                                    <span className="dark:text-jacarta-300 text-sm">{item?.total_count ? item.total_count : 0} Items</span>
                                    {/* <p>{collectionSelect === 'Today'?'1D':collectionSelect === 'Last 7 days'?'7D':'All'} VOLUME</p> */}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        }
                      </>
                    }
                  </div>
                }
              </form>
              {/* <!-- Menu / Actions --> */}
              <MblNavbar theme={handleTheme} />
              {/* </div> */}
              <div className="ml-auto flex lg:hidden">
                {
                  accountId ?
                    <div className="js-nav-dropdown group-dropdown relative">
                      <button
                        className="dropdown-toggle border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                        onMouseEnter={() => setProfileShow(true)}
                        onMouseLeave={() => setProfileShow(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                        </svg>
                      </button>
                      {/* )} */}

                      <div
                        className={
                          profileShow
                            ? "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl show lg:visible lg:opacity-100"
                            : "dropdown-menu dark:bg-jacarta-800 group-dropdown-hover:opacity-100 group-dropdown-hover:visible !-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl hidden lg:invisible lg:opacity-0"
                        }
                        onMouseEnter={() => setProfileShow(true)}
                        onMouseLeave={() => setProfileShow(false)}
                      >
                        <UserId
                          classes="js-copy-clipboard font-display text-jacarta-700 my-4 flex select-none items-center whitespace-nowrap px-5 leading-none dark:text-white"
                          userId={accountId}
                          shortId={true}
                        />

                        <div className="dark:border-jacarta-600 border-jacarta-100 mx-5 mb-6 rounded-lg border p-4">
                          <span className="dark:text-jacarta-200 text-sm font-medium tracking-tight">
                            Balance
                          </span>
                          <div className="flex items-center">
                            <svg className="icon icon-ETH -ml-1 mr-1 h-[1.125rem] w-[1.125rem]">
                              <use xlinkHref="/icons.svg#icon-ETH"></use>
                            </svg>
                            <span className="text-green text-lg font-bold">{near.currentUser ? prettyBalance(near.currentUser.balance.total) : ""} Ⓝ</span>
                          </div>
                        </div>
                        <Link href={`/user/${accountId}`}>
                          <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                            </svg>
                            <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                              My Profile
                            </span>
                          </a>
                        </Link>
                        <Link href={`/profile/${accountId}`}>
                          <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                            </svg>
                            <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                              Edit Profile
                            </span>
                          </a>
                        </Link>
                        <Link href="#">
                          <a className="dark:hover:bg-jacarta-600 hover:text-accent focus:text-accent hover:bg-jacarta-50 flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors" onClick={handleLogout}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              className="fill-jacarta-700 h-4 w-4 transition-colors dark:fill-white"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 11V8l-5 4 5 4v-3h8v-2H7z"></path>
                            </svg>
                            <span className="font-display text-jacarta-700 mt-1 text-sm dark:text-white">
                              Sign out
                            </span>
                          </a>
                        </Link>
                      </div>
                    </div> :
                    <Metamask_comp_icon prop={router} />
                }
                {/* open shopcart */}
                <button
                  className="border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent js-dark-mode-trigger ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                  onClick={() => dispatch(shopModalShow())}
                >
                  <svg
                    className={
                      'icon fill-jacarta-700 h-4 w-4 group-hover:fill-white dark:fill-white'
                    }
                  >
                    <use xlinkHref={`/icons.svg#icon-purchases`}></use>
                  </svg>
                </button>
                {
                  shopModal&&<ShopModal/>
                }
                {
                  sweepModal&&<SweepModal/>
                }
                <button
                  className="js-dark-mode-trigger border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                  onClick={handleTheme}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 dark-mode-light h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:hidden"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 dark-mode-dark hidden h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:block dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
                  </svg>
                </button>
                {/* <!-- Mobile Menu Actions --> */}

                <button
                  className="js-mobile-toggle border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
                  aria-label="open mobile menu"
                  onClick={() => {
                    dispatch(openMblMenu());
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* <SweepModal/> */}

        {/* <Wallet_modal /> */}
      </div>
    );
  }
};

export default Navbar;
