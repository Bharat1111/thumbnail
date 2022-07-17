import axios from "axios"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import Layout from "../../components/layout"
import TestStats from "../../components/TestStats"
import UserTestsContext from "../../contexts/UserTestsContext"

const testPage = () => {
  const router = useRouter()
  const { videoId } = router.query
  

  return (
    <Layout>
      {videoId && <TestStats videoId={videoId as string} />}
    </Layout>
  )
}

export default testPage
