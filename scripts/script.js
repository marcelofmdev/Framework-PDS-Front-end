function renderErrorPage() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('error-div');
    messageDiv.innerHTML = '<h1>Ops! Não foi possível acessar essa página.</h1>';
    document.querySelector('.heading').appendChild(messageDiv);
}


function renderUserProfile(user) {
    const usernameField = document.querySelector('.username-field');
    usernameField.innerHTML = user.userName;
}


function renderUlTags(tags) {
    const tagsContainer = document.querySelector('.tags-container');
    const tagsUl = document.createElement('ul');
    for(let tag of tags) {
        const tagLi = document.createElement('li')
        tagLi.innerHTML = tag.name;
        tagsUl.appendChild(tagLi);
    }
    tagsContainer.appendChild(tagsUl);
}


function tagsToString(tags) {
    let tagsString = 'Tags: ';

    let tag = tags.entries();
    let current = tag.next();
    while(current.value) {

        tagsString += current.value[1].name;

        current = tag.next();
        if(!current.done) {
            tagsString += ', ';
        }
    }

    return tagsString;
}


function renderBook(book) {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('feed-item');
    bookId = '<p class="italic">#' + book.id + '</p>';
    bookImg = '<img src="' + book.imageUrl + '" width="20%" height="20%">';
    bookContent = '<div class="content">' + book.content + '</div>';

    bookLikes = '<p>Likes: ' + book.likes + '</p>';

    bookTags = '<p class="italic">' + tagsToString(book.tags) + '</p>';

    bookDiv.innerHTML = bookId + bookImg + bookContent + bookUser + bookTags;
    document.querySelector('.feed-container').appendChild(bookDiv);
}


function renderPage() {
    let hasErrors = false;

    const urlQuery = new URLSearchParams(location.search);
    const userIdQuery = urlQuery.get('user');
    console.log(userIdQuery);

    if(userIdQuery == null) {
        renderErrorPage();
        return;
    }

    const userRequest = fetch('http://localhost:8080/api/user/' + userIdQuery);
    userRequest.then(response => response.json())
    .then(userJson => {
        if(userJson['statusCode']) {
            console.log(userJson['statusCode']);
            hasErrors = true;
            throw Error;
        }

        renderUserProfile(userJson);
        renderUlTags(userJson.tags);
    })
    .catch(error => {
        hasErrors = true;
        console.log(error);
        renderErrorPage();
        return;
    });

    if(!hasErrors) {
        const bookRequest = fetch('http://localhost:8080/api/recommendation/' + userIdQuery);
        bookRequest.then(response => response.json())
        .then(bookJson => {
            for(let book of bookJson) {
                console.log(book);
                renderBook(book);
            }
        }).catch(error => {
            console.log(error);
            return;
        });
    }
}

renderPage();
