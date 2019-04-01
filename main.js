var db = firebase.firestore();

//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

const postTemplate = "<div id=post>";


// firebase.initializeApp({
//     apiKey: 'AIzaSyDohZMBbT1TVeDf-zu1B0S3tMXvxbgiL94',
//     authDomain: 'aviral-vlogs.firebaseapp.com',
//     projectId: 'aviral-vlogs'
// });


$(document).ready(function () {
    $('#summernote').summernote();
});

var data = [];


function post(ih, ts) {
    this.ih;
    this.ts = ts;

}


function updateUI() {

}

function fetchData() {
    db.collection("adminposts").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

            data.push(doc.data());
        });
    });
}


function postData() {
    var markupStr = $('#summernote').summernote('code');
    console.log(markupStr);
    db.collection("new").add({ html: markupStr, time: firebase.firestore.FieldValue.serverTimestamp() }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
    });
}