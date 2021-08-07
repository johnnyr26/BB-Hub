document.querySelector('.submit-post-button').addEventListener('click', () => {
    const title = document.querySelector('.posts-title-textfield').value.trim();
    const message = document.querySelector('.posts-message-textarea').value.trim();
    const img = document.querySelector('#image-upload');

    document.querySelector('.error-message').classList.add('invisible');

    if (!title || !message) {
        document.querySelector('.error-message').classList.remove('invisible');
        if (!title) {
            document.querySelector('.error-message').textContent = 'The announcement needs a title';
            return;
        }
        if (!message) {
            document.querySelector('.error-message').textContent = 'The announcement needs a message';
            return;
        }
    }

    const formData = new FormData();
    
    formData.append('title', title);
    formData.append('message', message);
    formData.append('img', img.files[0]);
    fetch(`/announcements`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        if (response.error) {
            throw new Error(response.error);
        }
        location.href = '/announcements';
    }).catch(error => {
        document.querySelector('.error-message').classList.remove('invisible');
        document.querySelector('.error-message').textContent = 'The post that you tried to submit has the same title. Please try a different title';
    })
});

document.querySelector('#image-upload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            document.querySelector('.posts-image-upload-div').src = e.target.result;
            document.querySelector('.posts-image-upload-div').height = 'auto';
        };

        document.querySelector('.posts-image-upload-div').classList.remove('invisible');

        reader.readAsDataURL(this.files[0]);
    }
})

document.querySelector('.create-new-post-button').addEventListener('click', () => {
    document.querySelector('.create-new-post-button').classList.add('invisible');
    document.querySelector('.new-posts-div').classList.remove('invisible');
});
document.querySelector('body').addEventListener('click', e => {
    if (e.target === document.querySelector('.profile-menu-selection')) {
        e.stopPropagation();
        return;
    }
    if (!document.querySelector('.profile-menu-selection').classList.contains('invisible')) {
        document.querySelector('.profile-menu-selection').classList.add('invisible');
    }
});