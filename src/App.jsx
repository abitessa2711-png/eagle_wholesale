import React, { useState, useEffect, useCallback } from 'react'
import Login          from './components/Login'
import Signup         from './components/Signup'
import Sidebar        from './components/Sidebar'
import Header         from './components/Header'
import AddStock       from './components/AddStock'
import SellDashboard  from './components/SellDashboard'
import Dashboard      from './components/Dashboard'
import SoldItems      from './components/SoldItems'
import StockDashboard from './components/StockDashboard'
import OldBuyback     from './components/OldBuyback'
import ServiceLog     from './components/ServiceLog'
import { fetchSupabaseData, insertSupabaseRecord, updateSupabaseRecord, deleteSupabaseRecord } from './supabaseClient'

export default function App() {
  // ── Auth (Always require Login when opening the website) ───────────────────
  const [user, setUser]                 = useState(null)
  const [showSignup, setShowSignup]     = useState(false)
  const [activeTab, setActiveTab]       = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ── Data Stores ────────────────────────────────────────────────────────────
  const [products, setProducts]   = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_wholesale_production_v2_products')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [soldItems, setSoldItems] = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_wholesale_production_v2_sales')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [buybacks, setBuybacks]   = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_wholesale_production_v2_buybacks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [serviceEntries, setServiceEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_wholesale_production_v2_services')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ── 100% Real-Time Cloud Synchronization (Phone & Laptop Multi-Device Sync) ──
  const syncFromCloud = useCallback(async () => {
    try {
      const [dbProducts, dbSales, dbBuybacks, dbServices] = await Promise.all([
        fetchSupabaseData('products'),
        fetchSupabaseData('sales'),
        fetchSupabaseData('buybacks'),
        fetchSupabaseData('services')
      ])

      if (Array.isArray(dbProducts)) {
        setProducts(dbProducts)
        localStorage.setItem('eagle_wholesale_production_v2_products', JSON.stringify(dbProducts))
      }
      if (Array.isArray(dbSales)) {
        setSoldItems(dbSales)
        localStorage.setItem('eagle_wholesale_production_v2_sales', JSON.stringify(dbSales))
      }
      if (Array.isArray(dbBuybacks)) {
        setBuybacks(dbBuybacks)
        localStorage.setItem('eagle_wholesale_production_v2_buybacks', JSON.stringify(dbBuybacks))
      }
      if (Array.isArray(dbServices)) {
        setServiceEntries(dbServices)
        localStorage.setItem('eagle_wholesale_production_v2_services', JSON.stringify(dbServices))
      }
    } catch (err) {
      console.warn('Realtime sync exception:', err)
    }
  }, [])

  useEffect(() => {
    // Initial fetch on mount
    syncFromCloud()

    // Real-time synchronization every 1.5 seconds across all open devices
    const interval = setInterval(syncFromCloud, 1500)

    // Immediate sync on window focus and visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromCloud()
      }
    }

    window.addEventListener('focus', syncFromCloud)
    window.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', syncFromCloud)
      window.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [syncFromCloud])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  // ── Stock Add ─────────────────────────────────────────────────────────────
  const addProduct = async (newProduct) => {
    const totalWeight = parseFloat(newProduct.weight || 0)
    const qty = parseInt(newProduct.quantity || 1)

    const newEntry = {
      id: String(Date.now()),
      category: newProduct.category,
      subcategory: newProduct.subcategory || '',
      variant: newProduct.variant,
      detail: newProduct.detail || '',
      weight: totalWeight,
      quantity: qty,
      createdAt: newProduct.customDate || new Date().toISOString()
    }

    const updated = [newEntry, ...products]
    setProducts(updated)
    localStorage.setItem('eagle_wholesale_production_v2_products', JSON.stringify(updated))
    await insertSupabaseRecord('products', newEntry)
  }

  const deleteProduct = async (id) => {
    const updated = products.filter(p => String(p.id) !== String(id))
    setProducts(updated)
    localStorage.setItem('eagle_wholesale_production_v2_products', JSON.stringify(updated))
    await deleteSupabaseRecord('products', id)
  }

  // ── Buyback Add / Delete ───────────────────────────────────────────────────
  const addBuyback = async (buybackData) => {
    const newBuyback = {
      id: String(Date.now()),
      date: buybackData.date,
      itemName: buybackData.itemName,
      weight: parseFloat(buybackData.weight || 0),
      amount: parseFloat(buybackData.amount || 0),
      detail: (buybackData.customerName ? `${buybackData.customerName} ` : '') + (buybackData.mobile ? `(${buybackData.mobile}) ` : '') + (buybackData.detail || '')
    }
    const updated = [newBuyback, ...buybacks]
    setBuybacks(updated)
    localStorage.setItem('eagle_wholesale_production_v2_buybacks', JSON.stringify(updated))
    await insertSupabaseRecord('buybacks', newBuyback)
  }

  const deleteBuyback = async (id) => {
    const updated = buybacks.filter(b => String(b.id) !== String(id))
    setBuybacks(updated)
    localStorage.setItem('eagle_wholesale_production_v2_buybacks', JSON.stringify(updated))
    await deleteSupabaseRecord('buybacks', id)
  }

  // ── Service Add / Delete ───────────────────────────────────────────────────
  const addService = async (serviceData) => {
    const newEntry = {
      id: String(Date.now()),
      date: serviceData.date,
      itemName: serviceData.itemName,
      serviceType: serviceData.serviceType,
      weight: parseFloat(serviceData.weight || 0),
      amount: parseFloat(serviceData.amount || 0),
      notes: (serviceData.customerName ? `வாடிக்கையாளர்: ${serviceData.customerName} ` : '') + (serviceData.mobile ? `(${serviceData.mobile}) ` : '') + (serviceData.notes || ''),
      status: serviceData.status || 'Completed'
    }
    const updated = [newEntry, ...serviceEntries]
    setServiceEntries(updated)
    localStorage.setItem('eagle_wholesale_production_v2_services', JSON.stringify(updated))
    await insertSupabaseRecord('services', newEntry)
  }

  const deleteService = async (id) => {
    const updated = serviceEntries.filter(s => String(s.id) !== String(id))
    setServiceEntries(updated)
    localStorage.setItem('eagle_wholesale_production_v2_services', JSON.stringify(updated))
    await deleteSupabaseRecord('services', id)
  }

  // ── Sale Delete ────────────────────────────────────────────────────────────
  const deleteSale = async (id) => {
    const updated = soldItems.filter(s => String(s.id) !== String(id))
    setSoldItems(updated)
    localStorage.setItem('eagle_wholesale_production_v2_sales', JSON.stringify(updated))
    await deleteSupabaseRecord('sales', id)
  }

  // ── Sale Processing ────────────────────────────────────────────────────────
  const processSale = async (customerName, mobile, cartItems, goldRate = '', silverRate = '', oldSilverAmount = '', oldSilverWeight = '', oldGoldAmount = '', oldGoldWeight = '') => {
    const billNo = String(Math.floor(100 + Math.random() * 900))
    const billId = `ESW-${billNo}`
    const date = new Date().toISOString()

    const updatedProducts = [...products]
    const newSales = []

    for (const item of cartItems) {
      const pIdx = updatedProducts.findIndex(p => String(p.id) === String(item.productId))
      if (pIdx !== -1) {
        const prod = updatedProducts[pIdx]
        const soldQty = item.quantity
        const soldWeight = item.totalWeight || 0
        
        const currentTotalWeight = prod.weight || 0
        const newTotalWeight = Math.max(0, currentTotalWeight - soldWeight)
        
        // For Kodi (கொடி): 1 Piece roll stays 1 Piece as long as weight > 0 (e.g. 500g -> sold 300g -> 200g left = 1 pc). Only becomes 0 when total weight is 0!
        let newQty
        if (prod.category === 'கொடி') {
          newQty = newTotalWeight > 0.001 ? 1 : 0
        } else {
          newQty = Math.max(0, prod.quantity - soldQty)
        }
        
        updatedProducts[pIdx] = {
          ...prod,
          quantity: newQty,
          weight: newTotalWeight
        }

        // Update in Supabase
        await updateSupabaseRecord('products', prod.id, { quantity: newQty, weight: newTotalWeight })
      }

      const saleRecord = {
        id: String(Date.now() + Math.random()),
        billNo,
        billId,
        customerName: customerName || 'மாரி',
        mobile: mobile || '',
        category: item.category,
        subcategory: item.subcategory || '',
        variant: item.variant,
        weight: item.totalWeight,
        quantity: item.quantity,
        totalAmount: item.totalAmount,
        discountAmount: item.discountAmount || 0,
        total: item.total,
        date
      }

      newSales.push(saleRecord)
      await insertSupabaseRecord('sales', saleRecord)
    }

    setProducts(updatedProducts)
    localStorage.setItem('eagle_wholesale_production_v2_products', JSON.stringify(updatedProducts))
    
    const updatedSales = [...newSales, ...soldItems]
    setSoldItems(updatedSales)
    localStorage.setItem('eagle_wholesale_production_v2_sales', JSON.stringify(updatedSales))

    return {
      billNo,
      billId,
      customerName: customerName || 'மாரி',
      mobile: mobile || '',
      items: cartItems,
      date,
      goldRate,
      silverRate,
      oldSilverAmount,
      oldSilverWeight,
      oldGoldAmount,
      oldGoldWeight
    }
  }

  // ── Auth gates ─────────────────────────────────────────────────────────────
  if (!user) {
    if (showSignup) return <Signup onBack={() => setShowSignup(false)} onSignupSuccess={() => setShowSignup(false)} />
    return <Login onLogin={handleLogin} onShowSignup={() => setShowSignup(true)} />
  }

  // ── Pages ──────────────────────────────────────────────────────────────────
  const pages = {
    dashboard:   <Dashboard      products={products}   sales={soldItems}  setActiveTab={setActiveTab} />,
    stock:       <StockDashboard products={products}   onDelete={deleteProduct} role={user?.role} />,
    add:         <AddStock       onAddProduct={addProduct} />,
    sell:        <SellDashboard  products={products}   processSale={processSale} />,
    sold:        <SoldItems      soldItems={soldItems} onDeleteSale={deleteSale} />,
    old_buyback: <OldBuyback     buybacks={buybacks}   onAddBuyback={addBuyback} onDeleteBuyback={deleteBuyback} />,
    reports:     <ServiceLog     serviceEntries={serviceEntries} onAddService={addService} onDeleteService={deleteService} />
  }

  const currentPage = pages[activeTab] || pages.dashboard

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={user?.role || 'admin'}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="app-content">
        <Header
          username={user?.name || 'Admin'}
          onLogout={handleLogout}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="container animate-fade-in">
          {currentPage}
        </main>
      </div>
    </div>
  )
}
