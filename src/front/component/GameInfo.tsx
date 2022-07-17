import type { ReactNode } from "react";
import { Player, PlayerColor } from "../../types";
import { discColorClass } from "../../func/color";


type GameInfoProps = {
    color: PlayerColor,
    name: string
}

export function GameInfo({color, name}: GameInfoProps){

    return <div>
        <h2 className="flex" style={{gap: '.5rem'}}>Autour de {name} <div className={discColorClass(color)}/> de jouer </h2>
    </div>
}