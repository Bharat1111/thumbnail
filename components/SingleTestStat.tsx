import React from "react"

const rankClass = ["", "text-green-500", "text-yellow-500", "text-red-500"]
const stats = [
  {
    id: 1,
    name: "Click-Through Rate",
    internalName: "Impressions click-through rate (%)",
    chaser: "%",
  },
  { id: 2, name: "Views", internalName: "Views" },
  { id: 3, name: "Average Watch Time", internalName: "Watch time (hours)" },
  {
    id: 4,
    name: "Average View Duration",
    internalName: "Average view duration",
  },
]
// Impressions click-through rate (%): 0, Views: 3, Watch time (hours): 0.0617, Average view duration

type AnalyticsStatsBlob = {
  avgStats: Record<string, any>
  statsBlobs: Record<string, any>
}

const SingleTestStat = ({
  thumbnailStats,
}: {
  thumbnailStats: AnalyticsStatsBlob
}) => {
  // console.log(thumbnailStats.avgStats)
  return (
    <>
      {thumbnailStats && (
        <div className="flex flex-row gap-5">
          {/* <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.id}
                className="relative bg-gray-500 pt-3 shadow rounded-lg overflow-hidden"
              >
                <p className="ml-6 text-sm font-medium text-white truncate">
                  {item.name}
                </p>
                <dd className="ml-8 pb-3 flex items-baseline sm:pb-4">
                  <p className="text-2xl font-semibold text-gray-200">
                    {thumbnailStats.avgStats[item.internalName]}
                  </p> */}
          {/* <p>something</p> */}
          {/* </dd>
              </div>
            ))}
          </dl> */}
          {stats.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-center bg-gray-600 rounded-md w-[175px]"
            >
              <div className="text-center m-2">
                <div className="text-sm font-bold mb-2 text-white">
                  {item.name}
                </div>
                <p className="text-2xl text-gray-200">
                  {thumbnailStats.avgStats[item.internalName]} {item.chaser}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default SingleTestStat
