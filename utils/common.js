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

export const parseTimeForFilter = (ts) => {
	let tmpdatatime = new Date(ts)
	let curtime = new Date();
	if(tmpdatatime == null || tmpdatatime === '')
		return ''
	if(tmpdatatime.getDate() === curtime.getDate()
		&& tmpdatatime.getFullYear() === curtime.getFullYear()
		&& tmpdatatime.getMonth() === curtime.getMonth() ){
		var diff =(curtime.getTime() - tmpdatatime.getTime()) / 1000;
		diff /= (60 * 60);
		return (Math.abs(Math.round(diff))+1).toString() + ' hours ago';
	}
	return ts.split('T')[0];
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