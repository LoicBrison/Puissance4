import { GameStates, PlayerColor, ServerErrors } from "../types"
import { Grid } from "./component/Grid"
import { useGame } from "./hooks/useGame"
import { LobbyScreen } from "./screens/LobbyScreen"
import { PlayScreen } from "./screens/PlayScreen"
import { currentPlayer } from "../func/game"
import { send } from "xstate/lib/actions"
import { VictoryScreen } from "./screens/VictoryScreen"
import { DrawScreen } from "./screens/DrawScreen"
import { LoginScreen } from "./screens/LoginScreen"
import { useEffect } from "react"
import { getSession, logout } from "./func/session"


function App() {

  const {state, context, send, playerId} = useGame()
  const canDrop = state == GameStates.PLAY
  const player = canDrop ? currentPlayer(context) : undefined
  const dropToken = canDrop ? (x: number) => {
    send({type: 'dropToken', x: x})
  } : undefined

  useEffect(() => {
    if(playerId){
      const searchParams = new URLSearchParams({
        id: playerId,
        signature: getSession()!.signature!,
        name: getSession()!.name!,
        gameId: 'test', 
      })
      const socket = new WebSocket(
        `${window.location.protocol.replace('http','ws')}//${window.location.host}/ws?${searchParams.toString()}`
      )

      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        if(message.type == 'error' && message.code == ServerErrors.AuthError){
          logout();
        }
      })
    }
  })

  if(!playerId){
    return (
      <div className="container">
        <LoginScreen />
      </div>
    )
  }

  return (
    <div className="container">
      PlayerId = {playerId}
      {state == GameStates.LOBBY && <LobbyScreen/>}
      {state == GameStates.PLAY && <PlayScreen/>}
      {state == GameStates.VICTORY && <VictoryScreen/>}
      {state == GameStates.DRAW && <DrawScreen/>}
      <Grid winingPositions={context.winingPositions} grid={context.grid} onDrop={dropToken} color={player?.color}/>
    </div>
  )
}

export default App
