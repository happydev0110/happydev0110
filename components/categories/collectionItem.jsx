import Link from 'next/link';
import { prettyBalance, prettyTruncate } from '../../utils/common'
import BN from 'bn.js';
import Likes from "../likes";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useState } from 'react';
import {cartsActions} from '../../redux/cart'

const CollectionItem = ({tokens}) => {
    const dispatch = useDispatch();
    const store = useStore()
    const myopencarts = useSelector(state => Object.values(state.cart.items));
    const myopencartscnt = useSelector(state => state.cart.itemcnt);

    const [changed, setchanged] = useState(1);

    const isContain = (token_id,contract_id) => {
        let contain = false;
        let tmparray = myopencarts;
        for (let i = 0; i < tmparray.length; i++) {
            const element = tmparray[i];
            if(element.token_id === token_id && element.contract_id === contract_id){
                contain = true;
                break;
            }
        }
        return contain
    }
    
    const select = (token_id,item) => {
        setchanged(Math.random()/9 + 1);
        makeStoreData(token_id, item)
    }

    const makeStoreData = (token_id, item) => {
        let mycart = myopencarts;
        let contain = false;
        const contract_id = item.contract_id
        for (let i = 0; i < mycart.length; i++) {
            const element = mycart[i];
            if(element.token_id === token_id && element.contract_id === contract_id){
                mycart.splice(i, 1);
                contain = true;
                break;
            }
        }
        if(!contain){
            if(mycart.length < 25)
            mycart.push({token_id, contract_id, media_url: item.media_url,price: item.price, name: item.metadata.name })
        }
        dispatch(cartsActions.update(mycart));
        dispatch(cartsActions.updateChanged(Math.random()/9+1));
        return contain;//contain-true,not-false
    }

    return(
        <>
            {tokens.map((item, id) => {
                return (
                <article key={id} className="" >
                    <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[0.875rem] transition-shadow hover:shadow-lg">
                    <figure className="relative">
                        <Link href={`/item/${item.contract_id}/${item.token_id}`}>
                        <a>
                            <img
                            src={item.media_url}
                            alt="item 5"
                            className="w-full h-[180px] rounded-[0.625rem] object-cover"
                            />
                        </a>
                        </Link>
                        {
                            item.is_sale && 
                            <input
                                type="checkbox"
                                id="terms2"
                                className="absolute top-2 left-2 checked:bg-accent bg-white text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-8 w-8 self-start rounded focus:ring-offset-0"
                                checked={isContain(item.token_id,item.contract_id)}
                                onChange={()=>select(item.token_id, item)}
                                readOnly
                            />
                        }
                    </figure>
                    <div className="mt-7 items-center block overflow-hidden text-ellipsis whitespace-nowrap ">
                        <Link href={`/item/${item.contract_id}/${item.token_id}`}>
                        <a className="group">
                            <span className="group-hover:text-accent font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                            {item?.metadata?.name || item?.metadata?.title}
                            </span>
                        </a>
                        </Link>
                    </div>
                    <div className="mt-2 text-sm flex items-center justify-between">
                        <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                        Rank
                        </span>
                        <span className="dark:text-jacarta-300 text-jacarta-500">
                        price
                        </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                        &nbsp;#{item?.rank ? item.rank : 'Not Defined'}
                        </span>
                        <div className="flex">
                        <h5>{item.is_sale ? prettyBalance(item.price) + 'Ⓝ ' : 'Not Listed'}</h5>
                        <span>{item.is_sale ? '= $' + prettyBalance(new BN(item.price) * store.nearUsdPrice, 24, 4) : ""}</span>
                        </div>
                    </div>
                    </div>
                </article>
                );
            })}
        </>
    )
}

export default CollectionItem