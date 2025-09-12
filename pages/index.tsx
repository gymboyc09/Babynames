import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Baby Names App
        </h1>
        
        {session ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Welcome, {session.user?.name}!
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Email: {session.user?.email}
            </p>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Sign in to access your baby names
            </p>
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
