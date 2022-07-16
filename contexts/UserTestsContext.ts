import { createContext } from "react"
import { YoutubeVideoBlob } from "../components/videoSelectionList"
import { TestBlob } from "../utils/mongo"

type ThumnailSelectionContext = {
    tests: TestBlob[],
    setTests: (tests: TestBlob[]) => void,
}

const UserTestsContext = createContext<ThumnailSelectionContext>({
    tests: [],
    setTests: () => { },
})

export default UserTestsContext