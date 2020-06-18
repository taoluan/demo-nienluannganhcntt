(async function(){
    var config = {
    apiKey: "AIzaSyDUL1FX3aHjQdymwsrQLgT-UH5HzVJqKHI",
    authDomain: "nienluannganh-3c1c3.firebaseapp.com",
    databaseURL: "https://nienluannganh-3c1c3.firebaseio.com",
    projectId: "nienluannganh-3c1c3",
    };
    firebase.initializeApp(config);
    let id_us = $("#id_usr").text();
    let num_email = $("#email_num").text();
    var db = firebase.database();
    let rf = db.ref('Send_Email/'+id_us);
    rf.on("child_added", function(snapshot) {
        var list_mail = [];
        list_mail.push(snapshot.val())
        /*snapshot.forEach(function (childSnapshot) {   
        // console.log(childSnapshot.val())
        rf.child(childSnapshot.key).on('child_added', snap=>{
                console.log(snap)
                list_mail.push(snap.val())
            })
        })
        for(let i = list_mail.length ; i > 0 ; i--){
            $('#list_mail').append('<div class="alert alert-secondary w-100" id="'+snapshot.key+'" role="alert"><h6 class="alert-heading" >Gữi từ: <span class="text-primary mb-0 mt-0">'+list_mail[i].from+'</span></h6><p class="font-weight-bold mb-0 mt-0">Công việc đã ứng tuyển: <a href="/vieclamit/'+data.job+'&'+data.id_job+'"><span class="text-primary">'+list_mail[i].job+'</span></a></p><p class="font-weight-bold mb-0 mt-0" style="font-size:14px">Nội dung: <span style="font-size:16px" class="font-weight-normal font-italic ">'+list_mail[i].message+'</span></p><p class="small font-weight-bold mb-0 mt-0">Ngày gữi:  <span class="font-weight-normal">'+list_mail[i].created+'</span></p><span class="badge badge-light">'+list_mail[i].status+'</span></div>')
        }*/
        list_mail.forEach(data => {
            if(data.status === "Đã xem"){
                $('#list_mail').append('<div class="alert alert-secondary w-100" id="'+snapshot.key+'" role="alert"><h6 class="alert-heading" >Gữi từ: <span class="text-primary mb-0 mt-0">'+data.from+'</span> <span class="badge badge-light float-right mb-0 mt-0">'+data.status+'</span></h6><p class="font-weight-bold mb-0 mt-0">Công việc đã ứng tuyển: <a href="/vieclamit/'+data.job+'&'+data.id_job+'"><span class="text-primary">'+data.job+'</span></a></p><p class="font-weight-bold mb-0 mt-0" style="font-size:14px">Nội dung: <span style="font-size:16px" class="font-weight-normal font-italic ">'+data.message+'</span></p><p class="small font-weight-bold mb-0 mt-0">Ngày gữi:  <span class="font-weight-normal">'+data.created+'</span> </p></div>')
            }else{
                $('#list_mail').append('<div class="alert alert-secondary w-100" id="'+snapshot.key+'" role="alert"><h6 class="alert-heading" >Gữi từ: <span class="text-primary mb-0 mt-0">'+data.from+'</span></h6><p class="font-weight-bold mb-0 mt-0">Công việc đã ứng tuyển: <a href="/vieclamit/'+data.job+'&'+data.id_job+'"><span class="text-primary">'+data.job+'</span></a></p><p class="font-weight-bold mb-0 mt-0" style="font-size:14px">Nội dung: <span style="font-size:16px" class="font-weight-normal font-italic ">'+data.message+'</span></p><p class="small font-weight-bold mb-0 mt-0">Ngày gữi:  <span class="font-weight-normal">'+data.created+'</span></p><span class="badge badge-danger">'+data.status+'</span></div>')
 
            }
        });
    })
    rf.on("child_removed", (snapshot) =>{
        let remove_div = $("#"+snapshot.key)
        remove_div.remove();
    });
    //rf.on('value',snap=>{console.log(snap.val())});
}());