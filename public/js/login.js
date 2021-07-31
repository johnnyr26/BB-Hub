function onSignIn(googleUser) {
    const email = googleUser.getBasicProfile().getEmail();
    const id_token = googleUser.getAuthResponse().id_token;
    if (email.slice(-15) !== '@blindbrook.org') {
        return signOut('Only Blind Brook emails are allowed to sign into this platform.');
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token })
    })
    .then(response => response.json())
    .then(response => {
        if (response.error) {
            throw response.error;
        }
        if (response.newUser){
            return location.href = '/?newuser=true';
        }
        location.href = '/';
    })
    .catch((error) => {
      console.log(error);
      signOut(error);
    });
}
function signOut(error) {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.getElementById('error').innerHTML = error;
    });
}
window.onload = () => console.log('hi');