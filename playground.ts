// Typed Arrays

// create an array of 16bytes
const uint8Array = new Uint8Array(16); // array of 8bit unsigned integers
console.log(uint8Array)

const intarr = new Int8Array(16);

intarr[0] = 128;

intarr[1] = 256;

intarr[2] = 590;


 uint8Array[0] = 128;

 uint8Array[1] = 256;

 uint8Array[2] = 590;

console.log(intarr);
console.log(uint8Array);



/// JWT file


// deno-lint-ignore-file no-explicit-any
import {b64Encode, b64Decode} from './deps.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();



// crypto.subtle api
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
// sign, verify, importKey (maybe generateKey??)

// SubtleCrypto.sign()
// Returns a Promise that fulfills with the signature corresponding to the text, algorithm, and key given as parameters.

// SubtleCrypto.verify()
// Returns a Promise that fulfills with a boolean value indicating if the signature given as a parameter matches the text, algorithm, and key that are also given as parameters.

// SubtleCrypto.importKey()
// Returns a Promise that fulfills with a CryptoKey corresponding to the format, the algorithm, raw key data, usages, and extractability given as parameters.

// 3 Functions


// You will not/are not allowed to use any other imports other than the b64 encode/decode we imported from the Deno std lib
// The crypto and encoding apis are available globally since deno strives to reimplement most web apis as-is (this means you don't need to import anything)
// For creating and verifying the JWT you can hard-code the HMAC SHA-256 algorithm. You don't need to support any algorithms supplied in the header field for the moment (you can  implement this in the future as an interesting exercise if you like). however make sure to still pass in a "valid" header to support this feature in the future.
// If you're curious, take a look at the ArrayBuffer type in JS. The typed arrays we are using, including the uint8 arrays are all views on top of array buffers. This might help if you see array buffer anywhere in an api and are confused what it is vs the typed arrays we looked at. Eg. new ArrayBuffer(64) -> give us a buffer with 64 bytes that is not yet typed so we don't know if it's an int8 array int32 etc...


// take a header, payload, and secret that will sign the payload and return the jwt string
// 1.

//  async function createJWT(header: any, payload: any, secret: string): Promise<string> {
   async function createJWT(header: any, payload: any, secret: string): Promise<string> {

    const encodedHeader = b64Encode(JSON.stringify(header));
    const encodedPayload = b64Encode(JSON.stringify(payload));
    const encodedSecret = textEncoder.encode(secret);


  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
  // https://github.com/mdn/dom-examples/blob/master/web-crypto/sign-verify/hmac.js
    const algo =  { name: "HMAC", hash: { name: "SHA-256" } };


    const key = await crypto.subtle.importKey(
      'raw', encodedSecret, algo, true, ['sign', 'verify']
    )

    const data =  textEncoder.encode(`${encodedHeader}.${encodedPayload}`) ; 

    const signature = await crypto.subtle.sign(algo, key, data);

    const token = `${encodedHeader}.${encodedPayload}.${b64Encode(signature)}`;

    console.log(token, token.length, typeof token)

    console.log('signature is ', signature)

    console.log('json ', payload) //normal json
    console.log('json stringified ', JSON.stringify(payload)) //creates a string
    console.log('text encoder', textEncoder.encode(payload)) // creates a UintArray

    console.log('json encoded ', b64Encode(payload)) // returns empty string
    console.log('json stringified encoded ', b64Encode(JSON.stringify(payload))) // creates an encoded string from the json string
    console.log('text encoder encoded ', b64Encode(textEncoder.encode(payload))) // creates an encoded string from the array so completely different result than using JSON.stringify

    return token;
    
}

const header = {
  "alg": "HS256",
  "typ": "JWT"
}

const payload = {
  "sub": "1234567890",
  "name": "Mina Moo",
}

const secret = 'pingpongpanda';


createJWT(header, payload, secret)


// take the string return from above, verify if secret is same as above
// 2. async function verifyJWT(token: string,secret: string): Promise<boolean> {
    
// }


// interface DecodedJWT {
//     header: any;
//     payload: any;
//     signature: string
// }

// 3. async function decodeJWT(token: string): DecodedJWT {
    
// }


// const token = createJWT(header, payload, secret);
// verifyJWT(token, secret) // pass
// verifyJWT(token, 'anotherSecret') // fail
// decodeJWT(token) => {
//     header, payload: {name: 'bob', age: '5'}, signature: 'somethingSomething'
// }
