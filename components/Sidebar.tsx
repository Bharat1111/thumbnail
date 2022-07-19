import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useContext } from "react"
import UserTestsContext from "../contexts/UserTestsContext"
import styles from "./header.module.css"
import MyTests from "./MyTests"

const Sidebar = () => {
  const navigations = [
    { name: "Dashboard", href: "#", count: 1, current: true },
    { name: "Projex", href: "#", count: 4, current: false },
    { name: "Calender", href: "#", count: 4, current: false },
    { name: "Docs", href: "#", count: 12, current: false },
    { name: "Reports", href: "#", count: 4, current: false },
  ]
  const { data: session, status } = useSession()
  const { tests } = useContext(UserTestsContext)
  // console.log(tests)

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <div className="w-[15%] flex flex-col border-r min-h-0 border-gray-500 bg-gray-800">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="w-auto h-8 rounded-lg"
            src="https://vercel.com/api/www/avatar/?u=bharat1111&s=64"
            alt="sidebar"
          />
          <span className="ml-2 italic font-bold text-white text-2xl">
            Thumbnail
          </span>
        </div>
        <nav
          className="mt-5 flex-1 px-2 bg-gray-800 space-y-1"
          aria-label="Sidebar"
        >
          {session && (
            <>
              <Link href="/">
                <a>
                  <h1 className="p-1 text-white bg-green-600 cursor-pointer rounded-md text-center text-xl hover:bg-gray-700 hover:text-gray-400 mb-5 font-semibold">
                    Start new test
                  </h1>
                </a>
              </Link>
              <h1 className="text-white text-center font-semibold text-xl">
                Current Tests
              </h1>
              <MyTests tests={tests} />{" "}
            </>
          )}
        </nav>
      </div>

      <div className="flex-shrink-0 flex p-4 hover:bg-gray-600">
        <Link
          className="flex-shrink-0 w-full group block"
          href={session ? `/api/auth/signout` : `/api/auth/signin`}
        >
          <a>
            <div className="flex items-center">
              <div>
                {session?.user?.image && (
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={session.user.image}
                    alt="avatar"
                  />
                )}
              </div>

              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
                <p
                  className="text-xs font-medium text-gray-300 group-hover:text-gray-200"
                  onClick={
                    session?.user
                      ? (e) => {
                          e.preventDefault()
                          signOut()
                        }
                      : (e) => {
                          e.preventDefault()
                          signIn("google")
                        }
                  }
                >
                  {session?.user ? "Sign Out" : "Sign In"}
                </p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
