import type { ReactNode } from "react";
import { Player, PlayerColor } from "../../types";
import { discColorClass } from "../../func/color";
import { prevent } from "../../func/dom";


type VictoryProps = {
    color: PlayerColor,
    name: string,
    onRestart?: () => void
}

export function Victory({color, name, onRestart}: VictoryProps){

    return <div className="flex" style={{justifyContent: 'space-between'}}>
        <h2 className="flex" style={{gap: '.5rem'}}>Bravo, {name} <div className={discColorClass(color)}/> a gagné !! </h2>
        <button className="button" onClick={prevent(onRestart)}>Rejouer</button>
    </div>
}