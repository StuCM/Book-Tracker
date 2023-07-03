let myLibrary = [];

function Book(title, author, genre, pages, rating, read) {
    this.title = title,
    this.author = author,
    this.genre = genre,
    this.pages = pages,
    this.rating = rating,
    this.read = read;
}

function addBookToLibrary(book) {
    alreadyAdded = myLibrary.forEach(entry => entry.name === book.name);
    if(!alreadyAdded) {
        myLibrary.push(book);
    }
    else{ console.log("This book has already been added") };
    
}

function addBookModal() {
    const modal = document.getElementById("addBook");
    console.log("model", modal)
    modal.classList.remove("hidden");
    modal.classList.add("add-book");
}