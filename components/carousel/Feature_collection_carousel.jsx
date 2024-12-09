import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "tippy.js/dist/tippy.css";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Feature_collections_data from "../../data/Feature_collections_data";
import Link from "next/link";
import axios from "axios";

const Feature_collections_carousel = () => {
  const [userdata, setuserdata] = useState([]);

  const fetchrandomusers = async () => {
      let params = {
          is_popular: true,
          __skip: 0,
          __limit: 6,
      }
      try {
          const initdata = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
              params
          })
          if(initdata?.data.data != null){
              setuserdata(initdata.data.data.results);
          }
      } catch (error) {
          setuserdata([]);
      }
  }

  useEffect(() => {
      async function fetchData() {
          await fetchrandomusers()
      }

      fetchData()
  }, [])
  
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        breakpoints={{
          // when window width is >= 640px
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {userdata.map((item,id) => {
          // const {
          //   id,
          //   bigImage,
          //   subImage1,
          //   subImage2,
          //   subImage3,
          //   userImage,
          //   title,
          //   itemsCount,
          //   userName,
          // } = item;

          // const itemLink = bigImage
          //   .split("/")
          //   .slice(-1)
          //   .toString()
          //   .split("_")
          //   .slice(1, 2)
          //   .toString();

          return (
            <SwiperSlide key={id}>
              <article>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                  <Link href={`/collection/${item.contract_id}`}>
                    <a className="flex space-x-[0.625rem]">
                      <figure className="w-[100%] h-full">
                        {/* <Image
                          src={bigImage}
                          alt="item 1"
                          className="rounded-[0.625rem]"
                          width={150}
                          height={240}
                          objectFit="cover"
                          layout="responsive"
                        /> */}
                        <img className="rounded-[0.625rem]" src={item.bgimg_url ? item.bgimg_url : imgTop1} style={{width:180,height:180,objectFit:'cover'}} alt="" />
                      </figure>
                      <span className="flex w-1/3 flex-col space-y-[0.625rem]">
                        {/* <img
                        src={subImage1}
                        alt="item 1"
                        className="h-full rounded-[0.625rem] object-cover"
                        loading="lazy"
                      /> */}
                        {/* 
                         <img
                          src={subImage2}
                          alt="item 1"
                          className="h-full rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                        <img
                          src={subImage3}
                          alt="item 1"
                          className="h-full rounded-[0.625rem] object-cover"
                          loading="lazy"
                        /> */}
                        <img
                          src={item.tokens[0]?.media_url || (item.tokens[0]?.metadata?.image ? item.tokens[0].metadata.image?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/") : img1Bottom1)}
                          alt="item 1"
                          className=" rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                        <img
                          src={item.tokens[1]?.media_url || (item.tokens[1]?.metadata?.image ? item.tokens[1].metadata.image?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/") : img1Bottom1)}
                          alt="item 1"
                          className=" rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                        <img
                          src={item.tokens[2]?.media_url || (item.tokens[2]?.metadata?.image ? item.tokens[2].metadata.image?.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/") : img1Bottom1)}
                          alt="item 1"
                          className=" rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                      </span>
                    </a>
                  </Link>
                  
                  <Link href={`/collection/${item.contract_id}`}>
                    <a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
                      {item.name}
                    </a>
                  </Link>

                  <div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
                    <div className="flex flex-wrap items-center">
                      <Link href={`/collection/${item.contract_id}`}>
                        <a className="mr-2 shrink-0">
                          <img
                            src={item.banimg_url}
                            alt="owner"
                            className="h-5 w-5 rounded-full"
                          />
                        </a>
                      </Link>
                      {/* <span className="dark:text-jacarta-400 mr-1">by</span>
                      <Link href={`/collection/${item.contract_id}`}>
                        <a className="text-accent">
                          <span>{item.name}</span>
                        </a>
                      </Link> */}
                    </div>
                    <span className="dark:text-jacarta-300 text-sm">
                      {item.total_count} Items
                    </span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default Feature_collections_carousel;