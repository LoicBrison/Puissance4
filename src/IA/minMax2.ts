import { InterpreterFrom } from "xstate";
import { countEmptyCells, freePositionY } from "../func/game";
import { GameMachine, GameModel, makeGame } from "../machine/GameMachine";
import { GameContext, GameStates, GridState, Player } from "../types";
import { gridScore, MAX_NOTE, MIN_NOTE } from "./heuristique";

export class MinMax2{

    context: GameContext
    player: Player
    otherPlayer: Player
    gridSize: number
    machine: InterpreterFrom<typeof GameMachine>
    height: number
    wight: number

    constructor(context: GameContext, player: Player){
        this.context = context
        this.player = player
        this.otherPlayer = context.players.find(p => p.id != this.player.id)!
        this.machine = makeGame(GameStates.PLAY, context)
        this.gridSize = this.machine.state.context.grid[0].length
        this.wight = this.machine.state.context.grid[0].length
        this.height = this.machine.state.context.grid.length
    }

    minMax(): number {
        let columnToAdd = 0
        let gameValue = MIN_NOTE
        
        for(let i=0; i< this.gridSize; i++){
            if(freePositionY(this.machine.state.context.grid,i)!=-1){
                let machineCopy = this.machine
                this.dropToken(machineCopy, this.player, i)
                let actualGameValue = this.min(machineCopy, this.otherPlayer, i, 1)
                console.log("actualGameValue: "+actualGameValue+"  x:"+i)
                if(actualGameValue > gameValue){
                    gameValue = actualGameValue
                    columnToAdd = i
                }
            }
        }

        return columnToAdd
    }

    min(machine: InterpreterFrom<typeof GameMachine>, player: Player, x: number, depth: number): number {
        if(depth==0 || this.isFull(machine)){
            return gridScore(machine.state.context.grid, player, x);
        }
        else{
            let gameValue = MAX_NOTE
            for(let i=0; i < this.gridSize; i++){
                if(freePositionY(machine.state.context.grid,i)!=-1){
                    let machineCopy = machine
                    this.dropToken(machineCopy, player, i)
                    let actualGameValue = this.max(machineCopy, this.player, depth-1, x)
                    if(actualGameValue < gameValue){
                        gameValue = actualGameValue
                    }
                }
            }
            return  gameValue;
        }
    }

    max(machine: InterpreterFrom<typeof GameMachine>, player: Player, x: number, depth: number): number {
        if(depth==0 || this.isFull(machine)){
            return gridScore(machine.state.context.grid, player, x);
        }
        else{
            let gameValue = MIN_NOTE
            for(let i=0; i < this.gridSize; i++){
                if(freePositionY(machine.state.context.grid,i)!=-1){
                    let machineCopy = machine
                    this.dropToken(machineCopy, player, i)
                    let actualGameValue = this.min(machineCopy, this.otherPlayer, depth-1, x)
                    if(actualGameValue > gameValue){
                        gameValue = actualGameValue
                    }
                }
            }
            return  gameValue;
        }
    }

    dropToken(machine: InterpreterFrom<typeof GameMachine>, player: Player, x: number){
        machine.state.context.currentPlayer = player.id
        machine.send(GameModel.events.dropToken(player.id, x))
    }

    isFull(machine: InterpreterFrom<typeof GameMachine>,): boolean{
        if(countEmptyCells(machine.state.context.grid)>0){
            return false;
        }
        else{
            return true;
        }
    }
}

