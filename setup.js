#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-write

const BASE_URL = 'http://api.reimaginebanking.com'

const post_json = relative_url => method => json => api_key =>
	fetch(`${BASE_URL}${relative_url}?key=${api_key}`, {
		method: method.toUpperCase(), // lol
		headers: { 'content-type': 'application/json; charset=utf-8' },
		body: JSON.stringify(json)
	}).then(r => r.json()).finally(console.log(json))

const id = resp_json => resp_json.objectCreated._id
const create_customer = post_json('/customers')('post')
const create_account  = customer_id => post_json(`/customers/${customer_id}/accounts`)('post')
const create_deposit  = account_id  => post_json(`/accounts/${account_id}/deposits`)('post')
const get_deposits    = account_id  => post_json(`/accounts/${account_id}/deposits`)('get')

const group = size => ar => new Array(Math.ceil(ar.length / size)).fill(0).map((_, i) => ar.slice(i * size, (i + 1) * size))

// 'ascii' is windows-1252, which seems to not be a subset of utf-8
// e.g. wikipedia says that 0159 is Ÿ in windows-1252, but utf-8 0159 is some control character ?
const bytes_to_ascii = bytes => String.fromCharCode(...bytes)
const ascii_to_bytes = str   => new Uint8Array(str.length).map((_, i) => str.charCodeAt(i))

const store_chunk = account_id => index => bytes =>
	create_deposit(account_id)({ amount: index, medium: 'balance', description: bytes_to_ascii(bytes) })

const store_file =
	api_key => account_id => async bytes =>
		Promise.all(group(1024)(bytes).map((group, i) => store_chunk(account_id)(i + 1)(group)(api_key)))

const get_file =
	api_key => async account_id => {
		const deposits = await get_deposits(account_id)()(api_key)
		deposits.sort((a, b) => a.amount - b.amount)
		return new Uint8Array(deposits.map(({ description }) => Array.from(ascii_to_bytes(description))).flat())
	}

const _ = 'AA'
const dummy_customer = { first_name: _, last_name: _, address: { street_number: _, street_name: _, city: _, state: _, zip: '00000' }}
const dummy_account  = { type: 'Credit Card', balance: 0, rewards: 0, nickname: _ }
const generate_account_id =
	async api_key => {
		const customer_id = await create_customer(dummy_customer)(api_key).then(id)
		const account_id  = await create_account(customer_id)(dummy_account)(api_key).then(id)

		return account_id
	}

async function nessie_save_file(key, data)
{
	// I wonder if store_file should take care of this actually
	const account_id = await generate_account_id(key)

	await store_file(key)(account_id)(data)

	return `${key}:${account_id}`
}

function nessie_get_file(uri)
{
	const [, key, account_id] = uri.match(/(\w+):(\w+)/)

	return get_file(key)(account_id)
}

const key = '213c0b2c737e19611ba9c9ae094892d8'

const uid = await nessie_save_file(key, await Deno.readFile('pig.png'))

console.log(await nessie_get_file(uid))

console.log(uid)