import { useEffect, useState } from "react"
import UserTestsContext from "../contexts/UserTestsContext"
import axios from "axios"

import Header from "./header"
import Sidebar from "./Sidebar"
import { useSession } from "next-auth/react"
import { TestBlob } from "../utils/mongo"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { data: session, status } = useSession()
  const [tests, setTests] = useState<TestBlob[]>([])

  useEffect(() => {
    if (!session) return

    const fetchData = async () => {
      console.log("use effect")
      const res = await axios.get("/api/youtube/channelId")
      console.log(res)
      setTests(res.data.tests)
    }
    fetchData()
  }, [])

  return (
    <UserTestsContext.Provider value={{ tests, setTests }}>
      {/* <Header /> */}
      <div className="flex flex-row overflow-x-hidden">
        <Sidebar />
        <main className="w-[85%]">{children}</main>
      </div>
    </UserTestsContext.Provider>
  )
}
