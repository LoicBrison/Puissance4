import { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"
import { useMachine } from "@xstate/react"
import { GameMachine, makeGame } from "../../machine/GameMachine"
import { GameContext, GameEvent, GameEvents, GameStates, Player, PlayerSession, QueryParams, ServerErrors } from "../../types"
import { getSession, logout } from "../func/session"
import ReconnectingWebSocket from "reconnecting-websocket"
import { urlSearchParams } from "../func/url"
import { InterpreterFrom } from "xstate"

type GameContextType = {
    state: GameStates,
    context: GameContext,
    connect: (session: PlayerSession, gameId: string) => void,
    send: <T extends GameEvents["type"]>(event: {type: T, playerId?: string} &Omit<GameEvent<T>, 'playerId'>) => void,
    can: <T extends GameEvents["type"]>(event: {type: T, playerId?: string} &Omit<GameEvent<T>, 'playerId'>) => boolean,
    playerId: Player["id"]
}

const ContextGame = createContext<GameContextType>({} as any)

export function useGame(): GameContextType {
    return useContext(ContextGame)
}   

export function GameContextProvider({children}: PropsWithChildren){
    const [machine, setMachine] = useState<InterpreterFrom<typeof GameMachine>>(makeGame())
    const [playerId, setPlayerId] = useState('')
    const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null)
    const sendWithPlayer = useCallback<GameContextType["send"]>((event) => {
        const eventWithPlayer = {playerId, ...event}
        socket?.send(JSON.stringify({type: 'gameUpdate', event: eventWithPlayer}))
    }, [playerId])
    const can = useCallback<GameContextType["can"]>((event) => !!GameMachine.transition(machine?.state, {playerId, ...event} as GameEvents).changed, [machine?.state, playerId])
    const connect: GameContextType["connect"] = (session, gameId) => {
        const searchParams = new URLSearchParams({
            ...session,
            gameId
        })
        setPlayerId(session.id)
        const socket = new ReconnectingWebSocket(
            `${window.location.protocol.replace('http','ws')}//${window.location.host}/ws?${searchParams.toString()}`
        )
        setSocket(socket)
    }

    useEffect(() => {
        if(!socket){
            const gameId = urlSearchParams().get(QueryParams.GAMEID)
            const session = getSession()
            if(gameId && session){
                connect(session, gameId)
                setPlayerId(session.id)
            }
            return;
        }

        const onMessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data)
            if(message.type == 'error' && message.code == ServerErrors.AuthError){
                logout()
                setPlayerId('')
            }
            else if (message.type == 'gameUpdate'){
                setMachine(makeGame(message.state, message.context))
            }
        }
        socket.addEventListener('message', onMessage)
        return () => {
            socket.removeEventListener('message', onMessage)
        }

    }, [socket])

    return <ContextGame.Provider value={{
        playerId,
        state: machine?.state.value as GameStates,
        context: machine?.state.context,
        send: sendWithPlayer,
        can: can,
        connect
    }}>
        {children}
    </ContextGame.Provider>
}
