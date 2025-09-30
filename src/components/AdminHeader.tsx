import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-red-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="Baby Names Admin"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Site</span>
            </a>
            
            {session && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {session.user?.name} (Admin)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Sign Out
+                </Button>
+              </div>
+            )}
+          </div>
+        </div>
+      </div>
+    </header>
+  )
+}
