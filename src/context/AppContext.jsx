import { createContext, useContext, useState, useCallback } from 'react'
import { format } from 'date-fns'
import {
  initialBooks,
  initialEquipment,
  initialMembers,
  initialTransactions,
  activityLog as initialActivityLog,
} from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [books, setBooks] = useState(initialBooks)
  const [equipment, setEquipment] = useState(initialEquipment)
  const [members, setMembers] = useState(initialMembers)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [activityLog, setActivityLog] = useState(initialActivityLog)

  const addBook = useCallback((book) => {
    const id = `B${String(books.length + 1).padStart(3, '0')}`
    setBooks((prev) => [...prev, { ...book, id, status: 'Available' }])
  }, [books.length])

  const updateBook = useCallback((id, updates) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }, [])

  const deleteBook = useCallback((id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const addEquipment = useCallback((item) => {
    const id = `E${String(equipment.length + 1).padStart(3, '0')}`
    setEquipment((prev) => [...prev, { ...item, id, status: 'Available' }])
  }, [equipment.length])

  const updateEquipment = useCallback((id, updates) => {
    setEquipment((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }, [])

  const deleteEquipment = useCallback((id) => {
    setEquipment((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const addMember = useCallback((member) => {
    const id = `M${String(members.length + 1).padStart(3, '0')}`
    setMembers((prev) => [...prev, { ...member, id, borrowCount: 0 }])
  }, [members.length])

  const createTransaction = useCallback((txn) => {
    const id = `TXN${String(transactions.length + 1).padStart(3, '0')}`
    const newTxn = { ...txn, id, status: 'Active', returnDate: null }
    setTransactions((prev) => [...prev, newTxn])

    if (txn.itemType === 'book') {
      setBooks((prev) =>
        prev.map((b) => (b.id === txn.itemId ? { ...b, status: 'Borrowed' } : b))
      )
    } else {
      setEquipment((prev) =>
        prev.map((e) => (e.id === txn.itemId ? { ...e, status: 'Borrowed' } : e))
      )
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === txn.borrowerId ? { ...m, borrowCount: m.borrowCount + 1 } : m))
    )

    setActivityLog((prev) => [
      {
        id: prev.length + 1,
        type: 'checkout',
        user: txn.borrowerName,
        item: txn.itemTitle,
        time: new Date(),
        itemType: txn.itemType,
      },
      ...prev,
    ])
  }, [transactions.length])

  const returnTransaction = useCallback((txnId) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== txnId) return t
        const returnDate = format(new Date(), 'yyyy-MM-dd')

        if (t.itemType === 'book') {
          setBooks((bs) => bs.map((b) => (b.id === t.itemId ? { ...b, status: 'Available' } : b)))
        } else {
          setEquipment((es) => es.map((e) => (e.id === t.itemId ? { ...e, status: 'Available' } : e)))
        }

        setMembers((ms) =>
          ms.map((m) => (m.id === t.borrowerId ? { ...m, borrowCount: Math.max(0, m.borrowCount - 1) } : m))
        )

        setActivityLog((log) => [
          { id: log.length + 1, type: 'checkin', user: t.borrowerName, item: t.itemTitle, time: new Date(), itemType: t.itemType },
          ...log,
        ])

        return { ...t, returnDate, status: 'Returned' }
      })
    )
  }, [])

  const stats = {
    totalActiveLoans: transactions.filter((t) => t.status === 'Active').length,
    totalOverdue: transactions.filter((t) => t.status === 'Overdue').length,
    availableBooks: books.filter((b) => b.status === 'Available').length,
    availableEquipment: equipment.filter((e) => e.status === 'Available').length,
    totalBooks: books.length,
    totalEquipment: equipment.length,
  }

  return (
    <AppContext.Provider value={{
      books, equipment, members, transactions, activityLog, stats,
      addBook, updateBook, deleteBook,
      addEquipment, updateEquipment, deleteEquipment,
      addMember, createTransaction, returnTransaction,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
