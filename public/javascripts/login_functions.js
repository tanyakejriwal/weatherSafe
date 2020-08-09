function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var data = {id_token};
    var options = {
        method :'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
    };
    fetch("http://localhost:8080/users", options)
    .then(response =>
    {
        if (response.redirected)
        {
            window.location.href = response.url;
        }
        else {
            console.log('error');
        }
    });
}


function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}

function changePref(){
    window.location.href = "http://localhost:8080/users/preference";
}
   
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        fetch("http://localhost:8080/users/signout")
        .then(response => {
            if(response.redirected) window.location.href = response.url;
            else console.log("error");
        });
    });
}