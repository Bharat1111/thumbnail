import { createContext } from "react"
import { YoutubeVideoBlob } from "../components/videoSelectionList"
import { TestBlob } from "../utils/mongo"

type ThumnailSelectionContext = {
    tests: TestBlob[],
    setTests: (tests: TestBlob[]) => void,
    channelId: string,
    setChannelId: (channelId: string) => void,
}

const UserTestsContext = createContext<ThumnailSelectionContext>({
    tests: [],
    setTests: () => { },
    channelId: "",
    setChannelId: () => { },
})

export default UserTestsContext