import { MongoClient } from "mongodb"

const uri = `mongodb+srv://user:user@cluster0.jux58.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri)

export type TestBlob = {
  thumbnails: string[]
  currentThumbnail: number
  videoId: string
  channelId: string
  startDate: string // MM-DD-YY
  testLength: number //days
  accessToken: string
  refreshToken: string
}

export const storeSingleDataInMongo = async (blobToStore: any, collectionName: string) => {
  async function run() {
    try {
      await client.connect()
      const database = client.db("allTests")
      const allTests = database.collection(collectionName)
      await allTests.insertOne(blobToStore)
      console.log("Data stored")
    } finally {
      await client.close()
    }
  }
  return run().catch(console.dir)
}

export const getAllVideoIds = async () => {
  async function run() {
    try {
      await client.connect()
      const database = client.db("allTests")
      const allTests = database.collection("allTests")
      const allFoundTests = await allTests.find().toArray()
      const videoIds = allFoundTests.map((test) => test.videoId)

      console.log("Data retrieved")
      return videoIds
    } finally {
      await client.close()
    }
  }
  return run().catch(console.dir)
}

export const getAllTestsForChannel = async (channelId: string) => {
  async function run() {
    try {
      await client.connect()
      const database = client.db("allTests")
      const allTests = database.collection("allTests")
      const allFoundTests = await allTests.find({ channelId }).toArray()
      // const videoIds = allFoundTests.map(test => test.videoId)

      console.log("Data retrieved for channel " + channelId)
      return allFoundTests
    } finally {
      await client.close()
    }
  }
  return run().catch(console.dir)
}

export const updateSingleDataInMongo = async (blobToStore: any) => {
  async function run() {
    try {
      await client.connect()
      const database = client.db("allTests")
      const allTests = database.collection("allTests")
      const query = { videoId: blobToStore?.videoId }
      const update = { $set: blobToStore }
      const options = { upsert: true }
      await allTests.updateOne(query, update, options)
      console.log("Data updated")
    } finally {
      await client.close()
    }
  }
  return run().catch(console.dir)
}

export const getSingleDataFromMongo = async (videoId: string) => {
  async function run() {
    try {
      await client.connect()
      const database = client.db("allTests")
      const allTests = database.collection("allTests")
      const query = { videoId }
      const result = await allTests.findOne(query)
      console.log("Data retrieved", result)
      return result
    } finally {
      await client.close()
    }
  }
  return run().catch(console.dir)
}
