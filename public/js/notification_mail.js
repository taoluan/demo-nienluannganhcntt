( function(){
    $("document").ready(function(){
        $('.toast').toast('show');
        $('input[name="planets"]').amsifySuggestags({
            tagLimit: 4,
        });
        $('#logout').click(()=>{
          let url = $(location).attr('pathname');
           $.ajax({
            method:'get',
            url:'/logout/user',
            data:{urlnew:url}
          }).done((data)=>{
            $(location).attr('href', data)
          })
        })  
      });
    var config = {
    apiKey: "AIzaSyDUL1FX3aHjQdymwsrQLgT-UH5HzVJqKHI",
    authDomain: "nienluannganh-3c1c3.firebaseapp.com",
    databaseURL: "https://nienluannganh-3c1c3.firebaseio.com",
    projectId: "nienluannganh-3c1c3",
    };
    firebase.initializeApp(config);
    let id_us = $("#id_user").text();
    let num_email = $("#email_num").text();
    var db = firebase.database();
    let rf = db.ref('Send_Email/'+id_us);
    rf.orderByChild("status").equalTo('Chưa xem').on('value',(snap)=>{
        var count =  0;
        snap.forEach(element => {
          count++
        });
        if(count === 0){
            $("#email_num").text('')
        }else{
            $("#email_num").text(count)
            $("#ring").removeClass('text-danger')
        }
        
    })
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
                $('#list_email').append('<li id="'+snapshot.key+'" class="notification-box border mt-2 mb-3" style="border-radius: 50px;"><div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="fab fa-facebook-messenger fa-3x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+' <span class="badge badge-primary float-right"><a href="/email"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">'+data.message+'</p> </div><small class="text-secondary small mt-0 mb-0">Ngày gữi: '+data.created+'<span class="badge badge-pill badge-primary float-right">Đã xem</span></small></div></div></li>')
            }else{
              $('#list_email').append('<li id="'+snapshot.key+'" class="notification-box border mt-2 mb-3" style="border-radius: 50px;"><div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="fab fa-facebook-messenger fa-3x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+' <span class="badge badge-primary float-right"><a href="/email"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">'+data.message+'</p> </div><small class="text-secondary small mt-0 mb-0">Ngày gữi: '+data.created+'<span class="badge badge-pill badge-danger float-right">Đã xem</span></small></div></div></li>')
 
            }
        });
    })
    rf.on("child_removed", (snapshot) =>{
        let remove_div = $("#"+snapshot.key)
        remove_div.remove();
    });
    $('#navbarDropdown').click(()=>{
      rf.once('value',(snap)=>{
        snap.forEach(element => {
          rf.child(element.key).update({
            "status": "Đã xem"
          })
        });
      })
    })
    //rf.on('value',snap=>{console.log(snap.val())});
}());