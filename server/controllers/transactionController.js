import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';
import { isDemoMode } from '../config/db.js';
import { addDemoTransaction, getDemoBooks, getDemoMembers, getDemoTransactions, updateDemoBook, updateDemoTransaction } from '../config/demoStore.js';

export const getTransactions = async (req, res) => {
  try {
    if (isDemoMode()) {
      const transactions = getDemoTransactions().map((transaction) => ({
        ...transaction,
        bookId: getDemoBooks().find((book) => book._id === transaction.bookId) || null,
        memberId: getDemoMembers().find((member) => member._id === transaction.memberId) || null,
      }));
      return res.json(transactions.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)));
    }

    const transactions = await Transaction.find()
      .populate('bookId', 'title author')
      .populate('memberId', 'name email memberId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    if (!bookId || !memberId) {
      return res.status(400).json({ message: 'Book and member are required.' });
    }

    if (isDemoMode()) {
      const book = getDemoBooks().find((item) => item._id === bookId);
      const member = getDemoMembers().find((item) => item._id === memberId);

      if (!book || !member) {
        return res.status(404).json({ message: 'Book or member not found.' });
      }

      if (book.availableQuantity < 1) {
        return res.status(400).json({ message: 'No copies of this book are available to issue.' });
      }

      const normalizedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      if (Number.isNaN(normalizedDueDate.getTime())) {
        return res.status(400).json({ message: 'Please provide a valid due date.' });
      }

      const transaction = addDemoTransaction({
        bookId,
        memberId,
        issueDate: new Date().toISOString(),
        dueDate: normalizedDueDate.toISOString(),
        returnDate: null,
        status: 'issued',
      });

      updateDemoBook(book._id, {
        availableQuantity: Number(book.availableQuantity) - 1,
      });

      return res.status(201).json({ message: 'Book issued successfully.', transaction });
    }

    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book || !member) {
      return res.status(404).json({ message: 'Book or member not found.' });
    }

    if (book.availableQuantity < 1) {
      return res.status(400).json({ message: 'No copies of this book are available to issue.' });
    }

    const normalizedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    if (Number.isNaN(normalizedDueDate.getTime())) {
      return res.status(400).json({ message: 'Please provide a valid due date.' });
    }

    const transaction = await Transaction.create({
      bookId,
      memberId,
      issueDate: new Date(),
      dueDate: normalizedDueDate,
      status: 'issued',
    });

    book.availableQuantity -= 1;
    await book.save();

    res.status(201).json({
      message: 'Book issued successfully.',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to issue book', error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    if (isDemoMode()) {
      const transactions = getDemoTransactions();
      const transaction = transactions.find((item) => item._id === req.params.id);

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      if (transaction.status === 'returned') {
        return res.status(400).json({ message: 'This book has already been returned.' });
      }

      const updatedTransaction = updateDemoTransaction(req.params.id, {
        returnDate: new Date().toISOString(),
        status: 'returned',
      });

      const book = getDemoBooks().find((item) => item._id === transaction.bookId);
      if (book) {
        updateDemoBook(book._id, {
          availableQuantity: Number(book.availableQuantity) + 1,
        });
      }

      return res.json({ message: 'Book returned successfully.', transaction: updatedTransaction });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'This book has already been returned.' });
    }

    transaction.returnDate = new Date();
    transaction.status = 'returned';
    await transaction.save();

    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    res.json({
      message: 'Book returned successfully.',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
};
