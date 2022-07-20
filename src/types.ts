import { ContextFrom, EventFrom } from "xstate"
import { GameModel } from "./machine/GameMachine"

export enum PlayerColor {
    RED = 'R',
    YELLOW = 'Y'
}

export enum GameStates {
    LOBBY = 'LOBBY',
    PLAY = 'PLAY',
    VICTORY = 'VICTORY',
    DRAW = 'DRAW'
}

export enum QueryParams {
    GAMEID = 'gameId'
}

export enum ServerErrors {
    AuthError
}

export type Player = {
    id: string,
    name: string,
    color?: PlayerColor
}

export type PlayerSession = {
    id: string,
    name: string,
    signature: string
}
export type Position = {
    x: number,
    y: number
}

export type CellEmpty = 'E'
export type CellState = PlayerColor.RED | "R" | PlayerColor.YELLOW | "Y" | CellEmpty
export type GridState = CellState[][]
export type GameContext = ContextFrom<typeof GameModel>
export type GameEvents = EventFrom<typeof GameModel>
export type GameEvent<T extends GameEvents['type']> = GameEvents & {type : T}
export type GameGuard<T extends GameEvents['type']> = (
    context: GameContext,
    event: GameEvent<T>
) => boolean
export type GameAction<T extends GameEvents['type']> = (
    context: GameContext,
    event: GameEvent<T>
) => Partial<GameContext>