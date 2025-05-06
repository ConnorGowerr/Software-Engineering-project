const crypto = require('crypto');
const { randomBytes } = require('node:crypto');

function stringEncryption(inputDataString) {
    const aad = Buffer.from('0123456789', 'utf8'); 
    const randomiv = randomBytes(12);
    const password = crypto.createHash('sha256').update('HELLO THERE').digest(); 

    const cipher = crypto.createCipheriv('aes-256-gcm', password, randomiv, {
        authTagLength: 16
    });

    cipher.setAAD(aad);

    let finalText = Buffer.concat([cipher.update(inputDataString, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return { finalText, randomiv, tag, aad };
}

function stringDecryption({ finalText, randomiv, tag, aad }) {
    const password = crypto.createHash('sha256').update('HELLO THERE').digest(); 

    const decipher = crypto.createDecipheriv('aes-256-gcm', password, randomiv, {
        authTagLength: 16
    });

    decipher.setAuthTag(tag);
    decipher.setAAD(aad);

    let receivedPlainText = Buffer.concat([decipher.update(finalText), decipher.final()]).toString('utf8');

    return receivedPlainText;
}
