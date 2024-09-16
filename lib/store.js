import create from 'zustand'

const useStore = create((set, get) => ({
	activeWallet: null,
	setActiveWallet: (wallet) => set({ activeWallet: wallet }),
	currentUser: null,
	setCurrentUser: (user) => set(() => ({ currentUser: user })),
	adminWallet: ["tedm.near", "donny.near", "dojos.near"],
	initialized: false,
	setInitialized: (val) => set(() => ({ initialized: val })),
	marketScrollPersist: {},
	marketDataPersist: {},
	setMarketScrollPersist: (key, val) =>
		set(() => {
			const newMarket = {
				...get().marketScrollPersist,
				...{ [key]: val },
			}
			return {
				marketScrollPersist: newMarket,
			}
		}),
	setMarketDataPersist: (key, val) =>
		set(() => {
			const newMarket = {
				...get().marketDataPersist,
				...{ [key]: val },
			}
			return {
				marketDataPersist: newMarket,
			}
		}),
	nearUsdPrice: 0,
	setNearUsdPrice: (val) => set(() => ({ nearUsdPrice: val })),
	nearCapInfo: null,
	setNearCapInfo: (val) => set(() => ({ nearCapInfo: val })),
	userBalance: {},
	setUserBalance: (val) => set(() => ({ userBalance: val })),
	userProfile: null,
	setUserProfile: (val) => set(() => ({ userProfile: val })),
	sweepList: [],
	setSweepList: (val) => set(() => ({ sweepList: val })),
	sweepListCount: 0,
	setSweepListCount: (val) => set(() => ({ sweepListCount: val })),
	activityListIdBefore: null,
	setActivityListIdBefore: (val) => set(() => ({ activityListIdBefore: val })),
	activityListHasMore: true,
	setActivityListHasMore: (val) => set(() => ({ activityListHasMore: val })),
	activitySlowUpdate: false,
	setActivitySlowUpdate: (val) => set(() => ({ activitySlowUpdate: val })),
	notificationList: [],
	setNotificationList: (val) => set(() => ({ notificationList: val })),
	notificationUnreadList: [],
	setNotificationUnreadList: (val) => set(() => ({ notificationUnreadList: val })),
	notificationListIdBefore: null,
	setNotificationListIdBefore: (val) => set(() => ({ notificationListIdBefore: val })),
	notificationListHasMore: true,
	setNotificationListHasMore: (val) => set(() => ({ notificationListHasMore: val })),
	showEmailWarning: false,
	setShowEmailWarning: (val) => set(() => ({ showEmailWarning: val })),

	transactionRes: null,
	setTransactionRes: (transactionRes) => set(() => ({ transactionRes })),
}))

export default useStore
