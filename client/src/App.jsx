import React from 'react'
import CardSearch from './components/CardSearch'

function App() {
  return (
    <div className="flex justify-center bg-gray-300 min-h-screem">
      <div className="w-4/5 p-6 m-6 rounded-lg bg-white">
        <h1 className="text-4xl">MtG Card Search</h1>
        <CardSearch />
      </div>
    </div>
  )
}

export default App
