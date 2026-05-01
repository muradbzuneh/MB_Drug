"use client"
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
const Logout = () => {
  return (
       <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-50 h-10 bg-gray-300
              items-center gap-3 rounded-3xl px-3 py-2 text-lg text-emerald-300
             transition hover:bg-slate-800/50 hover:text-white"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
              <span>Logout</span>
            </button> 
  )
}

export default Logout