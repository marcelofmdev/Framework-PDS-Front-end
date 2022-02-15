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


function renderResource(resource) {
    const resourceDiv = document.createElement('div');
    resourceDiv.classList.add('feed-item');
    resourceId = '<p class="italic">#' + resource.id + '</p>';
    resourceLogo = '<div class="item-logo"><img src="' + resource.logo + '" width="20%" height="20%" class="item-logo"></div>';
    resourceName = '<h2>' + resource.name + '</h2>';
    resourceDescription = '<p>' + resource.description + '</p>';

    resourceDistance = '<p>' + resource.distance.toFixed(0) + 'Km</p>';

    resourceTags = '<p class="italic">' + tagsToString(resource.tags) + '</p>';

    resourceDiv.innerHTML = resourceId + resourceLogo + resourceName + resourceDescription + resourceDistance + resourceTags;

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
        const hotelRequest = fetch('http://localhost:8080/api/recommendation/hotel/' + userIdQuery);
        hotelRequest.then(response => response.json())
        .then(hotelJson => {
            for(let hotel of hotelJson) {
                console.log(hotel);
                renderResource(hotel);
            }
        }).catch(error => {
            console.log(error);
            return;
        });
    }
}

renderPage();
