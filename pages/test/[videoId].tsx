import axios from "axios"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import Layout from "../../components/layout"
import TestStats from "../../components/TestStats"
import AnalyticsUploader from "../../components/AnalyticsUploader"

const testPage = () => {
  const router = useRouter()
  const { videoId } = router.query
  
  return (
    <Layout>
      {videoId && <AnalyticsUploader videoId={videoId as string} />}
      {videoId && <TestStats videoId={videoId as string} />}
    </Layout>
  )
}

export default testPage
