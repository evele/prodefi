'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              ProDefi ⚽
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Decentralized Football Predictions
            </p>
          </div>
          <ConnectButton />
        </header>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Buy Carton Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎫 Buy Prediction Card
              </CardTitle>
              <CardDescription>
                Purchase an NFT prediction card to participate in the tournament
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-green-600">
                  0.1 ETH
                </div>
                <Button className="w-full" disabled>
                  Connect Wallet to Buy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Make Predictions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔮 Make Predictions
              </CardTitle>
              <CardDescription>
                Predict game results and tournament winners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  • 4 Game Predictions
                  • Top 4 Teams Prediction
                  • Earn points for accuracy
                </div>
                <Button className="w-full" variant="outline" disabled>
                  No Cards Owned
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prize Pool Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Prize Pool
              </CardTitle>
              <CardDescription>
                Current tournament prize distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>1st Place (50%)</span>
                  <span className="font-bold">-- ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>2nd Place (30%)</span>
                  <span className="font-bold">-- ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>3rd Place (15%)</span>
                  <span className="font-bold">-- ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>4th Place (5%)</span>
                  <span className="font-bold">-- ETH</span>
                </div>
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Pool</span>
                    <span>0.0 ETH</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-mono">Anvil (localhost:8545)</span>
                </div>
                <div className="flex justify-between">
                  <span>Contracts:</span>
                  <span className="text-yellow-600">Not Deployed</span>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  ⚠️ Make sure to run `anvil` and deploy contracts first
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
