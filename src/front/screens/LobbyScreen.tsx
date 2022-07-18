import type { ReactNode } from "react";
import { choose } from "xstate/lib/actionTypes";
import { prevent } from "../../func/dom";
import { chooseColorAction } from "../../machine/action";
import { PlayerColor } from "../../types";
import { ColorSelector } from "../component/ColorSelector";
import { NameSelector } from "../component/NameSelector";
import { useGame } from "../hooks/useGame";



type LobbyScreenProps = {
}

export function LobbyScreen({}: LobbyScreenProps){
    const {send, context, can} = useGame()
    const colors = [PlayerColor.RED, PlayerColor.YELLOW ] 

    const joinGame = (name: string) => send({type: 'join', name: name, playerId: name})
    const chooseColor = (color: PlayerColor) => send({type: 'chooseColor', color, playerId: color==PlayerColor.YELLOW ?'John':'Marc'})
    const startGame = () => send({type: 'start'})

    const canStart = can({type: 'start'})

    return <div>
        <NameSelector onSelect={joinGame} />
        <ColorSelector onSelect={chooseColor} players={context.players} colors={colors}/>
        <p>
            <button disabled={!canStart} className="button" onClick={prevent(startGame)}>Démarrer</button>
        </p>
    </div>
}