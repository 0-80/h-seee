nessiebox
==========
2020 capital one software engineering summit hackathon

description
------------
store arbitrary data in nessie, capital one's hackathon API

usage
------
`./nessiebox.js` exports two functions:
- `nessie_upload_bytes`: uploads a Uint8Array into nessie
	- *nessie api key* => *Uint8Array* => *a 'uid' string (used by `nessie_download_bytes`)*
- `nessie_download_bytes`: downloads a Uint8Array from nessie
	- *a 'uid' string (produced by `nessie_upload_bytes`)* => *Uint8Array*

for a demo/example that uses Deno to save/write from local filesystem, see [`./demo.js`](./demo.js) (it should download a picture of a pig and a picture of a graph -- hopefully nobody has tampered with the data yet !!)

notes
------
- all nessie API keys are read+write so anyone that can download a file can also change the file (on nessie)
- nessiebox is written only with ES6 WebAPIs so you can HTML inline it or run w/ Deno
	- [`./download.html`](./download.html) is an inlined example but only works when served over HTTP because it directly accesses nessie (nessie doesn't enforce CORS), which is only served over HTTP.

background
-----------
I asked people I knew for ideas and received this cool idea of like a 'visual piggy bank' where it would display your bank account and a little pig avatar whose condition would represent the state of your bank account

so it would make you spend more responsibly to take care of the cute pig

I was going to do that but then spent half a day trying to figure out how to programatically log into my capital one bank account only to find out that they really don't want to and it would probably be breaking some kind of policy if I did

and that defeat kind of killed my motivation for the cute piggy bank idea... so I took a break and did some more thinking.

during my break I remembered that capital one gave us a 'nessie' API that simulated bank transactions

and I thought 'what if instead of transactions you store music notes?'

and then it was something like 'what if you store music notes' => 'what if you store partial music files and then you can stream them' => 'what about just storing files'

I was hesitant to do a project like this because it's kinda sus and I doubt anyone ever wanted people to store arbitrary data in their API not meant for storing arbitrary data

but it sounded like a fun challenge and I was short on time so I just went and did it

apology
--------
I feel like I should apologize for making this because it's kind of just a big abuse of an API meant for 'reinventing banking for good'

I am sorry