// deno-lint-ignore-file no-explicit-any
import {b64Encode, b64Decode} from './deps.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();



// crypto.subtle api
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
// sign, verify, importKey

// SubtleCrypto.sign()
// Returns a Promise that fulfills with the signature corresponding to the text, algorithm, and key given as parameters.

// SubtleCrypto.verify()
// Returns a Promise that fulfills with a boolean value indicating if the signature given as a parameter matches the text, algorithm, and key that are also given as parameters.

// SubtleCrypto.importKey()
// Returns a Promise that fulfills with a CryptoKey corresponding to the format, the algorithm, raw key data, usages, and extractability given as parameters.

// 3 Functions

// take a header, payload, and secret that will sign the header and payload and return the jwt string
// 1.

//  async function createJWT(header: any, payload: any, secret: string): Promise<string> {
   async function createJWT(header: any, payload: any, secret: string): Promise<string> {

    const encodedHeader = b64Encode(JSON.stringify(header));
    const encodedPayload = b64Encode(JSON.stringify(payload));
    const encodedSecret = textEncoder.encode(secret);

    const algo =  { name: "HMAC", hash: { name: "SHA-256" } };


    const key = await crypto.subtle.importKey(
      'raw', encodedSecret, algo, true, ['sign', 'verify']
    )

    const unsignedData =  textEncoder.encode(`${encodedHeader}.${encodedPayload}`) ; 

    const signedData = await crypto.subtle.sign(algo, key, unsignedData);

    const token = `${encodedHeader}.${encodedPayload}.${b64Encode(signedData)}`;

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

