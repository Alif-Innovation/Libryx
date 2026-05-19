import { addDays, subDays, format } from 'date-fns'

const today = new Date()
const fmt = (d) => format(d, 'yyyy-MM-dd')

export const BOOK_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
  'Mathematics', 'Arts & Design', 'Biography', 'Philosophy', 'Reference',
]

export const EQUIPMENT_CATEGORIES = [
  'Electronics', 'Stationery', 'Photography', 'Audio/Visual',
  'Computing', 'Science Lab', 'Art Supplies', 'Sports',
]

export const initialBooks = [
  {
    id: 'B001', title: 'Atomic Habits', author: 'James Clear',
    isbn: '9780735211292', publisher: 'Avery', category: 'Non-Fiction',
    shelfLocation: 'A-01', status: 'Available', coverColor: 'indigo',
  },
  {
    id: 'B002', title: 'The Design of Everyday Things', author: 'Don Norman',
    isbn: '9780465050659', publisher: 'Basic Books', category: 'Arts & Design',
    shelfLocation: 'B-03', status: 'Borrowed', coverColor: 'emerald',
  },
  {
    id: 'B003', title: 'Clean Code', author: 'Robert C. Martin',
    isbn: '9780132350884', publisher: 'Prentice Hall', category: 'Technology',
    shelfLocation: 'C-07', status: 'Available', coverColor: 'violet',
  },
  {
    id: 'B004', title: 'Sapiens', author: 'Yuval Noah Harari',
    isbn: '9780062316097', publisher: 'Harper', category: 'History',
    shelfLocation: 'D-02', status: 'Borrowed', coverColor: 'amber',
  },
  {
    id: 'B005', title: 'Deep Work', author: 'Cal Newport',
    isbn: '9781455586691', publisher: 'Grand Central', category: 'Non-Fiction',
    shelfLocation: 'A-04', status: 'Available', coverColor: 'rose',
  },
  {
    id: 'B006', title: 'The Pragmatic Programmer', author: 'David Thomas',
    isbn: '9780135957059', publisher: 'Addison-Wesley', category: 'Technology',
    shelfLocation: 'C-08', status: 'Available', coverColor: 'cyan',
  },
  {
    id: 'B007', title: 'Zero to One', author: 'Peter Thiel',
    isbn: '9780804139021', publisher: 'Crown Business', category: 'Non-Fiction',
    shelfLocation: 'A-06', status: 'Borrowed', coverColor: 'orange',
  },
  {
    id: 'B008', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman',
    isbn: '9780374533557', publisher: 'FSG', category: 'Philosophy',
    shelfLocation: 'E-01', status: 'Available', coverColor: 'teal',
  },
  {
    id: 'B009', title: 'The Lean Startup', author: 'Eric Ries',
    isbn: '9780307887894', publisher: 'Crown Business', category: 'Technology',
    shelfLocation: 'C-11', status: 'Available', coverColor: 'lime',
  },
  {
    id: 'B010', title: 'Educated', author: 'Tara Westover',
    isbn: '9780399590504', publisher: 'Random House', category: 'Biography',
    shelfLocation: 'F-03', status: 'Borrowed', coverColor: 'pink',
  },
]

export const initialEquipment = [
  {
    id: 'E001', name: 'iPad Pro 12.9"', serialNumber: 'DLXK9-4421',
    brand: 'Apple', model: 'iPad Pro M2', category: 'Electronics',
    condition: 'Excellent', status: 'Available',
  },
  {
    id: 'E002', name: 'Canon EOS M50', serialNumber: 'CNM-20394',
    brand: 'Canon', model: 'EOS M50 Mark II', category: 'Photography',
    condition: 'Good', status: 'Borrowed',
  },
  {
    id: 'E003', name: 'Digital Drawing Tablet', serialNumber: 'WCM-55821',
    brand: 'Wacom', model: 'Intuos Pro Medium', category: 'Electronics',
    condition: 'Excellent', status: 'Available',
  },
  {
    id: 'E004', name: 'Portable Projector', serialNumber: 'EPS-33019',
    brand: 'Epson', model: 'EF-100', category: 'Audio/Visual',
    condition: 'Good', status: 'Borrowed',
  },
  {
    id: 'E005', name: 'MacBook Air M2', serialNumber: 'APPL-M2-7712',
    brand: 'Apple', model: 'MacBook Air 13"', category: 'Computing',
    condition: 'Excellent', status: 'Available',
  },
  {
    id: 'E006', name: 'Scientific Calculator', serialNumber: 'TI-990-3321',
    brand: 'Texas Instruments', model: 'TI-84 Plus', category: 'Electronics',
    condition: 'Good', status: 'Available',
  },
  {
    id: 'E007', name: 'Sony A6400 Camera', serialNumber: 'SNY-A64-8812',
    brand: 'Sony', model: 'A6400', category: 'Photography',
    condition: 'Excellent', status: 'Borrowed',
  },
  {
    id: 'E008', name: 'Arduino Uno Kit', serialNumber: 'ARD-KIT-5501',
    brand: 'Arduino', model: 'Uno R3 Starter Kit', category: 'Science Lab',
    condition: 'Good', status: 'Available',
  },
  {
    id: 'E009', name: 'Blue Yeti Microphone', serialNumber: 'BLU-YTI-2239',
    brand: 'Blue', model: 'Yeti USB', category: 'Audio/Visual',
    condition: 'Excellent', status: 'Available',
  },
  {
    id: 'E010', name: 'Laser Measure Tool', serialNumber: 'BOS-GLM-4490',
    brand: 'Bosch', model: 'GLM 50-27 CG', category: 'Science Lab',
    condition: 'Damaged', status: 'Available',
  },
]

export const initialMembers = [
  { id: 'M001', name: 'Alex Rivera', email: 'alex.rivera@school.edu', role: 'Student', borrowCount: 3 },
  { id: 'M002', name: 'Jordan Lee', email: 'jordan.lee@school.edu', role: 'Student', borrowCount: 1 },
  { id: 'M003', name: 'Morgan Chen', email: 'morgan.chen@school.edu', role: 'Faculty', borrowCount: 2 },
  { id: 'M004', name: 'Sam Patel', email: 'sam.patel@school.edu', role: 'Student', borrowCount: 0 },
  { id: 'M005', name: 'Casey Thompson', email: 'casey.t@school.edu', role: 'Student', borrowCount: 1 },
  { id: 'M006', name: 'Taylor Nguyen', email: 't.nguyen@school.edu', role: 'Faculty', borrowCount: 1 },
  { id: 'M007', name: 'Riley Kim', email: 'r.kim@school.edu', role: 'Student', borrowCount: 0 },
  { id: 'M008', name: 'Drew Santos', email: 'd.santos@school.edu', role: 'Student', borrowCount: 1 },
]

export const initialTransactions = [
  {
    id: 'TXN001', borrowerName: 'Alex Rivera', borrowerId: 'M001',
    itemId: 'B002', itemTitle: 'The Design of Everyday Things', itemType: 'book',
    borrowDate: fmt(subDays(today, 14)), dueDate: fmt(subDays(today, 7)),
    returnDate: null, status: 'Overdue',
  },
  {
    id: 'TXN002', borrowerName: 'Jordan Lee', borrowerId: 'M002',
    itemId: 'E002', itemTitle: 'Canon EOS M50', itemType: 'equipment',
    borrowDate: fmt(subDays(today, 5)), dueDate: fmt(addDays(today, 2)),
    returnDate: null, status: 'Active',
  },
  {
    id: 'TXN003', borrowerName: 'Morgan Chen', borrowerId: 'M003',
    itemId: 'B004', itemTitle: 'Sapiens', itemType: 'book',
    borrowDate: fmt(subDays(today, 10)), dueDate: fmt(subDays(today, 3)),
    returnDate: null, status: 'Overdue',
  },
  {
    id: 'TXN004', borrowerName: 'Alex Rivera', borrowerId: 'M001',
    itemId: 'E004', itemTitle: 'Portable Projector', itemType: 'equipment',
    borrowDate: fmt(subDays(today, 3)), dueDate: fmt(addDays(today, 4)),
    returnDate: null, status: 'Active',
  },
  {
    id: 'TXN005', borrowerName: 'Casey Thompson', borrowerId: 'M005',
    itemId: 'B007', itemTitle: 'Zero to One', itemType: 'book',
    borrowDate: fmt(subDays(today, 20)), dueDate: fmt(subDays(today, 13)),
    returnDate: fmt(subDays(today, 14)), status: 'Returned',
  },
  {
    id: 'TXN006', borrowerName: 'Drew Santos', borrowerId: 'M008',
    itemId: 'E007', itemTitle: 'Sony A6400 Camera', itemType: 'equipment',
    borrowDate: fmt(subDays(today, 2)), dueDate: fmt(addDays(today, 5)),
    returnDate: null, status: 'Active',
  },
  {
    id: 'TXN007', borrowerName: 'Taylor Nguyen', borrowerId: 'M006',
    itemId: 'B010', itemTitle: 'Educated', itemType: 'book',
    borrowDate: fmt(subDays(today, 8)), dueDate: fmt(addDays(today, 6)),
    returnDate: null, status: 'Active',
  },
  {
    id: 'TXN008', borrowerName: 'Morgan Chen', borrowerId: 'M003',
    itemId: 'B001', itemTitle: 'Atomic Habits', itemType: 'book',
    borrowDate: fmt(subDays(today, 30)), dueDate: fmt(subDays(today, 23)),
    returnDate: fmt(subDays(today, 22)), status: 'Returned',
  },
  {
    id: 'TXN009', borrowerName: 'Sam Patel', borrowerId: 'M004',
    itemId: 'E003', itemTitle: 'Digital Drawing Tablet', itemType: 'equipment',
    borrowDate: fmt(subDays(today, 45)), dueDate: fmt(subDays(today, 38)),
    returnDate: fmt(subDays(today, 39)), status: 'Returned',
  },
  {
    id: 'TXN010', borrowerName: 'Riley Kim', borrowerId: 'M007',
    itemId: 'B006', itemTitle: 'The Pragmatic Programmer', itemType: 'book',
    borrowDate: fmt(subDays(today, 60)), dueDate: fmt(subDays(today, 53)),
    returnDate: fmt(subDays(today, 54)), status: 'Returned',
  },
]

export const activityLog = [
  { id: 1, type: 'checkout', user: 'Drew Santos', item: 'Sony A6400 Camera', time: subDays(today, 2), itemType: 'equipment' },
  { id: 2, type: 'checkout', user: 'Taylor Nguyen', item: 'Educated', time: subDays(today, 8), itemType: 'book' },
  { id: 3, type: 'checkin', user: 'Casey Thompson', item: 'Zero to One', time: subDays(today, 14), itemType: 'book' },
  { id: 4, type: 'checkout', user: 'Alex Rivera', item: 'Portable Projector', time: subDays(today, 3), itemType: 'equipment' },
  { id: 5, type: 'checkin', user: 'Morgan Chen', item: 'Atomic Habits', time: subDays(today, 22), itemType: 'book' },
  { id: 6, type: 'overdue', user: 'Alex Rivera', item: 'The Design of Everyday Things', time: subDays(today, 7), itemType: 'book' },
]
