#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-write

/********************************/
/** interfaces wrapping nessie **/
/********************************/

const BASE_URL = 'http://api.reimaginebanking.com'

const post_json = relative_url => method => api => json =>
	fetch(`${BASE_URL}${relative_url}?key=${api}`, {
		method: method.toUpperCase(), // lol
		headers: { 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify(json)
	}).then(r => r.json()).finally(console.log(api))

const create_customer = post_json('/customers')('post')
const create_account  = customer_id => post_json(`/customers/${customer_id}/accounts`)('post')
const create_deposit  = ({ api, acc }) => post_json(`/accounts/${acc}/deposits`)('post')(api)
const get_deposits    = ({ api, acc }) => post_json(`/accounts/${acc}/deposits`)('get')(api)

/***************************************************************************************/
/** functions dealing with transforming data so it can be stored in nessie as strings **/
/***************************************************************************************/

// group array ar into size-sized arrays
const group = size => ar =>
	new Array(Math.ceil(ar.length / size)).fill(0).map((_, i) => ar.slice(i * size, (i + 1) * size))

// * note: I thought that ascii was subset of unicode but not really sure...
// *       e.g. wikipedia says that 0159 is Ÿ in windows-1252, but utf-8 0159 is some control character ?
// *       had some trouble with using TextEncoder/TextDecoder to do what I wanted so I just used fromCharCode/charCodeAt.

// transform bytes into 'ascii' string; basically base-256 encode (see note above)
const bytes_to_ascii = bytes => String.fromCharCode(...bytes)

// transform 'ascii' string into bytes; basically base-256 decode (see note above)
const ascii_to_bytes = str => new Uint8Array(str.length).map((_, i) => str.charCodeAt(i))

// store bytes in account as a deposite with amount=index
const upload_bytes = uid => index => bytes =>
	create_deposit(uid)({ amount: index, medium: 'balance', description: bytes_to_ascii(bytes) })

// chunk bytes into groups and store groups in order starting from index=0
const upload_bytes_chunked =
	uid => async (bytes, chunk_size=1024) =>
		Promise.all(group(chunk_size)(bytes).map((group, i) => upload_bytes(uid)(i + 1)(group)))

// download an account's deposits as chunks (sorted by amount) and return them all smushed together
const download_chunked_bytes =
	async uid => {
		const deposits = await get_deposits(uid)()
		deposits.sort((a, b) => a.amount - b.amount)
		return new Uint8Array(deposits.map(({ description }) => Array.from(ascii_to_bytes(description))).flat())
	}

// generate_id: given api key, generates new/empty account and returns its {uid}
const _ = 'AA'
const id = resp_json => resp_json.objectCreated._id
const dummy_customer = { first_name: _, last_name: _, address: { street_number: _, street_name: _, city: _, state: _, zip: '00000' }}
const dummy_account  = { type: 'Credit Card', balance: 0, rewards: 0, nickname: _ }
const generate_uid =
	async api =>
{
	const customer_id = await create_customer(api)(dummy_customer).then(id)
	const acc = await create_account(customer_id)(api)(dummy_account).then(id)

	return { api, acc }
}

// now store all key + account id in object { api, acc }

const parse_uid_str = str => str.match(/(?<api>\w+):(?<acc>\w+)/).groups

const nessie_upload_bytes =
	key => async data =>
{
	const uid = await generate_uid(key)

	await upload_bytes_chunked(uid)(data)

	return `${uid.api}:${uid.acc}`
}

const nessie_download_bytes = uri_string => download_chunked_bytes(parse_uid_str(uri_string))

export { nessie_upload_bytes, nessie_download_bytes }