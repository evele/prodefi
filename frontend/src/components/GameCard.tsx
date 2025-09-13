import { Input } from './ui/input'
import type { Game } from "../lib/types"
import { teamsById } from "../lib/teams"

export function GameCard(
    {game, isUsed, isExpired, onScoreChange}: 
    {game: Game, isUsed:boolean, isExpired: boolean, onScoreChange: (gameId: number, team: 0 | 1, score: number) => void}) {
    return (
        <div>
            <h4 className="font-semibold mb-3">Game {game.id}</h4>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="text-sm text-gray-600">{teamsById[game.team1]}</label>
                    <Input type="number" placeholder="0" min="0" max="255" disabled={isExpired || isUsed} value={game.result[0]} onChange={(e) => onScoreChange(game.id, 0, Number(e.target.value))}/>
                </div>
                <div className="text-2xl">-</div>
                <div className="flex-1">
                    <label className="text-sm text-gray-600">{teamsById[game.team2]}</label>
                    <Input type="number" placeholder="0" min="0" max="255" disabled={isExpired || isUsed} value={game.result[1]} onChange={(e) => onScoreChange(game.id, 1, Number(e.target.value))}/>
                </div>
            </div>
        </div>
    )
}