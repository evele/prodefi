import { createFileRoute, useSearch } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export const Route = createFileRoute('/predictions')({
  component: PredictionsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    carton: search.carton as string | undefined,
  }),
})

function PredictionsPage() {
  const { carton } = useSearch({ from: '/predictions' })
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Make Predictions
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Predict game results and tournament winners to earn points
        </p>
        {carton && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                #{carton}
              </div>
              <span className="text-sm font-medium text-blue-800">
                Selected Carton #{carton}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Game Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚽ Game Predictions
            </CardTitle>
            <CardDescription>
              Predict the scores for 4 key tournament games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Game 1 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Game 1: Team A vs Team B</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team A Score</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="text-2xl">-</div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team B Score</label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>

              {/* Game 2 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Game 2: Team C vs Team D</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team C Score</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="text-2xl">-</div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team D Score</label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>

              {/* Más juegos... */}
              <Button className="w-full" disabled>
                Submit Game Predictions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Winner Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Winner Predictions
            </CardTitle>
            <CardDescription>
              Predict the top 4 teams in the tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">1st Place</label>
                <Input placeholder="Select team..." />
              </div>
              <div>
                <label className="text-sm font-medium">2nd Place</label>
                <Input placeholder="Select team..." />
              </div>
              <div>
                <label className="text-sm font-medium">3rd Place</label>
                <Input placeholder="Select team..." />
              </div>
              <div>
                <label className="text-sm font-medium">4th Place</label>
                <Input placeholder="Select team..." />
              </div>
              
              <Button className="w-full" disabled>
                Submit Winner Predictions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Predictions */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Current Predictions</CardTitle>
            <CardDescription>
              View and track your submitted predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No predictions submitted yet. Buy a prediction card to get started!
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}