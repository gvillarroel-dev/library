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

// ========= functions of library =========
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

console.log(addBookToLibrary("Songwolf", "T.J. Klune", 528, true));
console.log(addBookToLibrary("Ravensong", "T.J. Klune", 528, true));
console.log(addBookToLibrary("Hearthsong", "T.J. Klune", 512, true));
console.log(addBookToLibrary("Brothersong", "T.J. Klune", 496, true));

console.log(myLibrary);
