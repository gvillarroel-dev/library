// ===================== Book =====================
class Book {
	constructor(title, author, numberOfPages, read) {
		if (!new.target) {
			throw new Error(
				"Must use the new operator to call the constructor",
			);
		}

		this.id = crypto.randomUUID();
		this.title = title;
		this.author = author;
		this.numberOfPages = numberOfPages;
		this.read = read;
	}

	toggleRead() {
		this.read = !this.read;
	}
}

// ===================== Library =====================
class Library {
	constructor() {
		this.books = [];
	}

	addBookToLibrary(title, author, numberOfPages, read = false) {
		numberOfPages = parseInt(numberOfPages);
		if (!title || !author || isNaN(numberOfPages) || numberOfPages <= 0) {
			return false;
		}

		const newBook = new Book(title, author, numberOfPages, read);
		this.books.push(newBook);
		return true;
	}

	removeBook(bookId) {
		const index = this.books.findIndex((book) => book.id === bookId);
		if (index !== -1) {
			this.books.splice(index, 1);
			return true;
		}

		return false;
	}

	toggleBookRead(bookId) {
		const book = this.books.find((book) => book.id === bookId);
		if (book) {
			book.toggleRead();
			return true;
		}

		return false;
	}

	updateStats() {
		const totalBooks = this.books.length;
		const readBooks = this.books.filter((book) => book.read).length;
		const pendingBooks = totalBooks - readBooks;
		const pagesRead = this.books
			.filter((book) => book.read)
			.reduce((sum, book) => sum + Number(book.numberOfPages), 0);

		return { totalBooks, readBooks, pendingBooks, pagesRead };
	}

	getBooks() {
		return [...this.books];
	}
}

const lib = new Library();

lib.addBookToLibrary("Songwolf", "T.J. Klune", 528, true);
lib.addBookToLibrary("Ravensong", "T.J. Klune", 528);
console.log(lib.getBooks());
