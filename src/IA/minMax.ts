import { InterpreterFrom } from "xstate";
import { freePositionY } from "../func/game";
import { GameMachine, GameModel, makeGame } from "../machine/GameMachine";
import { GameContext, GameStates, GridState, Player } from "../types";
import { gridScore, MAX_NOTE, MIN_NOTE } from "./heuristique";

export class MinMax{

    context: GameContext
    player: Player
    otherPlayer: Player
    gridSize: number 

    constructor(context: GameContext, player: Player){
        this.context = context
        this.player = player
        this.otherPlayer = context.players.find(p => p.id != this.player.id)!
        let machine = makeGame(GameStates.PLAY, context)
        this.gridSize = machine.state.context.grid[0].length
    }

    calcColumnToAdd(context: GameContext, player: Player): number {
        const machine = makeGame(GameStates.PLAY, context)
        let columnToAdd = 0
        let gameValue = MIN_NOTE
        // console.log("gameValue: "+gameValue)
    

        for(let i=0; i < this.gridSize; i++){
            if(freePositionY(machine.state.context.grid,i)!=-1){
                let machineCopy = machine
                machineCopy.state.context.currentPlayer = player.id
                machineCopy.send(GameModel.events.dropToken(player.id,i))
                let actualGameValue = this.minmax(machineCopy, player, 3, i)
                // console.log("actualGameValue: "+actualGameValue+"  x: "+i)
                if(actualGameValue > gameValue){
                    gameValue = actualGameValue
                    columnToAdd = i
                    // console.log("gameValue: "+gameValue+"  columnToAdd: "+columnToAdd)
                }
            }
        }
    
        console.log("gameValue: "+gameValue+"  columnToAdd: "+columnToAdd)
        return columnToAdd;
    }
    
    minmax(machine: InterpreterFrom<typeof GameMachine>, player: Player, depth: number, x: number): number {
        return this.min(machine, player, depth, x);
    }
    
    min(machine: InterpreterFrom<typeof GameMachine>, player: Player, depth: number, x: number): number {
        if(depth!=0){
            let gameValue = MAX_NOTE
            for(let i=0; i < this.gridSize; i++){
                if(freePositionY(machine.state.context.grid,i)!=-1){
                    let machineCopy = machine
                    machineCopy.state.context.currentPlayer = this.otherPlayer.id
                    machineCopy.send(GameModel.events.dropToken(this.otherPlayer.id, i))
                    let actualGameValue = this.max(machineCopy, player, depth-1, x)
                    if(actualGameValue < gameValue){
                        gameValue = actualGameValue
                    }
                }
            }
            return  gameValue;
        }
        return gridScore(machine.state.context.grid, player, x);
    }
    
    max(machine: InterpreterFrom<typeof GameMachine>, player: Player, depth: number, x: number): number {
        if(depth!=0){
            let gameValue = MIN_NOTE
            for(let i=0; i < this.gridSize; i++){
                if(freePositionY(machine.state.context.grid,i)!=-1){
                    let machineCopy = machine
                    machineCopy.state.context.currentPlayer = player.id
                    machineCopy.send(GameModel.events.dropToken(player.id, i))
                    let actualGameValue = this.min(machineCopy, player, depth-1, x)
                    if(actualGameValue > gameValue){
                        gameValue = actualGameValue
                    }
                }
            }
            return  gameValue;
        }
        return gridScore(machine.state.context.grid, player, x);
    }
}

