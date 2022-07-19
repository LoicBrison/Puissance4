import { generateKeyPairSync } from 'node:crypto'
import { writeFileSync } from 'fs'

const {privateKey} = generateKeyPairSync('rsa',{
    modulusLength: 2048,
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem"
    }
})

writeFileSync("privateKey.pem",privateKey)


