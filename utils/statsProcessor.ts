import { TestBlob } from "./mongo"
type ThumbnailStatsSummary = {
  avgStats: Record<string, any>
  statsBlobs: Record<string, any>
}

export const processStats = async (
  test: TestBlob,
  stats: Record<string, Record<string, any>>
) => {
  const { startDate, testLength } = test
  const currentDate = new Date()
  const startDateTime = new Date(startDate)
  const daysBetween = Math.round(
    Math.abs(currentDate.getTime() - startDateTime.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  // loop over each day since startDate and attribute stats
  // output: thumbnailStats[i] = {avgStats, TestBlob}
  const thumbnailStats: ThumbnailStatsSummary[] = []
  for (let i = 0; i < daysBetween; i++) {
    const date = new Date(startDateTime.getTime() + i * 24 * 60 * 60 * 1000)
    const dateString = date.toISOString().split("T")[0]
    const dayStats = stats[dateString]
    if (!dayStats) continue
    // which thumbnail had this day
    const thumbnailIndex = i % test.thumbnails.length
    if (!thumbnailStats[thumbnailIndex])
      thumbnailStats[thumbnailIndex] = { avgStats: {}, statsBlobs: {} }
    thumbnailStats[thumbnailIndex].statsBlobs[dateString] = dayStats
  }

  // average stats for each thumbnail
  for (let i = 0; i < thumbnailStats.length; i++) {
    const thumbnailStatsSummary = thumbnailStats[i]
    const statBlobs = thumbnailStatsSummary.statsBlobs
    const avgStats: Record<string, any> = {}
    for (const statName in statBlobs[Object.keys(statBlobs)[0]]) {
      let total: number = 0
      for (const date in statBlobs) {
        total += statBlobs[date][statName]
      }
      avgStats[statName] = total / Object.keys(statBlobs).length
    }
    thumbnailStatsSummary.avgStats = avgStats
  }
  //   console.log(thumbnailStats)
  return thumbnailStats
}
