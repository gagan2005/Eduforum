var userPicElement = document.querySelector('.user-icon');
var userPicSidenavElement = document.querySelector('.user-pic-sidenav');
var displayNameElement = document.querySelector('.display-name');
var hideOnLogOutElements = document.querySelectorAll('.hide-on-log-out');
var hideOnLogInElements = document.querySelectorAll('.hide-on-log-in');
var username = null;
var profilePicUrl = null;


document.getElementById('sign-out').addEventListener('click', signOut);


function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url, size) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=' + size;
    }
    return url;
}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.
        profilePicUrl = getProfilePicUrl();
        username = getUserName();

        // Set the user's profile pic and name.
        displayNameElement.textContent = user.displayName;
        userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl, 150);
        userPicSidenavElement.src = addSizeToGoogleProfilePic(profilePicUrl, 150);

        // Show user's profile and sign-out  and edit buttons.
        userPicElement.classList.remove('hide');
        userPicSidenavElement.style.visibility = 'visible';

        hideOnLogOutElements.forEach(element => {
            element.classList.remove('hide');
        });

        // Hide sign-in button.
        hideOnLogInElements.forEach(element => {
            element.classList.add('hide');
        });
        let addButton = document.getElementById('add-btn');
        if (user.email == 'aviralfirebase@gmail.com' && addButton)
            addButton.classList.remove('hide');
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        userPicElement.classList.add('hide');
        userPicSidenavElement.style.visibility = 'hidden';

        displayNameElement.textContent = '';

        // hideOnLogOutElements[0].classList.add('hide');
        // hideOnLogOutElements[1].classList.add('hide');
        hideOnLogOutElements.forEach(element => {
            element.classList.add('hide');
        });

        // Show sign-in button.
        hideOnLogInElements.forEach(element => {
            element.classList.remove('hide');
        });
    }
}

// Initiate Firebase Auth.
function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

initFirebaseAuth();