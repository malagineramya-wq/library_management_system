import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  bookId: '',
  memberId: '',
  dueDate: '',
};

function TransactionsPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    try {
      const [booksResponse, membersResponse, transactionsResponse] = await Promise.all([
        api.get('/books'),
        api.get('/members'),
        api.get('/transactions'),
      ]);

      setBooks(booksResponse.data);
      setMembers(membersResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Failed to load transactions data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleIssue = async (event) => {
    event.preventDefault();

    try {
      await api.post('/transactions/issue', form);
      setForm(initialForm);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to issue the book.');
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.put(`/transactions/${id}/return`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to return the book.');
    }
  };

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="page-header small-gap">
          <div>
            <p className="eyebrow">Transactions</p>
            <h2>Issue Book</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleIssue}>
          <select name="bookId" value={form.bookId} onChange={handleChange} required>
            <option value="">Select a book</option>
            {books
              .filter((book) => book.availableQuantity > 0)
              .map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
          </select>

          <select name="memberId" value={form.memberId} onChange={handleChange} required>
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.memberId} - {member.name}
              </option>
            ))}
          </select>

          <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />

          <div className="form-actions">
            <button type="submit" className="primary-btn">Issue Book</button>
          </div>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="page-header small-gap">
          <div>
            <p className="eyebrow">Records</p>
            <h2>Transaction History</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.bookId?.title || 'N/A'}</td>
                  <td>{transaction.memberId?.memberId ? `${transaction.memberId.memberId} - ${transaction.memberId.name}` : transaction.memberId?.name || 'N/A'}</td>
                  <td>{new Date(transaction.issueDate).toLocaleDateString()}</td>
                  <td>{transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={transaction.status === 'returned' ? 'status-badge returned' : 'status-badge issued'}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    {transaction.status !== 'returned' && (
                      <button type="button" className="primary-btn small-btn" onClick={() => handleReturn(transaction._id)}>
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default TransactionsPage;
