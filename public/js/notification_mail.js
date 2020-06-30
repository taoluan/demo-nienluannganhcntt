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
    let rf_notification = db.ref('Send_Notification/'+id_us)
    if(num_email == 0){
      $("#email_num").text('')
    }
    var count_mail = 0;
    var count_thongbao = 0 ;
    rf.orderByChild("status").equalTo('Chưa xem').on('value',(snap)=>{
      count_mail = snap.numChildren()
     // console.log(count_mail+count_thongbao)
      if(count_mail != 0){
        console.log(123)
        $("#email_num").text(count_mail+count_thongbao)
        $("#ring").removeClass('text-danger')
      }
    })
    rf_notification.orderByChild("status").equalTo('Chưa xem').on('value',(snap)=>{
       count_thongbao = snap.numChildren();
       if(count_thongbao != 0){
          $("#email_num").text(count_mail+count_thongbao)
          $("#ring").removeClass('text-danger')
       }else {
         // $("#email_num").text('')
       }
      
    })
    rf.on("child_added", function(snapshot) {
        var list_mail = [];
        list_mail.push(snapshot.val())
        list_mail.forEach(data => {
            if(data.status === "Đã xem"){
                $('#list_email').append('<li id="'+snapshot.key+'" class="notification-box border mt-2 mb-3" style="border-radius: 50px;"><div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="fab fa-facebook-messenger fa-3x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+' <span class="badge badge-primary float-right"><a href="/email"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">'+data.message+'</p> </div><small class="text-secondary small mt-0 mb-0">Ngày gữi: '+data.created+'<span class="badge badge-pill badge-primary float-right">Đã xem</span></small></div></div></li>')
            }else{
              $('#list_email').append('<li id="'+snapshot.key+'" class="notification-box border mt-2 mb-3" style="border-radius: 50px;"><div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="fab fa-facebook-messenger fa-3x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+' <span class="badge badge-primary float-right"><a href="/email"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">'+data.message+'</p> </div><small class="text-secondary small mt-0 mb-0">Ngày gữi: '+data.created+'<span class="badge badge-pill badge-danger float-right">Chưa xem</span></small></div></div></li>')
 
            }
        });
    })
    rf_notification.on("child_added", function(snapshot) {
      var list_mail = [];
      list_mail.push(snapshot.val())
      list_mail.forEach(data => {
          if(data.status === "Đã xem"){
              $('#list_email').append('<li id="'+snapshot.key+'" class="notification-box border mt-2 mb-3" style="border-radius: 50px;"><div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="far fa-paper-plane fa-2x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+'<span class="badge badge-primary float-right"><a id="xem" href="/vieclamit/'+data.job+'&'+data.id_job+'"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">Vừa đăng một công việc mới có thể hợp với bạn <span class="font-weight-bold">'+data.job+'</span></p> </div><small class="text-secondary small mt-0 mb-0"><span class="badge badge-pill badge-primary float-right">'+data.status+'</span></small></div></div></li>')
          }else{
            $('#list_email').append('<li id="'+snapshot.key+'" class="notification-box border mt-2 mb-3" style="border-radius: 50px;"><div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="far fa-paper-plane fa-2x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+'<span class="badge badge-primary float-right"><a id="xem" href="/vieclamit/'+data.job+'&'+data.id_job+'"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">Có công việc mới có thể hợp với bạn <span class="font-weight-bold">'+data.job+'</span></p> </div><small class="text-secondary small mt-0 mb-0"><span class="badge badge-pill badge-warning float-right">'+data.status+'</span></small></div></div></li>')
          }
      });
  })
    rf.on("child_removed", (snapshot) =>{
        let remove_div = $("#"+snapshot.key)
        remove_div.remove();
    });
    rf_notification.on("child_removed", (snapshot) =>{
      let remove_div = $("#"+snapshot.key)
      remove_div.remove();
  });
    $('#navbarDropdown').click(()=>{
      rf.orderByChild("status").equalTo('Chưa xem').on('value',(snap)=>{
        snap.forEach(element => {
          rf.child(element.key).update({
            "status": "Đã xem"
          }).then(()=>{
            $("#email_num").text('')
          })
        });
      })
    })
    rf_notification.on('child_added',function(snap){
     // snap.forEach(element => {
        $('#'+snap.key).hover(()=>{
          rf_notification.child(snap.key).update({
              "status": "Đã xem"
          }).then(()=>{
            $("#email_num").text('')
            rf_notification.child(snap.key).on('value',snaps=>{
              let arr = [snaps.val()]
              arr.forEach(data => {
                $('#'+snap.key).html('<div class="row"><div class="col-lg-3 col-sm-3 col-3 d-flex justify-content-center" ><i class="far fa-paper-plane fa-2x text-primary ml-3 mt-3"></i></div>    <div class="col-lg-8 col-sm-8 col-8"><strong class="text-black">'+data.from+'<span class="badge badge-primary float-right"><a id="xem" href="/vieclamit/'+data.job+'&'+data.id_job+'"><i class="fas fa-eye text-white"></i></a></span></strong><div><p class="mt-0 mb-0 font-italic small" style="line-height: 1.5">Vừa đăng một công việc mới có thể hợp với bạn <span class="font-weight-bold">'+data.job+'</span></p> </div><small class="text-secondary small mt-0 mb-0"><span class="badge badge-pill badge-primary float-right">'+data.status+'</span></small></div></div>')
              });
             })
          })
        })
    //  });
    })
    //rf.on('value',snap=>{console.log(snap.val())});
}());