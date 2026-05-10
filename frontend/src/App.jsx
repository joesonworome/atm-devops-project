import { useState } from 'react'
import './App.css'

const AUTH_URL = 'http://localhost:4001/api/auth'
const ACCOUNT_URL = 'http://localhost:4002/api/account'
const TRANSACTION_URL = 'http://localhost:4003/api/transaction'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

function App() {
  const [view, setView] = useState('login')
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState('deposit')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const resetSession = () => {
    setView('login')
    setUsername('')
    setPin('')
    setAccountNumber('')
    setAccountName('')
    setBalance(0)
    setTransactions([])
    setAmount('')
    setTransactionType('deposit')
    setDescription('')
    setStatus('')
    setLoading(false)
  }

  const updateStatus = (message) => {
    setStatus(message)
  }

  const fetchAccount = async (accountNum) => {
    const response = await fetch(`${ACCOUNT_URL}/balance/${accountNum}`)
    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to load account balance')
    }
    setBalance(data.account.balance)
    setAccountName(data.account.name)
  }

  const fetchTransactions = async (accountNum) => {
    const response = await fetch(`${TRANSACTION_URL}/history/${accountNum}`)
    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to load transactions')
    }
    setTransactions(data.transactions || [])
  }

  const login = async (event) => {
    event.preventDefault()
    setLoading(true)
    updateStatus('Signing in…')

    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials')
      }

      setAccountNumber(data.user.accountNumber)
      setAccountName(data.user.username)
      setView('dashboard')
      updateStatus('Logged in successfully')
      await fetchAccount(data.user.accountNumber)
      await fetchTransactions(data.user.accountNumber)
    } catch (error) {
      updateStatus(error.message)
    }

    setLoading(false)
  }

  const submitTransaction = async (event) => {
    event.preventDefault()
    setLoading(true)
    updateStatus(`${transactionType === 'deposit' ? 'Depositing' : 'Withdrawing'} funds…`)

    try {
      const amountNumeric = Number(amount)
      if (!accountNumber || Number.isNaN(amountNumeric) || amountNumeric <= 0) {
        throw new Error('Enter a valid amount')
      }

      const response = await fetch(`${ACCOUNT_URL}/${transactionType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, amount: amountNumeric })
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Transaction failed')
      }

      setBalance(result.account.balance)
      updateStatus(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} complete`)

      await fetch(`${TRANSACTION_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber,
          amount: amountNumeric,
          type: transactionType,
          description: description || `${transactionType} via frontend`
        })
      })

      await fetchTransactions(accountNumber)
      setAmount('')
      setDescription('')
    } catch (error) {
      updateStatus(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        {view === 'dashboard' && (
          <button className="ghost-button" onClick={resetSession}>
            Sign out
          </button>
        )}
      </header>

      <main className="content">
        {view === 'login' ? (
          <section className="panel login-panel">
            <div className="login-panel__hero">
              <p className="eyebrow">ATM</p>
              <h1>Login</h1>
              <p className="intro-copy">Enter your username and PIN to continue.</p>
            </div>

            <form className="form-grid" onSubmit={login}>
              <label>
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
              </label>

              <label>
                PIN Code
                <input
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                  type="password"
                  placeholder="••••"
                  autoComplete="current-password"
                  maxLength="4"
                  required
                />
              </label>

              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Authenticating…' : 'Continue'}
              </button>
            </form>

            {status && (
              <div className="status-message">
                {status.includes('Invalid') || status.includes('error') ? '❌' : '✅'} {status}
              </div>
            )}
          </section>
        ) : (
          <section className="panel dashboard-panel">
            <div className="dashboard-grid">
              <div className="card summary-card">
                <div className="summary-header">
                  <p className="eyebrow">Account summary</p>
                  <p className="subtle">{accountNumber}</p>
                </div>
                <h2>{accountName}</h2>
                <p className="large-balance">{formatCurrency(balance)}</p>
                <p className="detail">Current balance available for withdrawal and deposit.</p>
              </div>

              <div className="card actions-card">
                <div className="summary-header">
                  <p className="eyebrow">Quick transaction</p>
                  <p className="subtle">{view === 'dashboard' ? 'Secure access' : ''}</p>
                </div>

                <form className="form-grid" onSubmit={submitTransaction}>
                  <div className="radio-group">
                    <label className={transactionType === 'deposit' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="type"
                        value="deposit"
                        checked={transactionType === 'deposit'}
                        onChange={() => setTransactionType('deposit')}
                      />
                      Deposit
                    </label>
                    <label className={transactionType === 'withdraw' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="type"
                        value="withdraw"
                        checked={transactionType === 'withdraw'}
                        onChange={() => setTransactionType('withdraw')}
                      />
                      Withdraw
                    </label>
                  </div>

                  <label>
                    Amount
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="100.00"
                      required
                    />
                  </label>

                  <label>
                    Description
                    <input
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Optional note"
                    />
                  </label>

                  <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? 'Processing…' : transactionType === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}
                  </button>
                </form>
              </div>
            </div>

            <div className="card history-card">
              <div className="history-header">
                <div>
                  <p className="eyebrow">Transaction history</p>
                  <h2>Recent activity</h2>
                </div>
                <button className="ghost-button" onClick={() => fetchTransactions(accountNumber)}>
                  Refresh
                </button>
              </div>

              {transactions.length === 0 ? (
                <p className="empty-state">No transactions found yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 8).map((transaction) => (
                        <tr key={transaction._id || transaction.createdAt}>
                          <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                          <td>{transaction.type}</td>
                          <td>{transaction.description || 'ATM transaction'}</td>
                          <td>{formatCurrency(transaction.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {status && <div className="status-message">{status}</div>}
          </section>
        )}
      </main>

      <footer className="footer">
        Built for the ATM DevOps project · backend services running on localhost ports 4001, 4002, 4003
      </footer>
    </div>
  )
}

export default App
