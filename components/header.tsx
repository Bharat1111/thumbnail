import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <header className="bg-gray-800 text-white">
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <div
          className={`flex flex-row nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          
          {!session && (
            <>
              <div className="flex flex-row justify-start gap-1 w-1/2">
                <span className={styles.notSignedInText}>
                  You are not signed in
                </span>
              </div>
              <div className="flex flex-row justify-end">
                <a
                  href={`/api/auth/signin`}
                  className={styles.buttonPrimary}
                  onClick={(e) => {
                    e.preventDefault()
                    signIn("google")
                  }}
                >
                  Sign in
                </a>
              </div>
            </>
          )}
          {session?.user && (
            <>
              <div className="flex flex-row justify-start gap-1 w-1/2">
                {session.user.image && (
                  <span
                    style={{
                      backgroundImage: `url('${session.user.image}')`,
                    }}
                    className={styles.avatar}
                  />
                )}

                <span className="text-white">
                  <small>Signed in as</small>
                  <br />
                  <strong>{session.user.email || session.user.name}</strong>
                </span>
              </div>
              <div className="flex flex-row justify-end gap-4 w-1/2">
                <a href={"/myTests"} className={styles.buttonPrimary}>
                  My Tests
                </a>

                <a href={`/`} className={styles.buttonPrimary}>
                  New Test
                </a>

                <a
                  href={`/api/auth/signout`}
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  Sign out
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
