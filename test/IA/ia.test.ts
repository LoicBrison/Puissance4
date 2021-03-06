import { beforeEach, describe, it, expect } from 'vitest'
import { interpret, InterpreterFrom } from 'xstate'
import { MinMax } from '../../src/IA/minMax'
import { MinMax2 } from '../../src/IA/minMax2'
import { GameMachine, GameModel, makeGame } from '../../src/machine/GameMachine'
import { canDropGuard } from '../../src/machine/guards'
import { GameContext, PlayerColor, GameStates } from '../../src/types'

describe("ia/MinMax", () => {

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
                // grid: [
                //     ["E","E","E","E","E","Y","R"],
                //     ["E","E","E","E","E","R","Y"],
                //     ["E","E","E","E","E","R","R"],
                //     ["E","E","E","E","E","R","Y"],
                //     ["E","R","E","E","E","Y","R"],
                //     ["E","Y","R","E","Y","Y","Y"]
                // ] 
                grid: [
                    ["E","E","E","E","E","Y","E"],
                    ["E","E","E","E","E","Y","E"],
                    ["E","E","E","E","R","R","E"],
                    ["Y","Y","R","R","Y","Y","E"],
                    ["R","R","R","Y","R","Y","E"],
                    ["R","R","R","Y","R","Y","R"],
                ] 
            }
    
            machine = makeGame(GameStates.PLAY, context)
        })
        

        it('should let me drop a tolken', () => {
            machine.state.context.currentPlayer = machine.state.context.players[0].id
            let minmax2 = new MinMax2(machine.state.context,machine.state.context.players[0])
            let x = minmax2.minMax()
            machine.send(GameModel.events.dropToken(machine.state.context.players[0].id,x))
            console.log(x)
        })

    })

})