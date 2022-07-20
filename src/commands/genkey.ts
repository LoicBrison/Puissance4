import { generateKeyPairSync } from 'node:crypto'
import { writeFileSync } from 'fs'

const {privateKey} = generateKeyPairSync('rsa',{
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    }
})

writeFileSync("privateKey.pem",privateKey)


