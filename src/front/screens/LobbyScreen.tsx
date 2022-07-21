import { ReactNode, useState } from "react";
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
    const [isDisabled, setIsDisabled] = useState(true);
    const [checked, setChecked] = useState(false);
    const dataSubmit = () => {
        return checked ? setIsDisabled(true) : setIsDisabled(false)
    }

    const chooseColor = (color: PlayerColor) => send({type: 'chooseColor', color})
    const startGame = () => send({type: 'start'})
    const copyUrlToClipboard = () => copyUrl()
    const iaDisabled = () => {
        if(context.players.length > 1){
            return true
        }
        return false
    }
    const onCheckBoxClick = () =>{
        setChecked(!checked)
        return dataSubmit()
    }

    const canStart = can({type: 'start'})

    return <div>
        
        <ColorSelector onSelect={chooseColor} players={context.players} colors={colors}/>
        <p  style={{gap: '.7rem'}}>
            <button className="button" onClick={prevent(copyUrlToClipboard)}>Copier l'url</button>
            <div>
                <input disabled={iaDisabled()} type="checkbox" id="isIa" name="isIa" onClick={onCheckBoxClick}></input>
                <label htmlFor="isIa">Jouer avec une IA ?</label>

                <div>
                    <label htmlFor="iaLevel">Difficulté : </label>
                    <input disabled={isDisabled} type="number" id="iaLevel" name="iaLevel" min="1" max="10"></input>
                </div>
            </div>
            <button disabled={isDisabled && !canStart}  className="button" onClick={prevent(startGame)}>Démarrer</button>
        </p>
    </div>
}
