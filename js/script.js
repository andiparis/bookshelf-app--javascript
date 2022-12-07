const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT = 'render-book';
const books = [];

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }

  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() { 
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.getElementById('inputBookIsComplete').addEventListener('change', function() {
  const statusOfBook = document.getElementById('inputBookIsComplete');
  const statusOfBookText = document.getElementById('bookStatus');
  if (statusOfBook.checked == true) {
    statusOfBookText.innerText = 'Selesai dibaca';
  } else {
    statusOfBookText.innerText = 'Belum selesai dibaca';
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function clearInputForm() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('year').value = '';
}

function addBook() {
  const textTitle = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const textYear = document.getElementById('year').value;
  const statusOfBook = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateTodoObject(generatedID, textTitle, textAuthor, textYear, statusOfBook);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  clearInputForm();
}

function makeBookInfo(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;
  const textDetail = document.createElement('p');
  textDetail.innerHTML = 'Penulis: ' + bookObject.author + '<br>Tahun: ' + bookObject.year;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textDetail);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
    
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);
    });
    container.append(checkButton, trashButton);
  }
 
  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('uncompletedBookInfo');
  uncompletedBookList.innerHTML = '';
  const completedBookList = document.getElementById('completedBookInfo');
  completedBookList.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = makeBookInfo(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}