import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';
import { isDemoMode } from '../config/db.js';
import { getDemoBooks, getDemoMembers, getDemoTransactions, resetDemoStore } from '../config/demoStore.js';
import { seedDatabase } from '../config/seed.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (isDemoMode()) {
      const books = getDemoBooks();
      const members = getDemoMembers();
      const transactions = getDemoTransactions();
      const totalBooks = books.length;
      const availableCopies = books.reduce((sum, book) => sum + Number(book.availableQuantity || 0), 0);
      const currentlyIssuedBooks = transactions.filter((transaction) => transaction.status === 'issued').length;
      const overdueBooks = transactions.filter((transaction) => transaction.status === 'issued' && new Date(transaction.dueDate) < new Date()).length;

      return res.json({
        totalBooks,
        availableCopies,
        totalMembers: members.length,
        currentlyIssuedBooks,
        overdueBooks,
        returnedBooks: transactions.filter((transaction) => transaction.status === 'returned').length,
      });
    }

    const [books, totalMembers, issuedBooks, returnedBooks] = await Promise.all([
      Book.find(),
      Member.countDocuments(),
      Transaction.countDocuments({ status: 'issued' }),
      Transaction.countDocuments({ status: 'returned' }),
    ]);

    const totalBooks = books.length;
    const availableCopies = books.reduce((sum, book) => sum + Number(book.availableQuantity || 0), 0);
    const overdueBooks = await Transaction.countDocuments({
      status: 'issued',
      dueDate: { $lt: new Date() },
    });

    res.json({
      totalBooks,
      availableCopies,
      totalMembers,
      currentlyIssuedBooks: issuedBooks,
      overdueBooks,
      returnedBooks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error: error.message });
  }
};

export const seedSampleData = async (req, res) => {
  try {
    if (isDemoMode()) {
      resetDemoStore();
      return res.json({
        message: 'Sample data successfully loaded into demo store!',
        totalBooks: getDemoBooks().length,
        totalMembers: getDemoMembers().length,
        totalTransactions: getDemoTransactions().length,
      });
    }

    await Book.deleteMany({});
    await Member.deleteMany({});
    await Transaction.deleteMany({});
    await seedDatabase();

    const [bCount, mCount, tCount] = await Promise.all([
      Book.countDocuments(),
      Member.countDocuments(),
      Transaction.countDocuments(),
    ]);

    res.json({
      message: 'Sample data successfully loaded into MongoDB!',
      totalBooks: bCount,
      totalMembers: mCount,
      totalTransactions: tCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed sample data', error: error.message });
  }
};
