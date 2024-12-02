//vars
var bookmarkNameInput = document.querySelector('#bookmarkNameInput');
var WebsiteUrlInput = document.querySelector('#WebsiteUrlInput');
var submitBtn = document.querySelector('#submitBtn');
var searchInput = document.querySelector('#searchInput');
var tableContent = document.querySelector('#tableContent');
var bookmarksArray;
var mode;
var rowID;
var namesArray;

if (localStorage.length > 0) {
    bookmarksArray = JSON.parse(localStorage.getItem('Bookmarks Array'));
} else {
    bookmarksArray = [];
}

//Create

function create() {
    var bookmark = {
        index: bookmarksArray.length,
        name: bookmarkNameInput.value,
        url: WebsiteUrlInput.value
    }
    bookmarksArray.push(bookmark);
    localStorage.setItem('Bookmarks Array', JSON.stringify(bookmarksArray));
    reorder();
}

//Read

function read() {
    tableContent.innerHTML = ``;
    for (var i = 0; i < bookmarksArray.length; i++) {
        tableContent.innerHTML += `
        <tr class="rows">
          <td class="indexes" scope="row" id="bookmarkNumber${bookmarksArray[i].index}">${bookmarksArray[i].index + 1}</td>
          <td id="bookmarkName${bookmarksArray[i].index}">${bookmarksArray[i].name}</td>
          <td><a href='https://www.${bookmarksArray[i].url}'  target="_blank"><button type="button" class="btn btn-success"><i class="fa-solid fa-eye fa-fw"></i> Visit</button></a></td>
          <td><button type="button" class="btn btn-danger" onclick="deleteFunc(bookmarkNumber${bookmarksArray[i].index})"><i class="fa-solid fa-trash fa-fw"></i> Delete</button></td>
          <td><button type="button" class="btn btn-info" onclick="edit(bookmarkNumber${bookmarksArray[i].index})"><i class="fa-solid fa-rotate fa-fw"></i> Update</button></td>
        </tr>
        `;
        reorder();
        createArray();
    }

}
read();

//Update

function edit(indexCell) {

    if (mode != 'updating') {
        mode = 'updating';
        rowID = indexCell.innerHTML - 1;
        var currentRow = document.querySelectorAll('.rows')[rowID];
        currentRow.style.visibility = 'hidden';
        bookmarkNameInput.value = bookmarksArray[rowID].name;
        WebsiteUrlInput.value = bookmarksArray[rowID].url;
        reorder();
        createArray();
    } else {
        alert('Please finish editing the current bookmark first.');
    }
}

function update() {
    mode = 'idle';
    bookmarksArray[rowID].name = bookmarkNameInput.value;
    bookmarksArray[rowID].url = WebsiteUrlInput.value;
    localStorage.setItem('Bookmarks Array', JSON.stringify(bookmarksArray));
    reorder();
    createArray();
}

//Delete

function deleteFunc(indexCell) {
    if (mode != 'updating') {
        bookmarksArray.splice(indexCell.innerHTML - 1, 1);
        localStorage.setItem('Bookmarks Array', JSON.stringify(bookmarksArray));
        read();
        reorder();
        createArray();
    } else {
        alert('Please finish editing the current bookmark first.');
    }
}


//Search

var searchTerm;
searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.toLowerCase();
    createArray();
    for (i = 0; i < namesArray.length; i++) {
        namesArray[i].parentElement.style.display = 'none';
        if (namesArray[i].innerHTML.toLowerCase().includes(searchTerm)) {
            namesArray[i].parentElement.style.display = 'table-row';
        }
    }
})

//helpers

function reorder() {
    var temp = JSON.parse(localStorage.getItem('Bookmarks Array'));
    for (var i = 0; i < temp.length; i++) {
        temp[i].index = i;
    }
    localStorage.setItem('Bookmarks Array', JSON.stringify(temp));
    var indexes = document.querySelectorAll('.indexes');
    for (var i = 0; i < indexes.length; i++) {
        indexes[i].innerText = i + 1;
    }
}

function createArray() {
    namesArray = [];
    for (var i = 0; i < bookmarksArray.length; i++) {
        namesArray.push(document.querySelector(`#bookmarkName${i}`))
    }
}
createArray();

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

//other

submitBtn.addEventListener("mousedown", function () {
    submitBtn.style.background = 'white';
    submitBtn.style.color = 'black';
    submitBtn.style.border = '1px solid black';
});
submitBtn.addEventListener("mouseup", function () {
    submitBtn.style.background = 'rgb(209, 81, 45)';
    submitBtn.style.color = 'white';
    submitBtn.style.border = '1px solid transparent';
    if (isValidURL(WebsiteUrlInput.value)) {
        if (mode === 'updating') {
            update();
        } else {
            create();
        }
        reorder();
        read();
        createArray();
        bookmarkNameInput.value = null;
        WebsiteUrlInput.value = null;
    } else {
        alert('Please enter a valid URL')
    }

});

