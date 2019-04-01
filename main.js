var db = firebase.firestore();

//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});
var data = [];

const postTemplate = "<div id=post>";
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


function updateUI() {

    for(var i=0;i<data.length;i++)
    {
        var ih=postTemplate+data[i].html+"</div>";
        console.log(ih);
        var neww=$(ih);
        neww.appendTo("#holder");

    }
}

function fetchData() {
    db.collection("new").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log("fetched succesfully");
            data.push(doc.data());
        });
        updateUI();
    });

    
}


function postData() {
    var markupStr = $('#summernote').summernote('code');
    console.log(markupStr);
    db.collection("new").add({ html: markupStr, time: firebase.firestore.FieldValue.serverTimestamp() }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
    });
}