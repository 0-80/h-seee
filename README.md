nessiebox
==========
2020 capital one software engineering summit hackathon

description
------------
store arbitrary data in nessie, capital one's hackathon API

usage
------
`./nessiebox.js` exports two functions:
- `nessie_upload_bytes`: nessie api key => Uint8Array => a 'uid' string that can be used by `nessie_download_bytes`
	- uploads the Uint8Array into nessie
- `nessie_download_bytes`: 'uid' string (produced by `nessie_upload_bytes`) => Uint8Array
	- fetches Uint8Array from nessie with the given 'uid' string

for a demo/example that uses Deno to save/write from local filesystem, see [./demo.js](./demo.js)

background
-----------
I asked people I knew for ideas and received this cool idea of like a 'visual piggy bank' where it would display your bank account and a little pig avatar whose condition would represent the state of your bank account

so it would make you spend more responsibly to take care of the cute pig

I was going to do that but then spent half a day trying to figure out how to programatically log into my capital one bank account only to find out that they really don't want to and it would probably be breaking some kind of policy if I did

and that defeat kind of killed my motivation for the cute piggy bank idea... so I took a break and did some more thinking.

during my break I remembered that capital one gave us a 'nessie' API that simulated bank transactions