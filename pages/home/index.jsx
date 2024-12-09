import React from "react";

// import Collection_category from "../../components/collectrions/collection_category";

import Top_Collections from "../../components/collectrions/Top_Collections";

import { Popular_collections, HeadLine } from "../../components/component";
import Meta from "../../components/Meta";
import Hero_5 from "../../components/hero/hero_5";
import Process from "../../components/blog/process";

import Highest_sales from "../../components/categories/Highest_sales";

// import Highest_sales from "../../components/categories/trending_categories_items";
// import Download from "../../components/blog/download";

const Home_5 = () => {
  return (
    <>
      <Meta title="Home || Astromarket" />
      <Hero_5 />
      {/* <Process /> */}
      <Popular_collections />
      <Top_Collections bgWhite={true} />

      <div>
        {/* <!-- Trending Categories --> */}
        <section className="py-24">
          <div className="container">
            <HeadLine
              image="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/26a1.png"
              text="Highest Sales"
              classes="mb-8 text-center font-display text-3xl text-jacarta-700 dark:text-white"
            />
            <Highest_sales />
          </div>
        </section>
        {/* <!-- end trending categories --> */}
      </div>
      {/* <Download /> */}
    </>
  );
};

export default Home_5;
