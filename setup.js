#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-write
/// setup.js: stores nessie.js in nessie

const NESSIE_KEY = Deno.env.get('NESSIE_KEY')

if (!NESSIE_KEY) throw 'no nessie key! ):'

const BASE_URL = 'http://api.reimaginebanking.com'

const post_json = relative_url => method => json =>
	fetch(`${BASE_URL}${relative_url}?key=${NESSIE_KEY}`, {
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
	account_id => async bytes =>
		Promise.all(group(1024)(bytes).map((group, i) => store_chunk(account_id)(i + 1)(group)))

const get_file =
	async account_id => {
		const deposits = await get_deposits(account_id)()
		deposits.sort((a, b) => a.amount - b.amount)
		return new Uint8Array(deposits.map(({ description }) => Array.from(ascii_to_bytes(description))).flat())
	}

const _ = 'AA'
const dummy_customer = { first_name: _, last_name: _, address: { street_number: _, street_name: _, city: _, state: _, zip: '00000' }}
const dummy_account  = { type: 'Credit Card', balance: 0, rewards: 0, nickname: _ }

/*
const customer_id = await create_customer(dummy_customer).then(id)
const account_id  = await create_account(customer_id)(dummy_account).then(id)

const data = await Deno.readFile('pig.png')

const resp = await store_file(account_id)(data)

console.log(resp.map(r => r.objectCreated.description.length))

console.log(`stored file at ${account_id}`)
*/

//const data = await Deno.readFile('pig.png')
//console.log(data)
//console.log(group(1024)(data))
//console.log(data)
//const got_data = await get_file('5f35f0e9f1bac107157e109a')

//await Deno.writeFile('pig2.png', got_data)
//console.log('done')