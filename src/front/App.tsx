import { PlayerColor } from "../types"
import { ColorSelector } from "./component/ColorSelector"
import { NameSelector } from "./component/NameSelector"
import { Grid } from "./component/Grid"
import { GameInfo } from "./component/GameInfo"
import { Victory} from "./component/Victory"


function App() {

  return (
    <div className="container">
      <NameSelector onSelect={() => null}/>
      <hr/>
      <ColorSelector onSelect={() => null} players={[{
        id: '1',
        name: 'John',
        color: PlayerColor.RED
      },{
        id: '2',
        name: 'Jahn',
        color: PlayerColor.YELLOW
      }]} colors={[PlayerColor.RED, PlayerColor.YELLOW]}/>
      <hr/>
      <GameInfo name="John" color={PlayerColor.RED}/>
      <Victory name="John" color={PlayerColor.RED}/>
      <Grid
        color={PlayerColor.RED}
        onDrop={console.log}
        grid={[
            ["E","E","E","E","E","E","R"],
            ["E","E","E","E","E","R","Y"],
            ["E","E","E","E","E","R","R"],
            ["E","E","E","E","E","R","Y"],
            ["E","E","E","E","E","Y","R"],
            ["E","E","E","E","E","Y","Y"]
        ]} />
      
    </div>
  )
}

export default App
