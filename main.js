var db = firebase.firestore();
var storage = firebase.storage();
var lastdoc=null;
var holder=null;


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
    holder=$("#holder");
});


    function showSummernote()
{
    $(document).ready(function () {
        $('#summernote').summernote();
        
    });
console.log("showing/...");
    $("#post").show();

    
    


    
    
}

function post(ih, ts) {
    this.ih;
    this.ts = ts;
}

$('#summernote').summernote({
    callbacks: {


        onImageUpload: function (files, editor, welEditable) {
            sendFile(files[0], editor, welEditable);
        }
    }
});

function sendFile(files, editor, welEditable) {
    // upload image to server and create imgNode...
    console.log("Uploadeing image to storage..");
    $("upimg").show();
    var filePath = "test" + '/' + files.name;
    storage.ref(filePath).put(files).then(function (fileSnapshot) {
        // 3 - Generate a public URL for the file.
        return fileSnapshot.ref.getDownloadURL().then((url) => {
            console.log(url);
            // 4 - Update the chat message placeholder with the image’s URL.

            // $('#summernote').summernote('insertImage', url,'kutta');

            $('#summernote').summernote('insertImage', url, function ($image) {

                $image.attr('class', 'responsive-img');
                $("upimg").hide();
            });

            //editor.insertImage(welEditable, url);



        });
    });
}

function loadallcomments(evt,doc)
{
    var data = doc.data;
    var postt = document.getElementById(doc.id);
    var commentHTML = '';
    for(var i=data.comments.length-1;i>=0;i--){
        var comment=data.comments[i];
        commentHTML += '<div class="comment-container row valign-wrapper">  <div><div>'+comment.user +'</div> <div class="comment-content">' + comment.comment + '</div> </div> </div>';
        // TODO: Add commenters pic
    }
    postt.querySelector('.post-comments').innerHTML = commentHTML;


}


function updateuI(doc) {

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
    }

    else 
    {   console.log("updating..");

    

    // TODO: add posters name and pic

    var commentHTML = '';
    for(var i=data.comments.length-1;i>=0 && i>data.comments.length-10;i--){
        var comment=data.comments[i];
        commentHTML += '<div class="comment-container row valign-wrapper">  <div><div>'+comment.user +'</div> <div class="comment-content">' + comment.comment + '</div> </div> </div>';
        // TODO: Add commenters pic
    }
    postt.querySelector('.post-comments').innerHTML = commentHTML;

    }



    //  button.addEventListener("click", addcomment.bind(null, button, doc.id));
}

function fetchData(){
    //$('#loading2').show();
    if (lastdoc) {var query = db.collection("new").orderBy('time', 'desc').startAfter(lastdoc).limit(10);console.log("lastdoc exists");}
    else
        var query = db.collection("new").orderBy('time', 'desc').limit(10);

   
   
   query.get().then(function (querySnapshot) {
        var flag = 0;
         lastdoc = querySnapshot.docs[9];
         
        querySnapshot.forEach(function (doc) {
            console.log("fetched succesfully");
            flag = 1;
            updateuI(doc);
        });
    
        if (flag == 1) {
                $('#loading2').hide();
                $('#loadmore').show();
            console.log("hidden succesfully");
            }
     
    });

    }

function postData() {
    $("#posting").show();
    var markupStr = $('#summernote').summernote('code');
    console.log(markupStr);
    db.collection("new").add({
        html: markupStr, time: firebase.firestore.FieldValue.serverTimestamp(), comments:
            []
    }).
    then(function (docRef) {
        docRef.get().then(function(doc) {
            if (doc.exists) {
                holder=document.getElementById('holder');
                    holder.insertBefore(createPostElement(doc.data(),doc.id),holder.childNodes[0]);
                    $('#post').hide();
                    $("#posting").hide();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    });
}

function addcomment(evt, id) {
    console.log(id);
        var postElement=document.getElementById(id);
    var commentin=postElement.querySelector('#textarea1').value;
    db.collection("new").doc(id).update({ comments: firebase.firestore.FieldValue.arrayUnion({comment:commentin,user:username}) });

    db.collection("new").doc(id).get().then(function(doc){updateuI(doc)});
}

function createPostElement(data, docid) {
    var postElement = document.createElement('div');
    postElement.id = docid;
    postElement.innerHTML = '<div class="post-holder card-panel"> <div class="post-header"> <img src="user-placeholder.png" class="user-pic poster-pic"> <div class="poster-name">Aviral Kumar</div> <div class="grey-text smaller-text to-right post-time">Jan 1, 2077</div> </div> <div class="post-content"> </div> <h4>Comments</h4> <div class="post-comments"> </div> <div class="loadall"><a class="btn-flat waves-effect waves-dark-yellow blue-text text-darken-1"><i class="material-icons left">expand_more</i>Show all</a></div> <div class="row valign-wrapper">'+
    '<div class="input-field col s10 m11"> <textarea id="textarea1" class="materialize-textarea"></textarea> <label for="textarea1">Write a comment</label> </div>'+
    '<a class="col s2 m1 waves-effect waves-light btn yellow darken-3 sendd"><i class="material-icons">send</i></a> </div> </div>';
    postElement.querySelector('.post-content').innerHTML = data.html;
    postElement.querySelector('.sendd').addEventListener('click',addcomment.bind(null,null,docid));
    if(data.comments.length<=10)postElement.querySelector('.loadall').setAttribute('style','display:none');
    postElement.querySelector('.loadall').addEventListener('click',loadallcomments.bind(null,null,{data:data,id:docid}));
    var date = data.time.toDate();
    //    var fdate= date.substring(0,date.indexOf('G'));
    postElement.querySelector('.post-time').textContent = data.time.toDate().toDateString();

    // TODO: add posters name and pic

    var commentHTML = '';
    for(var i=data.comments.length-1;i>=0 && i>data.comments.length-10;i--){
        var comment=data.comments[i];
        commentHTML += '<div class="comment-container row valign-wrapper">  <div><div>'+comment.user +'</div> <div class="comment-content">' + comment.comment + '</div> </div> </div>';
        // TODO: Add commenters pic
    }
   
    postElement.querySelector('.post-comments').innerHTML = commentHTML;
    return postElement;
}
