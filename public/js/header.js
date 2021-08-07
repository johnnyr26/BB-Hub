document.querySelector('#menu-icon').addEventListener('click', () => {
    if (document.querySelector('#header').classList.contains('clicked')) {
        document.querySelector('#header').classList.remove('clicked');
    } else {
        document.querySelector('#header').classList.add('clicked');
    }
});

document.querySelector('.profile-image').addEventListener('click', () => {
    document.querySelector('.profile-menu-selection').classList.remove('invisible');
});
document.querySelector('#header').addEventListener('click', e => {
    if (e.target !== document.querySelector('#header')) {
        e.stopPropagation();
        return;
    }
    document.querySelector('.profile-menu-selection').classList.add('invisible');
});