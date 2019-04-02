var db = firebase.firestore();

//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

const postTemplate = "<div class='post-holder card-panel'>";
fetchData();

// firebase.initializeApp({
//     apiKey: 'AIzaSyDohZMBbT1TVeDf-zu1B0S3tMXvxbgiL94',
//     authDomain: 'aviral-vlogs.firebaseapp.com',
//     projectId: 'aviral-vlogs'
// });

$(document).ready(function () {
    $('#summernote').summernote();
});

function post(ih, ts) {
    this.ih;
    this.ts = ts;
}

function updateUI(doc) {
    var data = doc.data();
    var ih = postTemplate + data.html + "</div>";
    var ch = "<div class=commentholder>";         //Shi krliyo apne hisab se

    for (var i = 0; i < data.comments.length; i++)ch = ch + data.comments[i];          //comments ki list
    ch = ch + "</div>";
    console.log(ih);
    var mainpost = $(ih);
    console.log(doc.id);
    var comment = $(ch);
    var button = $("<button class='btn-small'>Add comments</button>");


    mainpost.appendTo("#holder");              //holder pe bhi css laga de(holde ke andar post,comment aur button hai)
    comment.appendTo("#holder");
    button.appendTo("#holder");
    button.addEventListener("click", addcomment.bind(null, button, doc.id));
}

function fetchData() {
    db.collection("new").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log("fetched succesfully");
            updateUI(doc);
        });
    });
}

function postData() {
    var markupStr = $('#summernote').summernote('code');
    console.log(markupStr);
    db.collection("new").add({
        html: markupStr, time: firebase.firestore.FieldValue.serverTimestamp(), comments:
            ["hello", "buffalo"]
    }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
    });
}

function addcomment(evt, id) {
    db.collection("new").doc(id).update({ comments: firebase.firestore.FieldValue.arrayUnion("kutta") });
}