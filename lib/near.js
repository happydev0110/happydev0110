import getConfig from '../config/config'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import BN from 'bn.js'
import queryString from 'query-string'
import { base_decode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'
import { createTransaction, functionCall } from 'near-api-js/lib/transaction'
import { GAS_FEE } from '../config/constants'
import { removeSenderWalletLocalStorage } from './senderWallet'

export const getAmount = (amount) =>
	amount ? new BN(amount) : new BN('0')

export const amountInYocto = (amountFromNEAR ) => { 
	console.log(amountFromNEAR)
	return nearAPI.utils.format.parseNearAmount(amountFromNEAR!="" ? amountFromNEAR : "0");
}

export const parseYoctoNear = (amountToNEAR ) =>
	amountToNEAR? nearAPI.utils.format.formatNearAmount(amountToNEAR): "";

class Near {
	constructor() {
		this.currentUser = null
		this.config = {}
		this.wallet = {}
		this.signer = {}
		this.accessKey = null
		this.near = {}
		this.activeWallet = null
		this._authToken = null
	}

	async authToken() {
		if (!this.currentUser) {
			return null
		}

		try {
			const accountId = this.currentUser.accountId
			const arr = new Array(accountId)
			for (var i = 0; i < accountId.length; i++) {
				arr[i] = accountId.charCodeAt(i)
			}
			const msgBuf = new Uint8Array(arr)
			const signedMsg = await this.signer.signMessage(
				msgBuf,
				this.wallet._authData.accountId,
				this.wallet._networkId
			)
			const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
			const signature = Buffer.from(signedMsg.signature).toString('hex')
			const payload = [accountId, pubKey, signature]
			this._authToken = Base64.encode(payload.join('&'))
			return this._authToken
		} catch (err) {
			console.log(err)
			if (err?.message?.includes(' not found in ')) 
			// this.logout()
			return null
		}
	}

	async generateAuthToken() {
		if (!this.currentUser||!this.accessKey) {
			return
		}
		const { networkId } = getConfig(process.env.NEXT_PUBLIC_APP_ENV || 'development')
		const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
		
		const keyPair = nearAPI.KeyPair.fromString(this.accessKey.secretKey)
		
		await keyStore.setKey(networkId, this.currentUser.accountId, keyPair)

		const signer = new nearAPI.InMemorySigner(keyStore)

		const arr = new Array(this.currentUser.accountId)
		for (var i = 0; i < this.currentUser.accountId.length; i++) {
			arr[i] = this.currentUser.accountId.charCodeAt(i)
		}

		const msgBuf = new Uint8Array(arr)
		const signedMsg = await signer.signMessage(msgBuf, this.currentUser.accountId, networkId)

		const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
		const signature = Buffer.from(signedMsg.signature).toString('hex')
		const payload = [this.currentUser.accountId, pubKey, signature]

		this._authToken = Base64.encode(payload.join('&'))

		return this._authToken
	}

	async init(selectedWallet) {
		
		const nearConfig = getConfig(process.env.NEXT_PUBLIC_APP_ENV || 'development')
		this.nearConfig = nearConfig
		
		if(selectedWallet=='sender') {
			await this.initSenderWallet()
		}
		else {
			await this.initBrowserWallet()
		}
	}

	async initBrowserWallet() {
		try {
			const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
			const near = await nearAPI.connect({
				keyStore: keyStore,
				...this.nearConfig,
			})

			const wallet = new nearAPI.WalletConnection(near,"near_app")
			this.wallet = wallet
			console.log('wallet.isSignedIn()',wallet.isSignedIn())
			// Load in account data
			let currentUser
			console.log('wallet.getAccountId()',wallet.getAccountId())
			if (wallet.getAccountId()) {
				currentUser = {
					accountId: wallet.getAccountId(),
					balance: await wallet.account().getAccountBalance(),
				}
			}
			
			this.near = near
			this.currentUser = currentUser
			
			this.signer = new nearAPI.InMemorySigner(wallet._keyStore)
			this.authToken()

		} catch (err) {
			console.log(err)
			throw err
		}
	}

	async initSenderWallet() {
		if (window.near.isSignedIn()) {
			if(window.near.authData.accessKey==null) {
				const resSignIn = await window.near.requestSignIn({
					contractId: process.env.REACT_APP_MARKET_CONTRACT,
				})
				if (resSignIn && resSignIn.accessKey) {
					const accountId = resSignIn.accountId || window.near.accountId
					this.currentUser = {
						accountId,
						balance: await window.near.account().getAccountBalance(),
					}
					this.accessKey = resSignIn.accessKey
				} else {
					this.currentUser = null;
				}
			} else{
				const accountId = window.near.accountId
				this.currentUser = {
					accountId,
					balance: await window.near.account().getAccountBalance(),
				}
				this.accessKey = window.near.authData.accessKey
			}
			
			this.wallet = window.near
			
			await this.generateAuthToken()
		}
	}

	callFunction({ methodName, args = {}, gas = GAS_FEE, deposit, contractId }) {
		return this.wallet.account().functionCall({
			contractId,
			methodName,
			attachedDeposit: deposit,
			gas,
			args,
		})
	}

	viewFunction({ methodName, args, contractId }) {
		return this.wallet.account().viewFunction(contractId, methodName, args)
	}

	signAndSendTransactions({ receiverId, actions }) {
		return this.wallet.account().signAndSendTransaction({ receiverId, actions })
	}

	async getTransactionStatus({ txHash, accountId }) {
		try {
			const result = await this.near.connection.provider.txStatus(txHash, accountId)
			return result
		} catch (error) {
			return null
		}
	}

	async generateTransaction({ receiverId, actions, nonceOffset = 1 }) {
		const localKey = await this.near.connection.signer.getPublicKey(
			this.wallet.account().accountId,
			this.near.connection.networkId
		)
		const accessKey = await this.wallet
			.account()
			.accessKeyForTransaction(receiverId, actions, localKey)
		if (!accessKey) {
			throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`)
		}

		const block = await this.near.connection.provider.block({ finality: 'final' })
		const blockHash = base_decode(block.header.hash)
		const publicKey = PublicKey.from(accessKey.public_key)
		const nonce = accessKey.access_key.nonce + nonceOffset

		return createTransaction(
			this.wallet.account().accountId,
			publicKey,
			receiverId,
			nonce,
			actions,
			blockHash
		)
	}

	async executeMultipleTransactions(transactions, callbackUrl) {
		const nearTransactions = await Promise.all(
			transactions.map((tx, i) =>
				this.generateTransaction({
					receiverId: tx.receiverId,
					nonceOffset: i + 1,
					actions: tx.functionCalls.map((fc) =>
						functionCall(fc.methodName, fc.args, fc.gas, fc.attachedDeposit)
					),
				})
			)
		)

		return this.wallet.requestSignTransactions({
			transactions: nearTransactions,
			callbackUrl: callbackUrl,
		})
	}
	
	async doesAccountExist (userId) {
	  try {
	    await new nearAPI.Account(this.near.connection, userId).state();
	    return true;
	  } catch (error) {
	    const errorString = error.toString().toLowerCase();
	    const nonexistentAccountErrors = ['does not exist while viewing', `account id ${userId.toLowerCase()} is invalid`];

	    if (nonexistentAccountErrors.some((errorStringPart) => errorString.includes(errorStringPart))) {
	      return false;
	    }
	    throw error;
	  }
	}

}

const near = new Near()

export default near
