import { beforeEach, describe, it, expect } from 'vitest'
import { interpret, InterpreterFrom } from 'xstate'
import { winingPositions } from '../../src/func/game'
import { GameMachine, GameModel, makeGame } from '../../src/machine/GameMachine'
import { canDropGuard } from '../../src/machine/guards'
import { GameContext, PlayerColor, GameStates } from '../../src/types'

describe("machine/GameMachine", () => {

    describe("join", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(()=>{
            machine = interpret(GameMachine).start()
        })

        it('should let a player join',()=>{
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true)
            expect(machine.state.context.players).toHaveLength(1)
            expect(machine.send(GameModel.events.join("2","2")).changed).toBe(true)
            expect(machine.state.context.players).toHaveLength(2)
        })

        it('should not let me join a game twice',()=>{
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true)
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(false)
            expect(machine.state.context.players).toHaveLength(1)
        })
    })

    describe("dropToken", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            const context: Partial<GameContext> = {
                players: [
                    {
                        id: '1',
                        name: '1',
                        color: PlayerColor.RED
                    },
                    {
                        id: '2',
                        name: '2',
                        color: PlayerColor.YELLOW
                    }
                ],
                currentPlayer: '1',
                grid: [
                    ["E","E","E","E","E","E","R"],
                    ["E","E","E","E","E","R","Y"],
                    ["E","E","E","E","E","R","R"],
                    ["E","E","E","E","E","R","Y"],
                    ["E","E","E","E","E","Y","R"],
                    ["E","E","E","E","E","Y","Y"]
                ] 
            }
    
            machine = makeGame(GameStates.PLAY, context)
        })
        

        it('should let me drop a tolken', () => {
            expect(machine.send(GameModel.events.dropToken("1",0)).changed).toBe(true)
            expect(machine.state.context.grid[5][0]).toBe(PlayerColor.RED)
            expect(machine.state.value).toBe(GameStates.PLAY)
            expect(machine.state.context.currentPlayer).toBe("2")

        })

        it('should not let me drop a tolken on filled columns', () => {
            expect(machine.send(GameModel.events.dropToken("1",6)).changed).toBe(false)
        })

        it('should make me win', () => {
            expect(machine.send(GameModel.events.dropToken("1",5)).changed).toBe(true)
            expect(machine.state.value).toBe(GameStates.VICTORY)
            expect(machine.state.context.winingPositions).toHaveLength(4)
        })

        // it('should say me winPosition', () => {
        //     console.log("WiningPosition:")
        //     console.log(winingPositions(
        //         machine.state.context.grid,
        //         machine.state.context.players[0].color!,
        //         5,
        //         4))
        // })

        it('should handle draw', () => {
            machine = makeGame(GameStates.PLAY, {
                ...machine.state.context,
                grid: [
                    ["E","Y","Y","Y","Y","Y","Y"],
                    ["Y","Y","Y","Y","Y","Y","Y"],
                    ["Y","Y","Y","Y","Y","Y","Y"],
                    ["Y","Y","Y","Y","Y","Y","Y"],
                    ["Y","Y","Y","Y","Y","Y","Y"],
                    ["Y","Y","Y","Y","Y","Y","Y"]
                ]
            }) 
            expect(machine.send(GameModel.events.dropToken("1",0)).changed).toBe(true)
            expect(machine.state.value).toBe(GameStates.DRAW)
        })
    })

})