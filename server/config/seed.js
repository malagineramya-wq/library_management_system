import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';

const demoBooks = [
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', isbn: '9780132350884', quantity: 6, availableQuantity: 5 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', isbn: '9780201616224', quantity: 5, availableQuantity: 3 },
  { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', isbn: '9780061122411', quantity: 4, availableQuantity: 2 },
  { title: 'Data Structures and Algorithms', author: 'Narasimha Karumanchi', category: 'Computer Science', isbn: '9788192107593', quantity: 5, availableQuantity: 4 },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Self Help', isbn: '9780735211292', quantity: 4, availableQuantity: 2 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', isbn: '9780141439518', quantity: 3, availableQuantity: 2 },
  { title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', isbn: '9781455586691', quantity: 4, availableQuantity: 3 },
  { title: 'Machine Learning Yearning', author: 'Andrew Ng', category: 'AI', isbn: '9780307475697', quantity: 3, availableQuantity: 2 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780261102217', quantity: 5, availableQuantity: 4 },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Programming', isbn: '9780596517748', quantity: 6, availableQuantity: 5 },
  { title: 'Design Patterns', author: 'Erich Gamma, Richard Helm', category: 'Software Engineering', isbn: '9780201633610', quantity: 5, availableQuantity: 4 },
  { title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '9780262033848', quantity: 4, availableQuantity: 3 },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psychology', isbn: '9780374533557', quantity: 5, availableQuantity: 4 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', isbn: '9780060935467', quantity: 4, availableQuantity: 3 },
  { title: 'Zero to One', author: 'Peter Thiel', category: 'Business', isbn: '9780804139298', quantity: 5, availableQuantity: 4 },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', category: 'AI', isbn: '9780136042594', quantity: 4, availableQuantity: 3 },
  { title: '1984', author: 'George Orwell', category: 'Fiction', isbn: '9780451524935', quantity: 6, availableQuantity: 5 },
  { title: "You Don't Know JS: Scope & Closures", author: 'Kyle Simpson', category: 'Programming', isbn: '9781449335588', quantity: 5, availableQuantity: 4 }
];

const demoMembers = [
  { memberId: 'MEM-1001', name: 'Aisha Khan', email: 'aisha.khan@example.com', phone: '9876543210', membershipDate: '2024-01-15' },
  { memberId: 'MEM-1002', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '9123456780', membershipDate: '2023-11-02' },
  { memberId: 'MEM-1003', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9988776655', membershipDate: '2024-02-10' },
  { memberId: 'MEM-1004', name: 'Daniel George', email: 'daniel.george@example.com', phone: '9012345678', membershipDate: '2023-09-18' },
  { memberId: 'MEM-1005', name: 'Meera Das', email: 'meera.das@example.com', phone: '9765432109', membershipDate: '2024-05-01' },
  { memberId: 'MEM-1006', name: 'Alex Chen', email: 'alex.chen@example.com', phone: '9811223344', membershipDate: '2024-06-12' },
  { memberId: 'MEM-1007', name: 'Sophia Taylor', email: 'sophia.t@example.com', phone: '9844556677', membershipDate: '2024-07-04' },
  { memberId: 'MEM-1008', name: 'Vikram Patel', email: 'vikram.patel@example.com', phone: '9733445566', membershipDate: '2024-08-19' },
  { memberId: 'MEM-1009', name: 'Emily Watson', email: 'emily.watson@example.com', phone: '9655667788', membershipDate: '2024-09-01' },
  { memberId: 'MEM-1010', name: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '9544332211', membershipDate: '2024-10-15' }
];

const getDateOffset = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

export const seedDatabase = async () => {
  const [bookCount, memberCount, transactionCount] = await Promise.all([
    Book.countDocuments(),
    Member.countDocuments(),
    Transaction.countDocuments(),
  ]);

  if (bookCount > 0 || memberCount > 0 || transactionCount > 0) {
    return;
  }

  const createdBooks = await Book.insertMany(demoBooks);
  const createdMembers = await Member.insertMany(demoMembers);

  const bookMap = new Map(createdBooks.map((book) => [book.title, book._id]));
  const memberMap = new Map(createdMembers.map((member) => [member.memberId, member._id]));

  const demoTransactions = [
    {
      bookId: bookMap.get('Clean Code'),
      memberId: memberMap.get('MEM-1001'),
      issueDate: getDateOffset(-15),
      dueDate: getDateOffset(-2),
      returnDate: null,
      status: 'issued',
    },
    {
      bookId: bookMap.get('Atomic Habits'),
      memberId: memberMap.get('MEM-1003'),
      issueDate: getDateOffset(-5),
      dueDate: getDateOffset(5),
      returnDate: null,
      status: 'issued',
    },
    {
      bookId: bookMap.get('The Hobbit'),
      memberId: memberMap.get('MEM-1002'),
      issueDate: getDateOffset(-20),
      dueDate: getDateOffset(-6),
      returnDate: getDateOffset(-2),
      status: 'returned',
    },
    {
      bookId: bookMap.get('Design Patterns'),
      memberId: memberMap.get('MEM-1006'),
      issueDate: getDateOffset(-18),
      dueDate: getDateOffset(-4),
      returnDate: null,
      status: 'issued',
    },
    {
      bookId: bookMap.get('Thinking, Fast and Slow'),
      memberId: memberMap.get('MEM-1007'),
      issueDate: getDateOffset(-4),
      dueDate: getDateOffset(10),
      returnDate: null,
      status: 'issued',
    },
    {
      bookId: bookMap.get('Zero to One'),
      memberId: memberMap.get('MEM-1009'),
      issueDate: getDateOffset(-3),
      dueDate: getDateOffset(7),
      returnDate: null,
      status: 'issued',
    },
    {
      bookId: bookMap.get('Machine Learning Yearning'),
      memberId: memberMap.get('MEM-1010'),
      issueDate: getDateOffset(-25),
      dueDate: getDateOffset(-11),
      returnDate: getDateOffset(-10),
      status: 'returned',
    },
  ];

  await Transaction.insertMany(demoTransactions);
  console.log('Demo library data seeded successfully.');
};
