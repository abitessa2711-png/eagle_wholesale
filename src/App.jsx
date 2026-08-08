import React, { useState, useEffect } from 'react'
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
import { INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_BUYBACKS, INITIAL_LEDGER } from './data/initialData'
import { supabase, fetchSupabaseData, insertSupabaseRecord } from './supabaseClient'

export default function App() {
  // ── Auth (Requires Login by default) ───────────────────────────────────────
  const [user, setUser]                 = useState(null)
  const [showSignup, setShowSignup]     = useState(false)
  const [activeTab, setActiveTab]       = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ── Standalone State (Browser localStorage + Supabase Sync) ───────────────
  const [products, setProducts]   = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_products_v3')
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
    } catch {
      return INITIAL_PRODUCTS
    }
  })

  const [soldItems, setSoldItems] = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_sales_v3')
      return saved ? JSON.parse(saved) : INITIAL_SALES
    } catch {
      return INITIAL_SALES
    }
  })

  const [buybacks, setBuybacks]   = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_buybacks_v3')
      return saved ? JSON.parse(saved) : INITIAL_BUYBACKS
    } catch {
      return INITIAL_BUYBACKS
    }
  })

  const [serviceEntries, setServiceEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_services_v3')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Initial Supabase Sync on load
  useEffect(() => {
    async function loadSupabaseData() {
      const dbProducts = await fetchSupabaseData('products')
      if (dbProducts && dbProducts.length > 0) setProducts(dbProducts)

      const dbSales = await fetchSupabaseData('sales')
      if (dbSales && dbSales.length > 0) setSoldItems(dbSales)

      const dbBuybacks = await fetchSupabaseData('buybacks')
      if (dbBuybacks && dbBuybacks.length > 0) setBuybacks(dbBuybacks)

      const dbServices = await fetchSupabaseData('services')
      if (dbServices && dbServices.length > 0) setServiceEntries(dbServices)
    }
    loadSupabaseData()
  }, [])

  // Save changes locally
  useEffect(() => {
    localStorage.setItem('eagle_products_v3', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('eagle_sales_v3', JSON.stringify(soldItems))
  }, [soldItems])

  useEffect(() => {
    localStorage.setItem('eagle_buybacks_v3', JSON.stringify(buybacks))
  }, [buybacks])

  useEffect(() => {
    localStorage.setItem('eagle_services_v3', JSON.stringify(serviceEntries))
  }, [serviceEntries])

  const handleLogout = () => {
    setUser(null)
  }

  // ── Stock Add ─────────────────────────────────────────────────────────────
  const addProduct = async (newProduct) => {
    const unitWeight = parseFloat(newProduct.weight || 0)
    const qty = parseInt(newProduct.quantity || 1)

    const newEntry = {
      id: String(Date.now()),
      category: newProduct.category,
      subcategory: newProduct.subcategory || '',
      variant: newProduct.variant,
      detail: newProduct.detail || '',
      weight: unitWeight,
      quantity: qty,
      createdAt: newProduct.customDate || new Date().toISOString()
    }

    setProducts(prev => [newEntry, ...prev])
    await insertSupabaseRecord('products', newEntry)
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => String(p.id) !== String(id)))
  }

  // ── Buyback Add / Delete ───────────────────────────────────────────────────
  const addBuyback = async (buybackData) => {
    const newBuyback = {
      id: String(Date.now()),
      date: buybackData.date,
      itemName: buybackData.itemName,
      weight: parseFloat(buybackData.weight || 0),
      amount: parseFloat(buybackData.amount || 0),
      detail: buybackData.detail || ''
    }
    setBuybacks(prev => [newBuyback, ...prev])
    await insertSupabaseRecord('buybacks', newBuyback)
  }

  const deleteBuyback = (id) => {
    setBuybacks(prev => prev.filter(b => String(b.id) !== String(id)))
  }

  // ── Service Add / Delete ───────────────────────────────────────────────────
  const addService = async (serviceData) => {
    const newEntry = {
      id: String(Date.now()),
      ...serviceData
    }
    setServiceEntries(prev => [newEntry, ...prev])
    await insertSupabaseRecord('services', newEntry)
  }

  const deleteService = (id) => {
    setServiceEntries(prev => prev.filter(s => String(s.id) !== String(id)))
  }

  // ── Sale Processing ────────────────────────────────────────────────────────
  const processSale = async (customerName, mobile, cartItems, goldRate = '', silverRate = '', oldSilverAmount = '', oldGoldAmount = '') => {
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
        const soldWeight = item.totalWeight || (soldQty * (prod.weight || 0))
        const newQty = Math.max(0, prod.quantity - soldQty)
        
        const currentTotalWeight = (prod.quantity * (prod.weight || 0))
        const newTotalWeight = Math.max(0, currentTotalWeight - soldWeight)
        const newUnitWeight = newQty > 0 ? (newTotalWeight / newQty) : 0
        
        updatedProducts[pIdx] = {
          ...prod,
          quantity: newQty,
          weight: newUnitWeight
        }
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
        detail: item.detail || '',
        unitWeight: item.unitWeight,
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
    setSoldItems(prev => [...newSales, ...prev])

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
      oldGoldAmount
    }
  }

  // ── Auth gates ─────────────────────────────────────────────────────────────
  if (!user) {
    if (showSignup) return <Signup onBack={() => setShowSignup(false)} onSignupSuccess={() => setShowSignup(false)} />
    return <Login onLogin={setUser} onShowSignup={() => setShowSignup(true)} />
  }

  const deleteSale = async (id) => {
    setSoldItems(prev => prev.filter(s => String(s.id) !== String(id)))
    await deleteSupabaseRecord('sales', id)
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
