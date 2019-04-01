var data=[];


function post(ih,ts)
{
    this.ih;
    this.ts=ts;

}


function updateUI()
{

}

function fetchData()
{
    db.collection("adminposts").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
           
            data.push(doc.data());
        });
    });
}


function postData()
{
    var markupStr = $('#summernote').summernote('code');
        console.log(markupStr);
        db.collection("new").add({html:markupStr,time:firebase.firestore.FieldValue.serverTimeStamp()}).then(function(docRef)
                                                                                                     {
                                                                                console.log("Document written with ID: ", docRef.id);
                                                                                                        });
}