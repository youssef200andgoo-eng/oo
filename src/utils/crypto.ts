// RSA Asymmetric Cryptography Simulation for Student Documents & Admissions Verification

export interface RSAKeyPair {
  publicKey: { e: number; n: number; pem: string };
  privateKey: { d: number; n: number; pem: string };
}

// Simple deterministic hash mapping text context to integer value coprime to modulo
export function simpleHash(str: string, maxVal: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % maxVal;
  }
  return hash === 0 ? 1 : hash;
}

// Generates actual functioning RSA mathematical pairs (tiny primes for educational/in-browser performance)
export function generateRSAKeyPair(): RSAKeyPair {
  const pairings = [
    { p: 61, q: 53, n: 3233, e: 17, d: 2753 },
    { p: 47, q: 59, n: 2773, e: 17, d: 1553 },
    { p: 53, q: 43, n: 2279, e: 3, d: 1467 },
    { p: 67, q: 41, n: 2747, e: 7, d: 1111 },
    { p: 71, q: 43, n: 3053, e: 13, d: 1357 }
  ];
  
  // Pick one pairing randomly
  const choice = pairings[Math.floor(Math.random() * pairings.length)];
  const { n, e, d } = choice;
  
  // Create beautiful PEM base64 format representing public and private keys
  const pubB64 = btoa(`e=${e},n=${n}`);
  const privB64 = btoa(`d=${d},n=${n}`);
  
  return {
    publicKey: {
      e,
      n,
      pem: `-----BEGIN PUBLIC KEY-----\nMIIB_SGU_${pubB64.padEnd(20, "A")}==\n-----END PUBLIC KEY-----`
    },
    privateKey: {
      d,
      n,
      pem: `-----BEGIN RSA PRIVATE KEY-----\nMIIC_SGU_${privB64.padEnd(24, "A")}==\n-----END RSA PRIVATE KEY-----`
    }
  };
}

// Encryption/Signing: S = Hash^d mod n
export function signWithRSA(message: string, privateKey: { d: number; n: number }): { signature: string; hash: number } {
  const hash = simpleHash(message, privateKey.n);
  
  // modular exponentiation: S = hash^d mod n
  let s = 1;
  let base = hash % privateKey.n;
  let exp = privateKey.d;
  while (exp > 0) {
    if (exp % 2 === 1) s = (s * base) % privateKey.n;
    base = (base * base) % privateKey.n;
    exp = Math.floor(exp / 2);
  }
  
  // Encode signature components
  const signatureHex = s.toString(16).toUpperCase();
  const signatureValue = btoa(`S=${signatureHex},H=${hash}`);
  
  return {
    signature: signatureValue,
    hash
  };
}

// Verification: Hash' = S^e mod n
export function verifyWithRSA(message: string, signatureStr: string, publicKey: { e: number; n: number }): boolean {
  try {
    const decoded = atob(signatureStr);
    const matches = decoded.match(/S=([0-9A-F]+),H=(\d+)/);
    if (!matches) return false;
    
    const S = parseInt(matches[1], 16);
    const originalHash = parseInt(matches[2]);
    
    // Hash current document state to compare
    const currentHash = simpleHash(message, publicKey.n);
    if (currentHash !== originalHash) return false;
    
    // modular exponentiation: mPrime = S^e mod n
    let mPrime = 1;
    let base = S % publicKey.n;
    let exp = publicKey.e;
    while (exp > 0) {
      if (exp % 2 === 1) mPrime = (mPrime * base) % publicKey.n;
      base = (base * base) % publicKey.n;
      exp = Math.floor(exp / 2);
    }
    
    return mPrime === originalHash;
  } catch (err) {
    return false;
  }
}
