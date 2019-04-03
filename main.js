var db = firebase.firestore();
var storage=firebase.storage();


//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

const postTemplate = "<div class='post-holder card-panel'>";
const commentTemplate="<div class='comment-container row valign-wrapper'>"+"<img src='user-placeholder.png' class='comment-user-pic col s2 m1'>"
+"<div class='col s10 m11'>"+
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

$('#summernote').summernote({
    callbacks: {
     

        onImageUpload: function(files, editor, welEditable) {
            sendFile(files[0], editor, welEditable);
        }
    }
    });

    function sendFile(files,editor,welEditable)
    {
        // upload image to server and create imgNode...
        console.log("Uploadeing image to storage..");
        var filePath = "test" + '/' + files.name;
         storage.ref(filePath).put(files).then(function(fileSnapshot) {
          // 3 - Generate a public URL for the file.
          return fileSnapshot.ref.getDownloadURL().then((url) => {
              console.log(url);
            // 4 - Update the chat message placeholder with the image’s URL.
           
          // $('#summernote').summernote('insertImage', url,'kutta');

          $('#summernote').summernote('insertImage', url, function ($image) {
            
            $image.attr('class', 'responsive-img');
          });

                //editor.insertImage(welEditable, url);
               
             
           
          });
        });
    }
     

function updateuI(doc) {
   
    var data = doc.data();
    var postt = document.getElementById(doc.id);
    if (!postt) 
    {
        postt=document.createElement('div');
        postt.setAttribute('class','post-holder card-panel');
        console.log("idhar pahuncha");
        var ih = "<div>" + data.html + "</div>";
                 //Shi krliyo apne hisab se
        ch="<div><h5>Comments</h5>"
        for (var i = 0; i < data.comments.length; i++)ch = ch+commentTemplate + data.comments[i]+"</div></div></div>";          //comments ki list
        ch = ch + "</div>";

        var mainpost = $(ih);
        console.log(doc.id);
        var comment = $(ch);
        var button = $("<button class='btn-small'>Add comments</button>");



        mainpost.appendTo(postt);              //holder pe bhi css laga de(holde ke andar post,comment aur button hai)
        comment.appendTo(postt);
        button.appendTo(postt);
        document.getElementById("holder").appendChild(postt);
    }
    


      //  button.addEventListener("click", addcomment.bind(null, button, doc.id));
    }

    
    


function fetchData() {
    db.collection("new").orderBy('time','desc').limit(10).get().then(function (querySnapshot) {
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