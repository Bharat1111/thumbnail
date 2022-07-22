import { useEffect, useState } from "react"
import UserTestsContext from "../contexts/UserTestsContext"
import axios from "axios"

// import Header from "./header"
import Sidebar from "./Sidebar"
import { useSession } from "next-auth/react"
import { TestBlob } from "../utils/mongo"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { data: session, status } = useSession()
  const [tests, setTests] = useState<TestBlob[]>([])
  const [channelId, setChannelId] = useState<string>("")
  const [thumbnailStats, setThumbnailStats] = useState()

  useEffect(() => {
    // if (!session) return

    // const fetchData = async () => {
    // console.log("use effect")
    axios
      .get("/api/youtube/channelId")
      .then((res) => {
        setChannelId(res.data.channelId)
        return axios.get(`/api/tests/allTests?channelId=${res.data.channelId}`)
      })
      .then((res) => setTests(res.data.tests))
    // }
    // fetchData()
  }, [])

  return (
    <UserTestsContext.Provider
      value={{ tests, setTests, channelId, setChannelId, thumbnailStats, setThumbnailStats }}
    >
      {/* <Header /> */}
      <div className="flex flex-row overflow-x-hidden min-h-screen">
        <Sidebar />
        <main className="w-[90%] bg-gray-800">{children}</main>
      </div>
    </UserTestsContext.Provider>
  )
}
