import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  title: '',
  author: '',
  category: '',
  isbn: '',
  quantity: 1,
};

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadBooks = async () => {
    const { data } = await api.get('/books');
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, form);
      } else {
        await api.post('/books', form);
      }

      resetForm();
      loadBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong while saving the book.');
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${id}`);
      loadBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete the book.');
    }
  };

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="page-header small-gap">
          <div>
            <p className="eyebrow">Books</p>
            <h2>{editingId ? 'Edit Book' : 'Add Book'}</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Book title" required />
          <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
          <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" required />
          <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} placeholder="Quantity" required />

          <div className="form-actions">
            <button type="submit" className="primary-btn">{editingId ? 'Update Book' : 'Add Book'}</button>
            {editingId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="page-header small-gap">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>Books List</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>{book.availableQuantity}</td>
                  <td className="action-cell">
                    <button type="button" className="secondary-btn" onClick={() => handleEdit(book)}>
                      Edit
                    </button>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(book._id)}>
                      Delete
                    </button>
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

export default BooksPage;
