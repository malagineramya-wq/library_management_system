const demoBooks = [
  { _id: 'book-1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', isbn: '9780132350884', quantity: 6, availableQuantity: 5 },
  { _id: 'book-2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', isbn: '9780201616224', quantity: 5, availableQuantity: 3 },
  { _id: 'book-3', title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', isbn: '9780061122411', quantity: 4, availableQuantity: 2 },
  { _id: 'book-4', title: 'Data Structures and Algorithms', author: 'Narasimha Karumanchi', category: 'Computer Science', isbn: '9788192107593', quantity: 5, availableQuantity: 4 },
  { _id: 'book-5', title: 'Atomic Habits', author: 'James Clear', category: 'Self Help', isbn: '9780735211292', quantity: 4, availableQuantity: 2 },
  { _id: 'book-6', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', isbn: '9780141439518', quantity: 3, availableQuantity: 2 },
  { _id: 'book-7', title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', isbn: '9781455586691', quantity: 4, availableQuantity: 3 },
  { _id: 'book-8', title: 'Machine Learning Yearning', author: 'Andrew Ng', category: 'AI', isbn: '9780307475697', quantity: 3, availableQuantity: 2 },
  { _id: 'book-9', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780261102217', quantity: 5, availableQuantity: 4 },
  { _id: 'book-10', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Programming', isbn: '9780596517748', quantity: 6, availableQuantity: 5 },
  { _id: 'book-11', title: 'Design Patterns', author: 'Erich Gamma, Richard Helm', category: 'Software Engineering', isbn: '9780201633610', quantity: 5, availableQuantity: 4 },
  { _id: 'book-12', title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '9780262033848', quantity: 4, availableQuantity: 3 },
  { _id: 'book-13', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psychology', isbn: '9780374533557', quantity: 5, availableQuantity: 4 },
  { _id: 'book-14', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', isbn: '9780060935467', quantity: 4, availableQuantity: 3 },
  { _id: 'book-15', title: 'Zero to One', author: 'Peter Thiel', category: 'Business', isbn: '9780804139298', quantity: 5, availableQuantity: 4 },
  { _id: 'book-16', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', category: 'AI', isbn: '9780136042594', quantity: 4, availableQuantity: 3 },
  { _id: 'book-17', title: '1984', author: 'George Orwell', category: 'Fiction', isbn: '9780451524935', quantity: 6, availableQuantity: 5 },
  { _id: 'book-18', title: "You Don't Know JS: Scope & Closures", author: 'Kyle Simpson', category: 'Programming', isbn: '9781449335588', quantity: 5, availableQuantity: 4 }
];

const demoMembers = [
  { _id: 'member-1', memberId: 'MEM-1001', name: 'Aisha Khan', email: 'aisha.khan@example.com', phone: '9876543210', membershipDate: '2024-01-15T00:00:00.000Z' },
  { _id: 'member-2', memberId: 'MEM-1002', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '9123456780', membershipDate: '2023-11-02T00:00:00.000Z' },
  { _id: 'member-3', memberId: 'MEM-1003', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9988776655', membershipDate: '2024-02-10T00:00:00.000Z' },
  { _id: 'member-4', memberId: 'MEM-1004', name: 'Daniel George', email: 'daniel.george@example.com', phone: '9012345678', membershipDate: '2023-09-18T00:00:00.000Z' },
  { _id: 'member-5', memberId: 'MEM-1005', name: 'Meera Das', email: 'meera.das@example.com', phone: '9765432109', membershipDate: '2024-05-01T00:00:00.000Z' },
  { _id: 'member-6', memberId: 'MEM-1006', name: 'Alex Chen', email: 'alex.chen@example.com', phone: '9811223344', membershipDate: '2024-06-12T00:00:00.000Z' },
  { _id: 'member-7', memberId: 'MEM-1007', name: 'Sophia Taylor', email: 'sophia.t@example.com', phone: '9844556677', membershipDate: '2024-07-04T00:00:00.000Z' },
  { _id: 'member-8', memberId: 'MEM-1008', name: 'Vikram Patel', email: 'vikram.patel@example.com', phone: '9733445566', membershipDate: '2024-08-19T00:00:00.000Z' },
  { _id: 'member-9', memberId: 'MEM-1009', name: 'Emily Watson', email: 'emily.watson@example.com', phone: '9655667788', membershipDate: '2024-09-01T00:00:00.000Z' },
  { _id: 'member-10', memberId: 'MEM-1010', name: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '9544332211', membershipDate: '2024-10-15T00:00:00.000Z' }
];

const demoTransactions = [
  {
    _id: 'txn-1',
    bookId: 'book-1',
    memberId: 'member-1',
    issueDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    returnDate: null,
    status: 'issued',
  },
  {
    _id: 'txn-2',
    bookId: 'book-5',
    memberId: 'member-3',
    issueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    returnDate: null,
    status: 'issued',
  },
  {
    _id: 'txn-3',
    bookId: 'book-9',
    memberId: 'member-2',
    issueDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 6 * 86400000).toISOString(),
    returnDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'returned',
  },
  {
    _id: 'txn-4',
    bookId: 'book-11',
    memberId: 'member-6',
    issueDate: new Date(Date.now() - 18 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    returnDate: null,
    status: 'issued',
  },
  {
    _id: 'txn-5',
    bookId: 'book-13',
    memberId: 'member-7',
    issueDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    returnDate: null,
    status: 'issued',
  },
  {
    _id: 'txn-6',
    bookId: 'book-15',
    memberId: 'member-9',
    issueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    returnDate: null,
    status: 'issued',
  },
  {
    _id: 'txn-7',
    bookId: 'book-8',
    memberId: 'member-10',
    issueDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    dueDate: new Date(Date.now() - 11 * 86400000).toISOString(),
    returnDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    status: 'returned',
  }
];

const state = {
  books: JSON.parse(JSON.stringify(demoBooks)),
  members: JSON.parse(JSON.stringify(demoMembers)),
  transactions: JSON.parse(JSON.stringify(demoTransactions)),
};

export const initializeDemoStore = () => {
  if (state.books.length === 0 && state.members.length === 0 && state.transactions.length === 0) {
    resetDemoStore();
  }
  return state;
};

export const resetDemoStore = () => {
  state.books = JSON.parse(JSON.stringify(demoBooks));
  state.members = JSON.parse(JSON.stringify(demoMembers));
  state.transactions = JSON.parse(JSON.stringify(demoTransactions));
  return state;
};

export const getDemoBooks = () => [...state.books];
export const getDemoMembers = () => [...state.members];
export const getDemoTransactions = () => [...state.transactions];

export const addDemoBook = (payload) => {
  const newBook = {
    _id: `book-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ...payload,
    quantity: Number(payload.quantity),
    availableQuantity: Number(payload.availableQuantity ?? payload.quantity),
  };
  state.books.push(newBook);
  return newBook;
};

export const updateDemoBook = (id, payload) => {
  const index = state.books.findIndex((book) => book._id === id);
  if (index === -1) return null;

  state.books[index] = {
    ...state.books[index],
    ...payload,
    quantity: Number(payload.quantity ?? state.books[index].quantity),
    availableQuantity: Number(payload.availableQuantity ?? state.books[index].availableQuantity),
  };

  return state.books[index];
};

export const deleteDemoBook = (id) => {
  const index = state.books.findIndex((book) => book._id === id);
  if (index === -1) return false;
  state.books.splice(index, 1);
  return true;
};

export const addDemoMember = (payload) => {
  const newMember = {
    _id: `member-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ...payload,
  };
  state.members.push(newMember);
  return newMember;
};

export const updateDemoMember = (id, payload) => {
  const index = state.members.findIndex((member) => member._id === id);
  if (index === -1) return null;
  state.members[index] = { ...state.members[index], ...payload };
  return state.members[index];
};

export const deleteDemoMember = (id) => {
  const index = state.members.findIndex((member) => member._id === id);
  if (index === -1) return false;
  state.members.splice(index, 1);
  return true;
};

export const addDemoTransaction = (payload) => {
  const newTransaction = {
    _id: `txn-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ...payload,
    status: payload.status || 'issued',
  };
  state.transactions.push(newTransaction);
  return newTransaction;
};

export const updateDemoTransaction = (id, payload) => {
  const index = state.transactions.findIndex((transaction) => transaction._id === id);
  if (index === -1) return null;
  state.transactions[index] = { ...state.transactions[index], ...payload };
  return state.transactions[index];
};

export const deleteDemoTransaction = (id) => {
  const index = state.transactions.findIndex((transaction) => transaction._id === id);
  if (index === -1) return false;
  state.transactions.splice(index, 1);
  return true;
};

export const isDemoDataEmpty = () => state.books.length === 0 && state.members.length === 0 && state.transactions.length === 0;

initializeDemoStore();
