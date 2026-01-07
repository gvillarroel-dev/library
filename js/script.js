const myLibrary = [];

const libraryContainer = document.querySelector("#library-container");
const booksCounter = document.querySelector(".books-counter");
const alreadyReadBooks = document.querySelector(".already-read-books");
const pendingBooksCounter = document.querySelector(".pending-books-counter");
const totalPagesRead = document.querySelector(".total-pages-already-read");
const bookForm = document.querySelector("#bookForm");

const openModal = document.querySelector("#addBookBtn");
const cancelModal = document.querySelector("#cancelModal");
const modal = document.querySelector(".modal-overlay");

let emptyStateElement = null;

// ========= book constructor =========
function Book(title, author, numberOfPages, read) {
	if (!new.target) {
		throw Error("Must use the new operator to call the constructor");
	}

	this.id = crypto.randomUUID();
	this.title = title;
	this.author = author;
	this.numberOfPages = numberOfPages;
	this.read = read || false;
}

Book.prototype.toggleRead = function () {
	this.read = !this.read;
};

// ========= library functions =========

function addBookToLibrary() {
	const title = document.querySelector("#bookTitle").value.trim();
	const author = document.querySelector("#bookAuthor").value.trim();
	const numberOfPages = parseInt(document.querySelector("#bookPages").value);
	const read = document.querySelector("#bookRead").checked;

	if (!title || !author || isNaN(numberOfPages) || numberOfPages <= 0) {
		alert("Please fill all fields correctly");
		return false;
	}

	const newBook = new Book(title, author, numberOfPages, read);
	myLibrary.push(newBook);
	updateLibrary();
	bookForm.reset();

	return true;
}

function removeBook(bookId) {
	const indexBook = myLibrary.findIndex((book) => book.id === bookId);
	if (indexBook !== -1) {
		myLibrary.splice(indexBook, 1);
		updateLibrary();
	}
}

function toggleBookRead(bookId) {
	const book = myLibrary.find((book) => book.id === bookId);
	if (book) {
		book.toggleRead();
		updateLibrary();
	}
}

function updateStats() {
	const totalBooks = myLibrary.length;
	const readBooks = myLibrary.filter((book) => book.read).length;
	const pendingBooks = totalBooks - readBooks;
	const pagesRead = myLibrary
		.filter((book) => book.read)
		.reduce((sum, book) => sum + Number(book.numberOfPages), 0);

	booksCounter.textContent = totalBooks;
	alreadyReadBooks.textContent = readBooks;
	pendingBooksCounter.textContent = pendingBooks;
	totalPagesRead.textContent = pagesRead;
}

// ========= construction of card-book elements =========
function createBookCard(book) {
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
	readBtn.addEventListener("click", () => toggleBookRead(book.id));

	const removeBtn = document.createElement("button");
	removeBtn.className = "btn-remove";
	removeBtn.textContent = "Remove";
	removeBtn.addEventListener("click", () => removeBook(book.id));

	actionsContainer.appendChild(readBtn);
	actionsContainer.appendChild(removeBtn);

	cardBook.appendChild(bookTitle);
	cardBook.appendChild(bookAuthor);
	cardBook.appendChild(bookPages);
	cardBook.appendChild(actionsContainer);

	return cardBook;
}

function createEmptyState() {
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
	libraryContainer.appendChild(emptyState);

	return emptyState;
}

function updateLibrary() {
	libraryContainer.innerHTML = "";

	if (myLibrary.length === 0) {
		if (!emptyStateElement) {
			emptyStateElement = createEmptyState();
		}
		libraryContainer.appendChild(emptyStateElement);
	} else {
		myLibrary.forEach((book) => {
			const bookCard = createBookCard(book);
			libraryContainer.appendChild(bookCard);
		});
	}

	updateStats();
}

// =========== eventListeners ===========
openModal.addEventListener("click", () => {
	modal.style.display = "flex";
});

cancelModal.addEventListener("click", () => {
	modal.style.display = "none";
	bookForm.reset();
});

bookForm.addEventListener("submit", (e) => {
	e.preventDefault();

	if (addBookToLibrary()) {
		modal.style.display = "none";
	}
});

modal.addEventListener("click", (e) => {
	if (e.target === modal) {
		modal.style.display = "none";
		bookForm.reset();
	}
});

updateLibrary();
