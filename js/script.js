const myLibrary = [];

const libraryContainer = document.querySelector("#library-container");
const booksCounter = document.querySelector(".books-counter");
const alreadyReadBooks = document.querySelector(".already-read-books");
const pendingBooksCounter = document.querySelector(".pending-books-counter");
const totalPagesRead = document.querySelector(".total-pages-already-read");

// Book constructor -
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

// método que cambia el estado de lectura del libro
Book.prototype.toggleRead = function () {
	this.read = !this.read;
};

function addBookToLibrary(title, author, numberOfPages, read) {
	const newBook = new Book(title, author, numberOfPages, read);
	myLibrary.push(newBook);

	return `The book has been added successfully`;
}

function removeBook(bookId) {
	const indexBook = myLibrary.findIndex((book) => book.id === bookId);
	if (indexBook !== -1) {
		myLibrary.splice(indexBook, 1);
	}
}

// ========= construcción de elementos =========
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

// testing

console.log(addBookToLibrary("Wolfsong", "T.J. Klune", 528, true));
console.log(addBookToLibrary("Ravensong", "T.J. Klune", 480, true));
console.log(addBookToLibrary("Heartsong", "T.J. Klune", 512, false));
console.log(addBookToLibrary("Brothersong", "T.J. Klune", 496, false));

// Renderizar las tarjetas
myLibrary.forEach((book) => {
	libraryContainer.appendChild(createBookCard(book));
});

console.log(myLibrary);
