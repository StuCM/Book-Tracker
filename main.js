let myLibrary = [];

function Book(title, author, published, pages, rating, read) {
    this.title = title,
    this.author = author,
    this.published = published,
    this.pages = pages,
    this.rating = rating,
    this.read = read;
}

async function addBookToLibrary() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    let rating = document.getElementsByName('stars');
    for(let star of rating) {
        if(star.checked) rating = star.value;
    }
    let bookData = await getBookData(title, author);
    console.log("book data", bookData)
    let newBook = new Book(
        bookData.title, 
        bookData.author_name[0], 
        bookData.publish_date[0], 
        bookData.number_of_pages_median,
        rating,
        false
        )
    console.log(bookData)
    getBookCover(bookData.cover_i)
    let alreadyAdded = myLibrary.some(entry => entry.title === newBook.title && entry.author === newBook.author);
    console.log(alreadyAdded)
    if(!alreadyAdded) {
        myLibrary.push(newBook);
        console.log(myLibrary)
        this.toggleBookModal();
    }
    else{ console.log("This book has already been added") };
}

async function getBookCover(id){
    let response = await fetch("https://covers.openlibrary.org/b/id/" + id + "-M.jpg");
    let cover = document.getElementById("cover")
    cover.setAttribute("src", response.url);

    console.log(response, response.url)
}

async function getBookData(title, author) {
    title = title.replace(" ", "+")
    author = author.replace(" ", "+")
    let response = await fetch("https://openlibrary.org/search.json?title=" + title + "&author=" + author + "&limit=5&offset=0");
    let bookData = await response.json();
    let firstBook = bookData.docs[0]

    return firstBook
}

function toggleBookModal() {
    const modal = document.getElementById("addBook");
        modal.classList.toggle("hidden");
        modal.classList.toggle("add-book");
}