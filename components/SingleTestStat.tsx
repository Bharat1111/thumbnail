import React from "react"

const rankClass = [
    '',
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
]

const SingleTestStat = ({ key, name, stat, rank }: { key: string; name: string; stat: number; rank: number }) => {
  return (
    <div key={key} className="text-white bg-gray-600 rounded-xl p-4 w-48">
        <h1 className={"font-bold " + rankClass[rank]}>{name}</h1>
        <h2>Rank #{rank}</h2>
        <h3>Total: {stat}</h3>
    </div>
  )
}

export default SingleTestStat
