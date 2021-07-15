document.querySelector('#submit').addEventListener('click', () => {
    const title = document.querySelector('#title');
    const message = document.querySelector('#message');
    const img = document.querySelector('#img');

    const formData = new FormData();
    
    formData.append('title', title.value);
    formData.append('message', message.value);
    formData.append('img', img.files[0]);

    fetch(`/posts`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        if (response.error) {
            throw new Error(response.error);
        }
        const { user, title: titleResponse, message: messageResponse, image } = response;
        console.log(image);
        const htmlPost = `
            <hr>
            <h1>${titleResponse}</h1>
            <p>${user}</p>
            <p>${messageResponse}</p>
            <hr>
        `;
        document.querySelector('#posts').innerHTML += htmlPost;
        title.value = '';
        message.value = '';
    })
    .catch(error => {});
});