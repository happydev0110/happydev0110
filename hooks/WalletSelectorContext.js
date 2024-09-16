import React, { useCallback, useContext, useEffect, useState } from "react";
import { map, distinctUntilChanged } from "rxjs";
import axios from 'axios'
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
// import Loader from '../../Astromarket-Front/src/components/Common/Loader'
// import LoginModal from '../../Astromarket-Front/src/components/Modal/LoginModal'
import near from '../lib/near'
import useStore from '../lib/store'
// import near_icon from '../assets/images/icon/near-wallet-icon.png'
import nearWalletIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import senderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import myNearWalletIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
// import senderWalletIconUrl from "/images/icon/sender-wallet-icon.png";
// import myNearWalletIconUrl from "/images/icon/my-near-wallet-icon.png";

const defaultValue = {
    isInit: false,
    selector: null,
    modal: null,
    accounts:[],
    accountId: null,
    setAccountId: () => null,
    commonModal: null,
    setCommonModal: () => null,
}

export const WalletSelectorContext = React.createContext(defaultValue)

export const WalletSelectorContextProvider = ({ children }) => {
    const store = useStore()
    const [isInit, setIsInit] = useState(false)
    const [selector, setSelector] = useState(null);
    const [modal, setModal] = useState(null);
    const [accountId, setAccountId] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [commonModal, setCommonModal] = useState(null)

    const setupUser = async (currentUser) => {
		if (!currentUser || !accountId) return

		store.setCurrentUser(currentUser.accountId)
		store.setUserBalance(currentUser.balance)

		const userProfileResp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get_user`, {
			params: {
                address: currentUser.accountId,
            }
		})
		const userProfileResults = userProfileResp.data.data

		if (!userProfileResults) {
			
		} else {
			const userProfile = userProfileResults
			store.setUserProfile(userProfile)
		}

	}

    const syncAccountState = (
        currentAccountId,
        newAccounts 
    ) => {
        if (!newAccounts.length) {
          localStorage.removeItem("accountId");
          setAccountId(null);
          setAccounts([]);
          return;
        }

        const validAccountId = currentAccountId && newAccounts.some((x) => x.accountId === currentAccountId);
        const newAccountId = validAccountId? currentAccountId: newAccounts[0].accountId;

        localStorage.setItem("accountId", newAccountId);
        setAccountId(newAccountId);
        setAccounts(newAccounts);
    };

    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            network: "mainnet",
            
            modules: [
                setupNearWallet({iconUrl: nearWalletIconUrl?.src}),
                setupSender({iconUrl: senderIconUrl?.src}),
                setupMyNearWallet({iconUrl: myNearWalletIconUrl?.src}),
            ],
        });

        const _modal = setupModal(_selector, { contractId: process.env.NEXT_PUBLIC_MARKET_CONTRACT, theme: "general", description: "Please sign in first"});
        const state = _selector.store.getState();
      
        syncAccountState(localStorage.getItem("accountId"), state.accounts);
      
        window.selector = _selector;
        window.modal = _modal;
        setSelector(_selector);
        setModal(_modal);
    }, []);

    useEffect(() => {
        init().catch((err) => {
            console.error(err);
            alert("Failed to initialise wallet selector");
        });
    }, [init]);

    useEffect(() => {
        async function init() {

            if (!selector) {
                return;
            }
            setIsInit(false)
            
            const subscription = selector.store.observable
                .pipe(
                    map((state) => state.accounts),
                    distinctUntilChanged()
                )
                .subscribe((nextAccounts) => {
                    console.log("Accounts Update", nextAccounts);
                    syncAccountState(accountId, nextAccounts);
                });
            
            await near.init(selector.store.getState().selectedWalletId);
            if(!near.currentUser) setAccountId(null)
            await setupUser(near.currentUser)
            setIsInit(true)
            return () => subscription.unsubscribe();
        }
        init()
    }, [selector, accountId]);

    if (!selector || !modal) {
        return null;
    }
    return (
        <WalletSelectorContext.Provider
            value={{
                isInit,
                selector,
                modal,
                accounts,
                accountId,
                setAccountId,
                commonModal,
                setCommonModal
            }}
        >
        {/* <Loader isLoading={!isInit} /> */}
        {isInit&&children}
        {/* <LoginModal show={commonModal === 'login'} onClose={() => setCommonModal(null)} /> */}

        </WalletSelectorContext.Provider>
    );
};

export function useWalletSelector() {
    const context = useContext(WalletSelectorContext);

    if (!context) {
        throw new Error(
          "useWalletSelector must be used within a WalletSelectorContextProvider"
        );
    }

    return context;
}