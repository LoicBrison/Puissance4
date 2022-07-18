import { Context, createContext, PropsWithChildren, useContext } from "react"
import { useMachine } from "@xstate/react"
import { GameMachine } from "../../machine/GameMachine"
import { GameContext, GameEvent, GameEvents, GameStates, Player } from "../../types"

type GameContextType = {
    state: GameStates,
    context: GameContext,
    send: <T extends GameEvents["type"]>(event: {type: T, playerId?: string} &Omit<GameEvent<T>, 'playerId'>) => void,
    can: <T extends GameEvents["type"]>(event: {type: T, playerId?: string} &Omit<GameEvent<T>, 'playerId'>) => boolean,
    playerId: Player["id"]
}

const ContextGame = createContext<GameContextType>({} as any)

export function useGame(): GameContextType {
    return useContext(ContextGame)
}   

export function GameContextProvider({children}: PropsWithChildren){
    const [state, send] = useMachine(GameMachine)
    const playerId =  state.context.currentPlayer ?? ''

    return <ContextGame.Provider value={{
        playerId,
        state: state.value as GameStates,
        context: state.context,
        send: (event) => send({playerId, ...event} as GameEvents),
        can: (event) => !!GameMachine.transition(state, {playerId, ...event} as GameEvents).changed
    }}>
        {children}
    </ContextGame.Provider>
}
