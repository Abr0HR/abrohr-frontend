import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-indigo-900 mb-2">AbrO HR</h1>
        <p className="text-xl text-indigo-700">Employee Attendance Tracking System</p>
      </header>
      
      <main className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Present Today</h3>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Absent Today</h3>
              <p className="text-4xl font-bold text-red-600">0</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Features Coming Soon</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center"><span className="text-indigo-600 mr-3">✓</span> Attendance Management</li>
            <li className="flex items-center"><span className="text-indigo-600 mr-3">✓</span> Shift Management</li>
            <li className="flex items-center"><span className="text-indigo-600 mr-3">✓</span> Real-time Reports</li>
            <li className="flex items-center"><span className="text-indigo-600 mr-3">✓</span> Employee Profiles</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
