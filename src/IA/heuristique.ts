import { freePositionY, winingPositions } from "../func/game"
import { GridState, Player, PlayerColor } from "../types"

export const MAX_NOTE = Number.MAX_SAFE_INTEGER
export const MIN_NOTE = Number.MIN_SAFE_INTEGER

export function gridScore(grid: GridState, player: Player, z: number): number {
    let score = 0
    let gridSize = grid[0].length 


    if(player.color == PlayerColor.RED){
        if(winingPositions(grid,  PlayerColor.YELLOW, z, 4).length > 0){
            return MIN_NOTE;
        }
        if(winingPositions(grid,  PlayerColor.RED, z, 4).length > 0){
            return MAX_NOTE;
        }

    }else{
        if(winingPositions(grid,  PlayerColor.RED, z, 4).length > 0){
            return MIN_NOTE;
        }
        if(winingPositions(grid,  PlayerColor.YELLOW, z, 4).length > 0){
            return MAX_NOTE;
        }
    }

    for(let x=0; x < gridSize; x++){
        if(freePositionY(grid,x)!=-1){

            

            score += winingPositions(grid,  player.color!, x, 2).length
            score += 3 * winingPositions(grid,  player.color!, x, 3).length
            score += 9 * winingPositions(grid,  player.color!, x, 4).length
        }
    }
    return score
}