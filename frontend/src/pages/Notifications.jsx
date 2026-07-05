import React from 'react'
import { motion } from 'framer-motion'
import { FaBellSlash } from 'react-icons/fa'

const Notifications = () => {
  return (
    <div className="w-full min-h-screen  p-4 py-12">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        {/* THEME CHANGE: Gradient text for the header */}
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Notifications
        </h2>

        <div className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-purple-200/50 ring-1 ring-purple-200 space-y-6">
          {/* THEME CHANGE: Themed file upload area */}
          <div className="flex flex-col flex-grow items-center justify-center text-center text-slate-500 p-8">
            <FaBellSlash size={80} className="mb-6 text-purple-300" />
            <h3 className="text-2xl font-bold text-slate-800">No Notifications Yet</h3>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Notifications