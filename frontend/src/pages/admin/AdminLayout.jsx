import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../../context/AuthContext'
import '../../admin.css'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

function AdminApp() {
  const { isLoggedIn } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [cats, setCats] = useState([])
  const [activeCat, setActiveCat] = useState(null)
  const [sharedData, setSharedData] = useState({ ordersCount: 0, inquiriesCount: 0, adminName: 'Admin' })

  if (!isLoggedIn) return <AdminLogin />

  return (
    <div className="admin-app">
      <AdminSidebar
        page={page}
        setPage={setPage}
        ordersCount={sharedData.ordersCount}
        inquiriesCount={sharedData.inquiriesCount}
        adminName={sharedData.adminName}
        cats={cats}
        activeCat={activeCat}
        setActiveCat={setActiveCat}
      />
      <div className="main">
        <AdminTopbar
          page={page}
          setPage={setPage}
          inquiriesCount={sharedData.inquiriesCount}
          adminName={sharedData.adminName}
        />
        <div className="content">
          <AdminDashboard
            page={page}
            setPage={setPage}
            onDataLoaded={setSharedData}
            cats={cats}
            setCats={setCats}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
          />
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  )
}
