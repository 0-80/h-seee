#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { nessie_upload_bytes, nessie_download_bytes } from './nessiebox.js'

const upload = path => api =>
	Deno.readFile(path).then(nessie_upload_bytes(api))

const download = path => uid_str =>
	nessie_download_bytes(uid_str).then(data => Deno.writeFile(path, data))

await download('downloaded_pig.png')('213c0b2c737e19611ba9c9ae094892d8:5f35fe20f1bac107157e10aa')
await download('downloaded_graph.png')('213c0b2c737e19611ba9c9ae094892d8:5f367ea3f1bac107157e10c2')