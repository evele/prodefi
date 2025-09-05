import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  // Mock data para mostrar la estructura
  const leaderboardData = [
    { rank: 1, address: '0x1234...5678', points: 125, prize: '50% (2.5 ETH)' },
    { rank: 2, address: '0x2345...6789', points: 118, prize: '30% (1.5 ETH)' },
    { rank: 3, address: '0x3456...7890', points: 112, prize: '15% (0.75 ETH)' },
    { rank: 4, address: '0x4567...8901', points: 108, prize: '5% (0.25 ETH)' },
    { rank: 5, address: '0x5678...9012', points: 95, prize: '-' },
  ]

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Leaderboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          See how players rank based on their prediction accuracy
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.0 ETH</div>
            <p className="text-xs text-muted-foreground">Total rewards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/4</div>
            <p className="text-xs text-muted-foreground">Tournament progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Buy a card to participate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Leaderboard */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Tournament Rankings
          </CardTitle>
          <CardDescription>
            Rankings based on prediction accuracy and points earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((player) => (
              <div 
                key={player.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  player.rank <= 4 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1 ? 'bg-yellow-500 text-white' :
                    player.rank === 2 ? 'bg-gray-400 text-white' :
                    player.rank === 3 ? 'bg-amber-600 text-white' :
                    player.rank === 4 ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {player.rank}
                  </div>
                  
                  <div>
                    <div className="font-mono text-sm">{player.address}</div>
                    <div className="text-xs text-gray-500">
                      {player.points} points
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {player.prize}
                  </div>
                  {player.rank <= 4 && (
                    <div className="text-xs text-gray-500">
                      Prize eligible
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          <div className="text-center py-8 text-gray-500 border-t mt-8">
            <p>Tournament results will be finalized after all games are completed</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}