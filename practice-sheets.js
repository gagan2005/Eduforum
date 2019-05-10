var db = firebase.firestore();
var storage = firebase.storage();
var lastdoc = null;
var sheetListElement = document.getElementById('sheet-list');

//Initialize Sidebar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

function showForm() {
    document.getElementById('upload-form').classList.remove('hide');
}

function hideForm() {
    document.getElementById('upload-form').classList.add('hide');
}

function addSheet() {       // upload file to server
    var sheetTitle = document.getElementById('sheet-title').value;

    //display toast
    console.log("Uploading file to storage..");
    var toast = M.toast({
        html: 'Uploading',
        displayLength: Infinity
    });
    var file = document.getElementById('file-input').files[0];
    var filePath = "sheets" + '/' + file.name;
    storage.ref(filePath).put(file).then(function (fileSnapshot) {
        // 3 - Generate a public URL for the file.
        return fileSnapshot.ref.getDownloadURL().then((url) => {
            console.log(url);
            addSheetDoc(url, sheetTitle);
            toast.dismiss();
        });
    });
}

function addSheetDoc(url, sheetTitle) {
    // Add a new document with a generated id.
    db.collection("sheets").add({
        fileURL: url,
        title: sheetTitle,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function (docRef) {
        docRef.get().then(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                generateSheetElement(doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }).catch(function (error) {
        console.error("Error adding document: ", error);
        M.toast({ html: 'Something went wrong' });
    });
}

function generateSheetElement(data) {
    var sheetElement = document.createElement('div');
    sheetElement.innerHTML = '<div class="post-holder card-panel"> <div class="row" style="margin-bottom: 0px;"> <div class="col s10 title-div">Sheet 1</div> <div class="col s2"><a target="_blank" class="waves-effect grey-text" href="#"><i class="material-icons">save_alt</i></a></div> </div> </div>';
    sheetElement.querySelector('.title-div').textContent = data.title;
    sheetElement.querySelector('a').href = data.fileURL;

    //display element
    sheetListElement.insertAdjacentElement('afterbegin', sheetElement);
}

function fetchData() {
    //$('#loading2').show();
    if (lastdoc) {

        if(lastdoc!="false"){

        var query = db.collection("sheets").orderBy('timeStamp', 'desc').startAfter(lastdoc).limit(10);
        console.log(lastdoc);
        }
        else
        return;
    }
    else
        var query = db.collection("sheets").orderBy('timeStamp', 'desc').limit(10);

    query.get().then(function (querySnapshot) {
        var flag = 0;
        lastdoc = querySnapshot.docs[9];
        if(!lastdoc)lastdoc="false";
        
        //console.log(lastdoc);
        querySnapshot.forEach(function (doc) {
            console.log("fetched succesfully");
            generateSheetElement(doc.data());
        });

        flag = 1;

        if (flag == 1) {
            $('#loading2').hide();
            $('#loadmore').show();
            console.log("hidden succesfully");
        }
    });
}

fetchData();