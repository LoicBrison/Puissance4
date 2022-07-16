import { currentPlayer, freePositionY, winingPositions } from "../func/game";
import { GameAction, GameContext } from "../types";

export const joinGameAction: GameAction<"join"> = (context, event) => ({
    players: [...context.players, {id: event.playerId, name: event.name}]
})

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
    players: [...context.players.filter(p => p.id != event.playerId)]
})

export const dropTokenAction: GameAction<"dropToken"> = ({grid, players}, {x: eventX, playerId}) => {
    const playerColor = players.find(p => playerId == p.id)!.color!
    const eventY = freePositionY(grid, eventX)
    const newGrid = grid.map((row,y ) => row.map((v, x) => x == eventX && y == eventY ? playerColor : v))
    return {
        grid: newGrid
    }
}

export const switchPlayerAction = (context: GameContext) => ({
    currentPlayer: context.players.find(p => p.id != context.currentPlayer)!.id
})

export const saveWiningPositions: GameAction<"dropToken"> = (context, event) => ({
    winingPositions: winingPositions(
        context.grid,
        currentPlayer(context).color!,
        event.x,
        context.rowLength
    )
})