// import CID from 'cids'
// import Compressor from 'compressorjs'
// import TimeAgo from 'javascript-time-ago'
// import en from 'javascript-time-ago/locale/en'
// import sha1 from 'sha-1'
// import BN from 'bn.js';

// TimeAgo.addLocale(en)
// export const timeAgo = new TimeAgo('en-US')
// export const DEF_DELAY = 1000;

// const monthNames = [
// 	'January',
// 	'February',
// 	'March',
// 	'April',
// 	'May',
// 	'June',
// 	'July',
// 	'August',
// 	'September',
// 	'October',
// 	'November',
// 	'December',
// ]

// export const parseDate = (ts) => {
// 	let dateObj = new Date(ts)
// 	let month = monthNames[dateObj.getMonth()].slice(0, 3)
// 	let day = String(dateObj.getDate()).padStart(2, '0')
// 	let year = dateObj.getFullYear()
// 	return `${day} ${month} ${year}`
// }

// export const parseTimeForFilter = (ts) => {
// 	let tmpdatatime = new Date(ts)
// 	let curtime = new Date();
// 	if(tmpdatatime == null || tmpdatatime === '')
// 		return ''
// 	if(tmpdatatime.getDate() === curtime.getDate()
// 		&& tmpdatatime.getFullYear() === curtime.getFullYear()
// 		&& tmpdatatime.getMonth() === curtime.getMonth() ){
// 		var diff =(curtime.getTime() - tmpdatatime.getTime()) / 1000;
// 		diff /= (60 * 60);
// 		return (Math.abs(Math.round(diff))+1).toString() + ' hours ago';
// 	}
// 	return ts.split('T')[0];
// }

export const prettyBalance = (balance, decimals = 24, len = 5) => {
	if (!balance) {
		return '0'
	}
	const diff = balance.toString().length - decimals
	const fixedPoint = Math.max(2, len - Math.max(diff, 0))
	const fixedBalance = (balance / 10 ** decimals).toFixed(fixedPoint)
	const finalBalance = parseFloat(fixedBalance).toString()
	const [head, tail] = finalBalance.split('.')
	if (head === 0) {
		if (tail) {
			return `${head}.${tail.substring(0, len - 1)}`
		}
		return `${head}`
	}
	const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return tail ? `${formattedHead}.${tail}` : formattedHead
}

export const averageBalance = (balanceArray) => {
	let price = 0;
	if(balanceArray && balanceArray?.length > 0){
		for (let i = 0; i < balanceArray.length; i++) {
			price += parseFloat(prettyBalance(balanceArray[i]));
		}
		return (price/balanceArray.length).toFixed(2);
	}
	else
	return 0
}

export const prettyTruncate = (str = '', len = 8, type) => {
	if (str && str.length > len) {
		if (type === 'address') {
			const front = Math.ceil(len / 2)
			const back = str.length - (len - front)
			return `${str.slice(0, front)}...${str.slice(back)}`
		}
		return `${str.slice(0, len)}...`
	}
	return str
}

export const readFileAsUrl = (file) => {
	const temporaryFileReader = new FileReader()

	return new Promise((resolve) => {
		temporaryFileReader.onload = () => {
			resolve(temporaryFileReader.result)
		}
		temporaryFileReader.readAsDataURL(file)
	})
}

export const readFileDimension = (file) => {
	const temporaryFileReader = new FileReader()

	return new Promise((resolve) => {
		temporaryFileReader.onload = () => {
			const img = new Image()

			img.onload = () => {
				resolve({
					width: img.width,
					height: img.height,
				})
			}

			img.src = temporaryFileReader.result
		}
		temporaryFileReader.readAsDataURL(file)
	})
}

export const parseImgUrl = (url, defaultValue = '', opts = {}) => {
	if (!url) {
		return defaultValue
	}
	if (url.includes('://')) {
		const [protocol, path] = url.split('://')
		if (protocol === 'ipfs') {
			const cid = new CID(path)
			if (opts.useOriginal || process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
				if (cid.version === 0) {
					return `https://ipfs-gateway.paras.id/ipfs/${path}`
				} else {
					return `https://ipfs.fleek.co/ipfs/${path}`
				}
			}

			let transformationList = []
			if (opts.width) {
				transformationList.push(`w=${opts.width}`)
				!opts.seeDetails && transformationList.push(`auto=format,compress`)
			} else {
				transformationList.push('w=800')
				!opts.seeDetails && transformationList.push(`auto=format,compress`)
			}
			return `https://paras-cdn.imgix.net/${cid}?${transformationList.join('&')}`
		} else if (opts.isMediaCdn) {
			const sha1Url = sha1(url)
			let transformationList = []
			if (opts.width) {
				transformationList.push(`w=${opts.width}`)
				!opts.seeDetails && transformationList.push(`auto=format,compress`)
			} else {
				transformationList.push('w=800')
				!opts.seeDetails && transformationList.push(`auto=format,compress`)
			}
			return `https://paras-cdn.imgix.net/${sha1Url}?${transformationList.join('&')}`
		}
		return url
	} else {
		try {
			const cid = new CID(url)
			if (opts.useOriginal || process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
				if (cid.version === 0) {
					return `https://ipfs-gateway.paras.id/ipfs/${cid}`
				} else if (cid.version === 1) {
					return `https://ipfs.fleek.co/ipfs/${cid}`
				}
			}

			let transformationList = []
			if (opts.width) {
				transformationList.push(`w=${opts.width}`)
				!opts.seeDetails && transformationList.push(`auto=format,compress`)
			} else {
				transformationList.push('w=800')
				!opts.seeDetails && transformationList.push(`auto=format,compress`)
			}
			return `https://paras-cdn.imgix.net/${cid}?${transformationList.join('&')}`
		} catch (err) {
			return url
		}
	}
}

export const dataURLtoFile = (dataurl, filename) => {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}

	return new File([u8arr], filename, { type: mime })
}

export const compressImg = (file) => {
	return new Promise((resolve, reject) => {
		let _file = file
		const quality = 0.8
		new Compressor(_file, {
			quality: quality,
			maxWidth: 1080,
			maxHeight: 1080,
			convertSize: Infinity,
			success: resolve,
			error: reject,
		})
	})
}

export const checkUrl = (str) => {
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$',
		'i'
	)
	return !!pattern.test(str)
}

export const checkSocialMediaUrl = (str) => {
	var pattern = new RegExp(/(^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+\/)|(\/)/)
	return !!pattern.test(str)
}

export const checkTokenUrl = (str) => {
	var pattern = new RegExp(
		/^((https?|ftp|smtp):\/\/)?(www\.)?(paras\.id|localhost:\d+|marketplace-v2-testnet\.paras\.id|testnet\.paras\.id)\/token\/([a-z0-9\-#_]+\.?)+::\d+(\/\d+)?/
	)
	return !!pattern.test(str)
}

export const parseSortQuery = (sort, defaultMinPrice = false) => {
	if (!sort) {
		return defaultMinPrice ? 'lowest_price::1' : 'updated_at::-1'
	} else if (sort === 'marketupdate') {
		return 'updated_at::-1'
	} else if (sort === 'marketupdateasc') {
		return 'updated_at::1'
	} else if (sort === 'cardcreate') {
		return '_id::-1'
	} else if (sort === 'cardcreateasc') {
		return '_id::1'
	} else if (sort === 'pricedesc') {
		return 'lowest_price::-1'
	} else if (sort === 'priceasc') {
		return 'lowest_price::1'
	} else if (sort === 'scoredesc') {
		return 'metadata.score::-1'
	}
}

export const parseSortTokenQuery = (sort) => {
	if (!sort || sort === 'cardcreate') {
		return '_id::-1'
	} else if (sort === 'cardcreateasc') {
		return '_id::1'
	} else if (sort === 'pricedesc') {
		return 'price::-1'
	} else if (sort === 'priceasc') {
		return 'price::1'
	}
}

export const parseFilter = (sort) => {
	let value;
	switch (sort) {
		case 'nft_transfer':
			value = 'Transfer';
			break;
		case 'nft_offer':
			value = 'Offer';
			break;
		case 'nft_unoffer':
			value = 'UnOffer';
			break;
		case 'nft_purchase':
			value = 'Purchase';
			break;
		case 'nft_list':
			value = 'List';
			break;
		case 'nft_unlist':
			value = 'UnList';
			break;
		default:
			value = 'None';
			break;
	}
	return value;
}

export const unParseFilter = (sort) => {
	let value;
	switch (sort) {
		case 'Listings':
			value = 'nft_list';
			break;
		case 'Sales':
			value = 'nft_purchase';
			break;
		case 'Transfers':
			value = 'nft_transfer';
			break;
		case 'Offers':
			value = 'nft_offer';
			break;
		default:
			value = '';
			break;
	}
	return value;
}

export const parseGetTokenIdfromUrl = (url) => {
	const pathname = new URL(url).pathname.split('/')
	return {
		token_series_id: pathname[2],
		token_id: pathname[3],
	}
}

export const parseGetCollectionIdfromUrl = (url) => {
	const pathname = new URL(url).pathname.split('/')
	return {
		collection_id: pathname[2],
	}
}

export const capitalize = (words) => {
	return words[0].toUpperCase() + words.slice(1)
}

export default function getsha1(data, encoding) {
	return sha1(data)
}

export const decodeBase64 = (b64text) => {
	return new TextDecoder().decode(Buffer.from(b64text, 'base64'))
}

export const isChromeBrowser =
	typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') !== -1

export const setDataLocalStorage = (key, value, setState = () => {}) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(key, value)
		setState(window.localStorage.getItem(key))
	}
}

export const getRandomInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}

export const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

export const parseDateFilter = (str) => {
	let value;
	switch(str){
		case 'Last 7 Days':
			value = 7;
			break;
		case 'Last 30 Days':
			value = 30;
			break;
		default:
			value = -1;
			break;			
	}
	return value;
}

export const parseDateFilter1 = (str) => {
	let value;
	switch(str){
		case '1':
			value = 7;
			break;
		case '2':
			value = 30;
			break;
		case '3':
			value = 90;
			break;
		case '4':
			value = 365;
			break;
		default:
			value = -1;
			break;			
	}
	return value;
}