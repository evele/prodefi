
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { Team } from "../lib/types"


export function TeamWinnerSelector(
    {label, teams, selectedTeams, currentPosition, isExpired, onChange}: 
    {label: string, teams: Team[], selectedTeams: [number, number, number, number], currentPosition: 1|2|3|4, isExpired: boolean, onChange: (teamId: number) => void}) {

    const availableTeams = teams.filter(team => !selectedTeams.includes(team.id) || team.id === selectedTeams[currentPosition-1])
    
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <Select disabled={isExpired} onValueChange={(value) => onChange(Number(value))} >
                <SelectTrigger>
                <SelectValue placeholder="Select team..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Select team...</SelectItem>
                {availableTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>)
}