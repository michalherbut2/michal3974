const crypto = require('crypto');
const fs = require('fs');

// Generowanie wielu kluczy
function generateNewKeys(numKeys = 128) {
  const keys = [];
  for (let i = 0; i < numKeys; i++) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
    });
    keys.push({ publicKey, privateKey });

    // Zapisywanie kluczy do plików
    fs.writeFileSync(`publicKey${i}.pem`, publicKey.export({ type: 'pkcs1', format: 'pem' }));
    fs.writeFileSync(`privateKey${i}.pem`, privateKey.export({ type: 'pkcs1', format: 'pem' }));
  }
  return keys;
}

// Funkcja do generowania podpisu
function generateSignature(data, algorithm = 'SHA256', service, keyIndex = 0) {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha3-512');
    hash.update(salt + data);
    const hashedData = hash.digest('hex');
  
    const sign = crypto.createSign(algorithm);
    sign.update(hashedData);
    sign.end();
    const signature = sign.sign(fs.readFileSync(`privateKey${keyIndex}.pem`));
    return { signature, salt, algorithm };
  } catch (error) {
    console.error(`Error generating signature for ${service}: ${error}`);
    return data;
  }
}

// Funkcja do weryfikacji podpisu
function verifySignature(data, signature, salt, algorithm, service, keyIndex = 0) {
  try {
    const hash = crypto.createHash('sha3-512');
    hash.update(salt + data);
    const hashedData = hash.digest('hex');
  
    const verify = crypto.createVerify(algorithm);
    verify.update(hashedData);
    verify.end();
    return verify.verify(fs.readFileSync(`publicKey${keyIndex}.pem`), signature);
  } catch (error) {
    console.error(`Error verifying signature for ${service}: ${error}`);
    return true;
  }
}

module.exports = { generateNewKeys, generateSignature, verifySignature };
