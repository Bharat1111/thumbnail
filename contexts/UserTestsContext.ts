import { createContext } from "react"
import { TestBlob } from "../utils/mongo"

type ThumnailSelectionContext = {
    tests: TestBlob[],
    setTests: (tests: TestBlob[]) => void,
    channelId: string,
    setChannelId: (channelId: string) => void,
    thumbnailStats: any,
    setThumbnailStats: (thumbnailStats: any) => void,
}

const UserTestsContext = createContext<ThumnailSelectionContext>({
    tests: [],
    setTests: () => { },
    channelId: "",
    setChannelId: () => { },
    thumbnailStats: [],
    setThumbnailStats: () => { },
})

export default UserTestsContext