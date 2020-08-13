# development log

## 18:48
i thought of a fun idea... storing arbitrary data in the API thing they gave us???

i'm afraid this is too obviously API abuse though and maybe I should do something silly like a 'quine' where i store a webpage in the API which gets the webpage in the API???

"storing a program that downloads itself from nessie in nessie"

## 16:10
ok so after some investigation it seems like capital one really doesn't want people to programatically log in... i think they use some kind of security similar to [this](https://github.com/sonya75/starbucks-botdetection-cracked), and i dont really want to
1. put that much effort into bypassing the security
2. bypass the security in the first place since they prob don't want people to do that

so i could probably either do something like
1. make a demo that just works based off of a session id that i have *after* logging in
2. scrap this idea and do something else

## 14:31
emulated payload almost exactly im pretty sure and still doesnt work... so am guessing need to send some kind of cookies also

## 13:47
so when i log in unsuccessfully on chrome it responds w/ diff error code when i try to copy the same request into curl... so am guessing there is some kind of unique one-time-use transaction-type thing and i have to find that...

## 13:44
so i found out that RSA does some crazy salt stuff or something randomly and yeah idk but i think it doesnt matter for me unless im implementing RSA myself...

so will move on from encryption and see how to log in with the encrypted credentials...

## 13:14
so i downloaded the same [crypto library](https://github.com/kjur/jsrsasign) and tried it out and it literally does produce diff hash each time... pretty wild... i guess i need to do some more reading

```html
<script src="jsrs.js"></script>
<script>
const c1key = `the public key`
// produces diff hash each time wow
console.log(KJUR.crypto.Cipher.encrypt('z', KEYUTIL.getKey(c1key)))
</script>
```

## 12:54
it seems that `t.prototype._encrypt` returns actually a diff encryption for same string... so am guessing there's some other input changing it??? public key is same...

## 12:23
not sure if i should even look to hook up this piggy bank to actual bank account but am currently exploring possibility

hopefully I won't get in trouble for poking around

```javascript
t.prototype._encrypt = function(t) {
	var e = this._getAppConfigItem("publickey");
	return Object(s.hex2b64)(s.KJUR.crypto.Cipher.encrypt(t.trim(), s.KEYUTIL.getKey(e)))
}
```

atm i am under impresssion that to sign into capital one you basically just POST some kind of long encrypted string to their auth endpoint... am not sure how the long string is formed so poked around in chrome dev tools until found the above code snippet...

i noticed when submitting multiple login requests with same user/pass that the long encrypted string was diff... so guessed that the public key changes? but it seems to not...

## 2020/8/13 11:17
initial concept ideas:

- represent a checking account set amount as a cute pig
- e.g. a checking account set at $200:
	- at $200 the pig is fat and healthy
	- at $150 the pig looks a bit tired
	- at $100 the pig looks a bit emaciated
	- at $50 ???
	- $0: ????????
- show all transactions in big red numbers to make you feel guilty about spending?

initial tech ideas:

- single page application that can connect to bank account
- visit page to see whole overview. pig at top; transactions list below pig
	- on new transactions show sad decline of pig health animations?
- SHOW REPLENISHES OF CHECKING ACCOUNT... LIKE PIG IS ON Xth LIFE