import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  getGuestCart, saveGuestCart, clearGuestCart,
  getDbCart, addToDbCart, updateDbCartItem, removeFromDbCart, clearDbCart
} from '@/services/cartService'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Load cart whenever auth state changes
  const loadCart = useCallback(async () => {
    setLoading(true)
    try {
      if (user) {
        const dbItems = await getDbCart(user.id)
        setItems(dbItems)
      } else {
        const guestItems = getGuestCart()
        setItems(guestItems)
      }
    } catch (err) {
      console.error('Failed to load cart:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = useCallback(async (product, quantity = 1) => {
    if (user) {
      await addToDbCart(user.id, product.id, quantity)
      await loadCart()
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.product.id === product.id)
        let updated
        if (existing) {
          updated = prev.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        } else {
          updated = [...prev, { id: product.id, product, quantity }]
        }
        saveGuestCart(updated)
        return updated
      })
    }
    setIsOpen(true)
  }, [user, loadCart])

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (user) {
      await updateDbCartItem(user.id, productId, quantity)
      await loadCart()
    } else {
      setItems(prev => {
        const updated = quantity <= 0
          ? prev.filter(i => i.product.id !== productId)
          : prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
        saveGuestCart(updated)
        return updated
      })
    }
  }, [user, loadCart])

  const removeItem = useCallback(async (productId) => {
    if (user) {
      await removeFromDbCart(user.id, productId)
      await loadCart()
    } else {
      setItems(prev => {
        const updated = prev.filter(i => i.product.id !== productId)
        saveGuestCart(updated)
        return updated
      })
    }
  }, [user, loadCart])

  const clearCart = useCallback(async () => {
    if (user) {
      await clearDbCart(user.id)
    } else {
      clearGuestCart()
    }
    setItems([])
  }, [user])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => {
    const price = i.product.sale_price ?? i.product.price
    return sum + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      items,
      loading,
      isOpen,
      setIsOpen,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      reload: loadCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
