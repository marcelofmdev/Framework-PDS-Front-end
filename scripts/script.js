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


function renderPost(post) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('feed-item');
    postId = '<p class="italic">#' + post.id + '</p>';
    postImg = '<img src="' + post.imageUrl + '" width="20%" height="20%">';
    postContent = '<div class="content">' + post.content + '</div>';
    postUser = '<p class="italic">por ' + post.user.name + '<p>';

    postTags = '<p class="italic">' + tagsToString(post.tags) + '</p>';

    postDiv.innerHTML = postId + postImg + postContent + postUser + postTags;
    document.querySelector('.feed-container').appendChild(postDiv);
}


function renderResource(resource) {
    const resourceDiv = document.createElement('div');
    resourceDiv.classList.add('feed-item');
    resourceId = '<p class="italic">#' + resource.id + '</p>';
    resourceLogo = '<div class="item-logo"><img src="' + resource.logo + '" width="20%" height="20%" class="item-logo"></div>';
    resourceName = '<h2>' + resource.name + '</h2>';
    resourceDescription = '<p>' + resource.description + '</p>';
    resourceDiv.innerHTML = resourceId + resourceLogo + resourceName + resourceDescription;
    document.querySelector('.feed-container').appendChild(resourceDiv);
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
        const postRequest = fetch('http://localhost:8080/api/recommendation/' + userIdQuery);
        postRequest.then(response => response.json())
        .then(postJson => {
            for(let post of postJson) {
                console.log(post);
                renderPost(post);
            }
        }).catch(error => {
            console.log(error);
            return;
        });
    }
}

renderPage();
