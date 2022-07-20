import type { ReactNode } from "react";
import { choose } from "xstate/lib/actionTypes";
import { prevent } from "../../func/dom";
import { chooseColorAction } from "../../machine/action";
import { PlayerColor } from "../../types";
import { ColorSelector } from "../component/ColorSelector";
import { copyUrl } from "../func/url";
import { useGame } from "../hooks/useGame";



type LobbyScreenProps = {
}

export function LobbyScreen({}: LobbyScreenProps){
    const {send, context, can} = useGame()
    const colors = [PlayerColor.RED, PlayerColor.YELLOW ] 

    const chooseColor = (color: PlayerColor) => send({type: 'chooseColor', color})
    const startGame = () => send({type: 'start'})
    const copyUrlToClipboard = () => copyUrl()

    const canStart = can({type: 'start'})

    return <div>
        
        <ColorSelector onSelect={chooseColor} players={context.players} colors={colors}/>
        <p>
            <button className="button" onClick={prevent(copyUrlToClipboard)}>Copier l'url</button>
            <button disabled={!canStart} style={{float: 'right'}} className="button" onClick={prevent(startGame)}>Démarrer</button>
        </p>
    </div>
}