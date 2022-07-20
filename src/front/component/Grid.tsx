import type { CSSProperties, ReactNode } from "react";
import { discColorClass } from "../../func/color";
import { prevent } from "../../func/dom";
import { CellState, GridState, Player, PlayerColor, Position } from "../../types";

type GridProps = {
    grid: GridState,
    color?: PlayerColor,
    onDrop: (x: number) => void,
    winingPositions: Position[],
    canDrop: (x: number) => boolean
}


export function Grid({grid, color, onDrop, winingPositions, canDrop}: GridProps){
    const cols = grid[0].length
    const showColumns = color && onDrop
    const isWining = (x: number, y: number) => !!winingPositions.find(p => p.x == x && p.y == y)
    return  <div className="grid" style={{'--rows': grid.length, '--cols': cols} as CSSProperties}>
        {grid.map((row,y) => row.map((c,x) => <Cell active={isWining(x, y)} x={x} y={y} color={c} key={`${x}-${y}`}/>))}
        {showColumns && <div className="columns">
            {new Array(cols).fill(1).map((_,k) => <Column x={k} onDrop={onDrop} color={color} disabled={!canDrop(k)} key={k}/>)}
        </div>}
    </div>
       
}

type CellProps = {
    x: number, 
    y: number, 
    color: CellState,
    active: boolean
}

function Cell({x, y, color, active}: CellProps){
    return <div 
        className={discColorClass(color) + (active ? ' disc-active' : '')} 
        style={{'--row': y} as CSSProperties}
    />
}

type ColumnProps = {
    x: number,
    color: PlayerColor,
    onDrop: (x: number) => void,
    disabled?: boolean
}

function Column ({color, onDrop, x, disabled}: ColumnProps){
    return <button onClick={prevent(() => onDrop(x))} className="column" disabled={disabled}>
        <div className={discColorClass(color)}></div>
    </button>
}