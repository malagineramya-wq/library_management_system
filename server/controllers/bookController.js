import Book from '../models/Book.js';
import { isDemoMode } from '../config/db.js';
import { addDemoBook, deleteDemoBook, getDemoBooks, updateDemoBook } from '../config/demoStore.js';

export const getBooks = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(getDemoBooks());
    }

    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity } = req.body;

    if (!title || !author || !category || !isbn || !quantity) {
      return res.status(400).json({ message: 'Please provide all required book fields.' });
    }

    if (isDemoMode()) {
      const existingBook = getDemoBooks().find((book) => book.isbn.trim() === isbn.trim());
      if (existingBook) {
        return res.status(400).json({ message: 'A book with this ISBN already exists.' });
      }

      const newBook = addDemoBook({
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        isbn: isbn.trim(),
        quantity: Number(quantity),
        availableQuantity: Number(quantity),
      });

      return res.status(201).json(newBook);
    }

    const existingBook = await Book.findOne({ isbn: isbn.trim() });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists.' });
    }

    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      isbn: isbn.trim(),
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity, availableQuantity } = req.body;

    if (isDemoMode()) {
      const book = getDemoBooks().find((item) => item._id === req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
      }

      const updatedBook = updateDemoBook(req.params.id, {
        title: title ? title.trim() : book.title,
        author: author ? author.trim() : book.author,
        category: category ? category.trim() : book.category,
        isbn: isbn ? isbn.trim() : book.isbn,
        quantity: quantity !== undefined ? Number(quantity) : book.quantity,
        availableQuantity: availableQuantity !== undefined ? Number(availableQuantity) : book.availableQuantity,
      });

      return res.json(updatedBook);
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (category) book.category = category.trim();
    if (isbn) book.isbn = isbn.trim();
    if (quantity !== undefined) {
      const diff = Number(quantity) - book.quantity;
      book.quantity = Number(quantity);
      book.availableQuantity = Math.max(0, Math.min(book.availableQuantity + diff, Number(quantity)));
    }
    if (availableQuantity !== undefined) {
      book.availableQuantity = Math.max(0, Math.min(Number(availableQuantity), book.quantity));
    }

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    if (isDemoMode()) {
      const removed = deleteDemoBook(req.params.id);
      if (!removed) {
        return res.status(404).json({ message: 'Book not found.' });
      }
      return res.json({ message: 'Book deleted successfully.' });
    }

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};
