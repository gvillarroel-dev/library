// ===================== Book =====================
class Book {
	constructor(title, author, numberOfPages, read) {
		if (!new.target) {
			throw new Error("Must use the new operator to call the constructor");
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
		this.initEventListeners();
	}

	handleAddBook() {
		const title = this.bookForm.querySelector("#bookTitle").value.trim();
		const author = this.bookForm.querySelector("#bookAuthor").value.trim();
		const numberOfPages = this.bookForm.querySelector("#bookPages").value;
		const read = this.bookForm.querySelector("#bookRead").checked;

		const success = this.library.addBookToLibrary(title, author, numberOfPages, read);

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
		this.pendingBooksCounter.textContent = stats.pendingBooks;
		this.totalPagesRead.textContent = stats.pagesRead;
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

	updateLibrary() {
		this.libraryContainer.innerHTML = "";

		const books = this.library.getBooks();
		if (books.length === 0) {
			if (!this.emptyStateElement) {
				this.emptyStateElement = this.createEmptyState();
			}
			this.libraryContainer.appendChild(this.emptyStateElement);
		} else {
			books.forEach((book) => {
				const bookCard = this.createBookCard(book);
				this.libraryContainer.appendChild(bookCard);
			});
		}

		this.updateStats();
	}

	initEventListeners() {
		this.openModalBtn.addEventListener("click", () => {
			this.modal.style.display = "flex";
		});

		this.cancelModalBtn.addEventListener("click", () => {
			this.modal.style.display = "none";
			this.bookForm.reset();
		});

		this.bookForm.addEventListener("submit", (e) => {
			e.preventDefault();
			
			const titleInput = this.bookForm.querySelector("#bookTitle");
			const authorInput = this.bookForm.querySelector("#bookAuthor");
			const pagesInput = this.bookForm.querySelector("#bookPages");

			[titleInput, authorInput, pagesInput].forEach((i) => i.setCustomValidity(""));

			if (!titleInput.value.trim()) {
				titleInput.setCustomValidity("The book title must be filled in");
			}
			if (!authorInput.value.trim()) {
				authorInput.setCustomValidity("The author's name must be filled in");
			}
			if (!pagesInput.value || parseInt(pagesInput.value) <= 0) {
				pagesInput.setCustomValidity("The number of pages must be greater than 0");
			}

			if (!this.bookForm.checkValidity()) {
				this.bookForm.reportValidity();
				return;
			}

			this.handleAddBook();
		});

		this.modal.addEventListener("click", (e) => {
			if (e.target === this.modal) {
				this.modal.style.display = "none";
				this.bookForm.reset();
			}
		});
	}
}


const library = new Library();
const UI = new LibraryUI(library);
UI.updateLibrary();