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

// ===================== LibraryUI =====================
class LibraryUI {
	constructor(library) {
		this.library = library;
		this.libraryContainer = document.querySelector("#library-container");

		this.booksCounter = document.querySelector(".books-counter");
		this.alreadyReadBooks = document.querySelector(".already-read-books");
		this.pendingBooksCounter = document.querySelector(".pending-books-counter");
		this.totalPagesRead = document.querySelector(".total-pages-already-read");

		this.modal = document.querySelector(".modal-overlay");
		this.bookForm = document.querySelector("#bookForm");
		this.openModalBtn = document.querySelector("#addBookBtn");
		this.cancelModalBtn = document.querySelector("#cancelModal");

		this.emptyStateElement = null;
	}

	handleAddBook() {
		const title = this.bookForm.querySelector("#bookTitle").value.trim();
		const author = this.bookForm.querySelector("#bookAuthor").value.trim();
		const numberOfPages = this.bookForm.querySelector("#bookPages").value;
		const read = this.bookForm.querySelector("#bookRead").checked;

		const success = this.library.addBookToLibrary(
			title,
			author,
			numberOfPages,
			read,
		);

		if (success) {
			this.bookForm.reset();
			this.modal.style.display = "none";
			this.updateLibrary();
		} else {
			alert("Please fill all fields correctly");
		}
	}

	handleRemoveBook(bookId) {
		const success = this.library.removeBook(bookId);
		if (success) {
			this.updateLibrary();
		}
	}

	handleToggleRead(bookId) {
		const success = this.library.toggleBookRead(bookId);
		if (success) {
			this.updateLibrary();
		}
	}

	updateStats() {
		const stats = this.library.updateStats();

		this.booksCounter.textContent = stats.totalBooks;
		this.alreadyReadBooks.textContent = stats.readBooks;
		this.pendingBooksCounter = stats.pendingBooks;
		this.totalPagesRead = stats.pagesRead;
	}

	createBookCard(book) {
		const cardBook = document.createElement("div");
		cardBook.className = "book-card";
		cardBook.dataset.bookId = book.id;

		const bookTitle = document.createElement("h2");
		bookTitle.className = "book-title";
		bookTitle.textContent = book.title;

		const bookAuthor = document.createElement("p");
		bookAuthor.className = "book-author";
		bookAuthor.textContent = `by ${book.author}`;

		const bookPages = document.createElement("p");
		bookPages.className = "book-pages";
		bookPages.textContent = `${book.numberOfPages} pages`;

		const actionsContainer = document.createElement("div");
		actionsContainer.className = "book-actions";

		const readBtn = document.createElement("button");
		readBtn.className = `btn-read ${book.read ? "read" : "not-read"}`;
		readBtn.textContent = book.read ? "Read" : "Not Read";
		readBtn.addEventListener("click", () => this.handleToggleRead(book.id));

		const removeBtn = document.createElement("button");
		removeBtn.className = "btn-remove";
		removeBtn.textContent = "Remove";
		removeBtn.addEventListener("click", () => this.handleRemoveBook(book.id));

		actionsContainer.appendChild(readBtn);
		actionsContainer.appendChild(removeBtn);

		cardBook.appendChild(bookTitle);
		cardBook.appendChild(bookAuthor);
		cardBook.appendChild(bookPages);
		cardBook.appendChild(actionsContainer);

		return cardBook;
	}

	createEmptyState() {
		const emptyState = document.createElement("div");
		emptyState.className = "library-empty-state";

		const emptyStateText = document.createElement("p");
		emptyStateText.className = "empty-state-text";
		emptyStateText.textContent = "The library is empty!";

		const emptyStateImg = document.createElement("img");
		emptyStateImg.className = "empty-state-image";
		emptyStateImg.src = "./img/illustration.png";
		emptyStateImg.alt = "Empty library illustration";

		emptyState.appendChild(emptyStateText);
		emptyState.appendChild(emptyStateImg);
		
		this.libraryContainer.appendChild(emptyState);
		return emptyState;
	}

	updateLibrary() {}

	initEventListeners() {}
}

// TESTING
const library = new Library();
const libraryUI = new LibraryUI(library);

library.addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);
library.addBookToLibrary("1984", "George Orwell", 328, false);

console.log(`Stats: ${library.updateStats().totalBooks}`);
console.log(`All Books: ${library.getBooks()}`);

// test a UI
const firstBook = library.getBooks()[0];
console.log(`Before toggle: ${firstBook.read}`);
libraryUI.handleToggleRead(firstBook.id);
console.log(`After toggle: ${library.getBooks()[0].read}`);

// remove
console.log(`Before remove: ${library.getBooks().length}`);
libraryUI.handleRemoveBook(firstBook.id);
console.log(`After remove: ${library.getBooks().length}`);

console.log(`Stats: ${library.updateStats().totalBooks}`);
