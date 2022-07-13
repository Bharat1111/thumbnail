import { AMQPClient } from "@cloudamqp/amqp-client"

const amqp = new AMQPClient(process.env.AMQP_URL as string)
let conn: any, ch: any, q: any

export async function sendBlobToQueue(blob: string | Uint8Array | ArrayBuffer) {
  try {
    if (!conn) {
      const connResponse = await setupConnection()
      conn = connResponse.conn
      ch = connResponse.ch
      q = connResponse.q
    }
    // const consumer = await q.subscribe({noAck: true}, async (msg) => {
    //   console.log(msg.bodyToString())
    //   await consumer.cancel()
    // })
    await q.publish(blob, { deliveryMode: 2 })
    // await consumer.wait() // will block until consumer is canceled or throw an error if server closed channel/connection
    // await conn.close()
  } catch (e: any) {
    console.error("ERROR", e)
    e.connection.close()
    setTimeout(sendBlobToQueue, 1000) // will try to reconnect in 1s
  }
}

const setupConnection = async () => {
  const conn = await amqp.connect()
  const ch = await conn.channel()
  const q = await ch.queue('thumbnail')
  return { conn, ch, q }
}

const closeConnection = async () => {
  if (conn) {
    await conn.close()
    conn = undefined
    ch = undefined
    q = undefined
  }
}
