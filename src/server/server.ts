
import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyWebSocket from '@fastify/websocket'
import FastifyView from '@fastify/view'
import ejs from 'ejs'
import { v4 } from 'uuid'
import { sign, verify } from './func/crypto'
import { resolve } from 'path'
import { ServerErrors } from '../types'
import { ConnectionRepository } from './repositories/ConnectionRepository'
import { GameRepository } from './repositories/GamesRepository'
import { GameModel } from '../machine/GameMachine'
import { publishMachine } from './func/socket'
import { readFileSync } from 'fs'

const connections = new ConnectionRepository()
const games = new GameRepository(connections)
const env = process.env.NODE_ENV as 'dev' | 'prod'
let manifest = {}
try {
    const manifestData = readFileSync('./public/assets/manifest.json')
    manifest = JSON.parse(manifestData.toLocaleString())
} catch(e) {

}

const fastify = Fastify({logger: true})
fastify.register(FastifyView, {
    engine: {
        ejs: ejs
    }
})
fastify.register(FastifyStatic, {
    root: resolve("./public")
})
fastify.register(FastifyWebSocket)
fastify.register(async (f) => {
    f.get('/ws', {websocket: true}, (connection, req) => {
        const query = req.query as Record<string,string>
        const playerId = query.id ?? '' 
        const signature = query.signature ?? ''
        const playerName = query.name || 'Alibaba'
        const gameId = query.gameId

        if(!gameId){
            connection.end()
            f.log.error('Pas de gameId')
            return;
        }

        if(!verify(playerId, signature)){
            f.log.error(`Erreur d'authentification`)
            connection.socket.send(JSON.stringify({
                type: 'error',
                code: ServerErrors.AuthError
            }))
            return;
        }

        const game = games.find(gameId) ?? games.create(gameId)
        connections.persist(playerId, gameId, connection)
        game.send(GameModel.events.join(playerId, playerName))
        publishMachine(game.state, connection)

        connection.socket.on('message', (rawMessage) => {
            const message = JSON.parse(rawMessage.toLocaleString())
            if(message.type == 'gameUpdate'){
                game.send(message.event)
            }
        })

        connection.socket.on('close', () => {
            connections.remove(playerId,gameId)
            game.send(GameModel.events.leave(playerId))
            games.clean(gameId)
        })
    })
})

fastify.get('/', (req, res) => {
    res.view("/templates/index.ejs", { manifest, env: process.env.NODE_ENV })
})


fastify.post('/api/players', (req, res) => {
    const playerId = v4()
    const signature = sign(playerId)

    res.send({
        id: playerId,
        signature: sign(playerId)
    })
})

fastify.listen({port: 8000}).catch((err) => {
    fastify.log.error(err),
    process.exit(1)
}).then(() => {
    fastify.log.info('Le serveur écoute sur le port 8000')
})
