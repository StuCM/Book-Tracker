let myLibrary = [];
let totalBooks = 0;
let booksRead = 0;

function Book(title, author, published, pages, rating, read, cover) {
    this.title = title,
    this.author = author,
    this.published = published,
    this.pages = pages,
    this.rating = rating,
    this.read = read;
    this.cover = cover;
}

async function addBookToLibrary() {
    //get input data
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    let rating = document.getElementsByName('stars');
    for(let star of rating) {
        if(star.checked) rating = star.value;
    }
    let read = document.getElementById("read").checked
    console.log(rating)

    //query API
    let bookData = await getBookData(title.value, author.value);
    if(!bookData){
        showErrorMessage();
        return;
    }
    let bookCover = await getBookCover(bookData.cover_i)
    let newBook = new Book(
        bookData.title, 
        bookData.author_name[0], 
        bookData.publish_date[0], 
        bookData.number_of_pages_median,
        rating,
        read,
        bookCover
        )

    //add to library
    let alreadyAdded = myLibrary.some(entry => entry.title === newBook.title && entry.author === newBook.author);
    if(!alreadyAdded) {
        myLibrary.push(newBook);
        totalBooks++
        console.log(this.totalBooks)
        if(newBook.read) booksRead++;
        this.updateTotalBooks();
        let index = myLibrary.indexOf(newBook);
        addBookToGrid(index);
        console.log(myLibrary)
        this.toggleAddModal();
        title.value = "";
        author.value = "";
        rating = 3;
    }
    else { 
        let errors = document.querySelector(".errors")
        errors.textContent = "This book has already been added";
        errors.classList.add("active");
        let addBook = document.getElementById("addBook");
        addBook.classList.add("auto-height");
     };
}

function updateTotalBooks() {
    const total = document.querySelector("#total");
    const read = document.querySelector("#booksRead");
    const unread = document.querySelector("#unread");

    console.log(this.totalBooks, this.booksRead)
    total.textContent = totalBooks;
    read.textContent = booksRead;
    unread.textContent = totalBooks- booksRead;
}

function showErrorMessage() {
    const errors = document.querySelector(".errors");
    errors.textContent = "This book does not exist";
    errors.classList.add("active");
    const panel = document.getElementById("addBook");
    panel.classList.add("auto-height");
}

function addBookToGrid(index) {
    const temp = document.getElementsByTagName('template')[0];
    const bookTemp = temp.content.querySelector('div');
    const clonedTemplate = document.importNode(bookTemp, true);
    clonedTemplate.querySelector('img').id = index;
    clonedTemplate.addEventListener("click", () => {
        toggleBookModal(index);
    });

    const coverImg = clonedTemplate.querySelector('img')
    coverImg.id = index + "-cover";
    const book = myLibrary[index];

    coverImg.src = book.cover;
    coverImg.alt = book.title;

    const bookshelf = document.getElementById("bookshelf");
    bookshelf.appendChild(clonedTemplate);


}

//Book Info Api

async function getBookCover(id){
    let response = await fetch("https://covers.openlibrary.org/b/id/" + id + "-M.jpg");
    return response.url;
}

async function getBookData(title, author) {
    title = title.replace(" ", "+")
    let query = "https://openlibrary.org/search.json?title=" + title;
    if(author) {
        author = author.replace(" ", "+")
        query += "&author=" + author;
    }
    query += "&limit=1&offset=0";
    console.log(query)
    const response = await fetch(query);
    console.log(response)
    let bookData = await response.json();
    let firstBook = bookData.docs[0]

    return firstBook
}

//Page Control

function toggleAddModal() {
    const form = document.getElementById("formInput")
    form.reset(); 
    const modal = document.getElementById("addBook");
    modal.classList.toggle("active");
    modal.classList.remove("auto-height");
    form.classList.toggle("active");
    const errors = document.querySelector(".errors");
    if(errors.classList.contains("active")) {
        errors.classList.toggle("active");
    }
}

function toggleBookModal(index) {
    const book = myLibrary[index];
    const bookModal = document.getElementById("modal");
    const title =  document.getElementById("modalTitle");
    const author = document.getElementById("modalAuthor");
    const pages = document.getElementById("modalPages");
    const published = document.getElementById("modalPublish");
    const cover = document.getElementById("modalImg");
    const read = document.getElementById("modalRead")
    let rating = document.getElementsByName('modalStars');
    for(let star of rating) {
        if(star.value === book.rating) star.checked = true;
    }
    bookModal.style.display = "block";

    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = book.pages;
    published.textContent = book.published;
    cover.src = book.cover;
    read.checked = book.read;
    
    read.addEventListener("change", () => book.read = read.checked);
    
    document.querySelector(".delete-button").addEventListener("click", () => deleteBook(index));
    
    window.onclick = (event) => {
        if(event.target == bookModal) {
            bookModal.style.display = "none";
        }
    }
}

function deleteBook(index) {
    const gridBook = document.getElementById(index + "-cover").parentNode;
    const bookModal = document.getElementById("modal");
    gridBook.remove();
    bookModal.style.display = "none";
    myLibrary.splice(index, 1);
}