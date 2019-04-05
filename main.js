var db = firebase.firestore();

//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

const postTemplate = "<div class='post-holder card-panel'>";
const commentTemplate = "<div class='comment-container row valign-wrapper'>" + "<img src='user-placeholder.png' class='comment-user-pic col s2 m1'>"
    + "<div class='col s10 m11'>" +
    "<div class='comment-content'>";
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

function updateuI(doc) {
    console.log("idhar pahuncha");
    var data = doc.data();
    var postt = document.getElementById(doc.id);
    if (!postt) {
        // postt = document.createElement('div');
        // postt.setAttribute('class', 'post-holder card-panel');
        // console.log("idhar pahuncha");
        // var ih = "<div>" + data.html + "</div>";
        // //Shi krliyo apne hisab se
        // ch = "<div><h5>Comments</h5>"
        // for (var i = 0; i < data.comments.length; i++)ch = ch + commentTemplate + data.comments[i] + "</div></div></div>";          //comments ki list
        // ch = ch + "</div>";

        // var mainpost = $(ih);
        // console.log(doc.id);
        // var comment = $(ch);
        // var button = $("<button class='btn-small'>Add comments</button>");



        // mainpost.appendTo(postt);              //holder pe bhi css laga de(holde ke andar post,comment aur button hai)
        // comment.appendTo(postt);
        // button.appendTo(postt);
        postt = createPostElement(data, doc.id);
        document.getElementById("holder").appendChild(postt);



        //  button.addEventListener("click", addcomment.bind(null, button, doc.id));
    }



}

function fetchData() {
    db.collection("new").orderBy('time', 'desc').limit(10).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log("fetched succesfully");
            updateuI(doc);
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

function createPostElement(data, docid) {
    var postElement = document.createElement('div');
    postElement.id = docid;
    postElement.innerHTML = '<div class="post-holder card-panel"> <div class="post-header"> <img src="user-placeholder.png" class="user-pic poster-pic"> <div class="poster-name">John Doe</div> <div class="grey-text smaller-text to-right post-time">Jan 1, 2077</div> </div> <div class="post-content"> </div> <h4>Comments</h4> <div class="post-comments"> </div> <div class="row valign-wrapper"> <div class="input-field col s10 m11"> <textarea id="textarea1" class="materialize-textarea"></textarea> <label for="textarea1">Write a comment</label> </div> <a class="col s2 m1 waves-effect waves-light btn yellow darken-3"><i class="material-icons">send</i></a> </div> </div>';
    postElement.querySelector('.post-content').innerHTML = data.html;
    var date=data.time.toDate();
//    var fdate= date.substring(0,date.indexOf('G'));
    postElement.querySelector('.post-time').textContent = data.time.toDate().toDateString();
    
    // TODO: add posters name and pic

    var commentHTML = '';
    data.comments.forEach(comment => {
        commentHTML += '<div class="comment-container row valign-wrapper"> <img src="user-placeholder.png" class="user-pic col s2 m1"> <div class="col s10 m11"> <div class="comment-content">' + comment + '</div> </div> </div>';
        // TODO: Add commenters pic
    });
    postElement.querySelector('.post-comments').innerHTML = commentHTML;
    return postElement;
}