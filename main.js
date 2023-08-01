let myLibrary = [];

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
    let read = document.getElementById("read")

    //query API
    let bookData = await getBookData(title.value, author.value);
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
    console.log(alreadyAdded)
    if(!alreadyAdded) {
        myLibrary.push(newBook);
        let index = myLibrary.indexOf(newBook);
        addBookToGrid(index);
        console.log(myLibrary)
        this.toggleBookModal();
        title.value = "";
        author.value = "";
        rating = 3;
    }
    else{ console.log("This book has already been added") };
}

function addBookToGrid(index) {
    const temp = document.getElementsByTagName('template')[0];
    const bookTemp = temp.content.querySelector('div');
    const clonedTemplate = document.importNode(bookTemp, true);
    console.log(clonedTemplate)
    const bookCoverTemp = clonedTemplate.querySelector('#cover');
    const book = myLibrary[index];
    bookCoverTemp.src = book.cover;
    bookCoverTemp.alt = book.title;

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
        query += author;
    }
    query += "&limit=1&offset=0";
    const response = await fetch(query);
    let bookData = await response.json();
    let firstBook = bookData.docs[0]

    return firstBook
}

//Page Control

function toggleBookModal() {
    const modal = document.getElementById("addBook");
    modal.classList.toggle("active");
    const form = document.getElementById("formInput")
    form.classList.toggle("active")
}