import { GameStates, PlayerColor } from "../types"
import { Grid } from "./component/Grid"
import { useGame } from "./hooks/useGame"
import { LobbyScreen } from "./screens/LobbyScreen"
import { PlayScreen } from "./screens/PlayScreen"
import { currentPlayer } from "../func/game"
import { send } from "xstate/lib/actions"
import { VictoryScreen } from "./screens/VictoryScreen"
import { DrawScreen } from "./screens/DrawScreen"


function App() {

  const {state, context, send} = useGame()
  const canDrop = state == GameStates.PLAY
  const player = canDrop ? currentPlayer(context) : undefined
  const dropToken = canDrop ? (x: number) => {
    send({type: 'dropToken', x: x})
  } : undefined


  return (
    <div className="container">
      {state == GameStates.LOBBY && <LobbyScreen/>}
      {state == GameStates.PLAY && <PlayScreen/>}
      {state == GameStates.VICTORY && <VictoryScreen/>}
      {state == GameStates.DRAW && <DrawScreen/>}
      <Grid winingPositions={context.winingPositions} grid={context.grid} onDrop={dropToken} color={player?.color}/>
    </div>
  )
}

export default App
