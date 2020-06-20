$(document).ready(function () {
    $.ajax({
        method:'get',
        url:'/Xuly/loadList_star',
    }).done((data)=>{
        let rs = []
        for(let i = 0 ; i <5 ; i++){
            rs.push(data[i].avg_star)
        }
        $('#point_star').text(data[6].point_start+" / 5")
        $('#point_vote').text(data[7].point_vote+" %")
        var ctxP = document.getElementById('danhgia').getContext('2d');
        var myPieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
        labels: ["1 Sao", "2 Sao", "3 Sao", "4 Sao", "5 Sao"],
        datasets: [{
        data: rs,
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
        }]
        },
        options: {
        responsive: true
        }
        });
    })
    $.ajax({
        method:'get',
        url:'/Xuly/loadChart_job',
    }).done((data)=>{
        var ctx = document.getElementById('applyjob').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            title:{
            fontSize: 10,
            },
            data: {
                labels: data.name,
                datasets: [{
                    label: '# of Votes',
                    data: data.count,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 10,
                            stepSize: 1,
                            
                        }
                    }]
                }
            }
});
        })
    const database_realtime = firebase.database();
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('#example1').DataTable();
    $('#mytable').DataTable();
    $('.edit').click(function(){
        $.ajax({
            url: '/admin/edit',
            method:'post',
            success: function (data){
                $('#ctn').html(data)
            } 
        })
    });
    $('.check_true').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/check/Default_profile',
            method: 'post',
            success:function(data){
                if(data === 'true'){
                    location.href='/admin/page-ad'
                }else{
                    alert('Vui lòng thêm thông tin của công ty');
                    $('.edit').click();
                }
            }
        })
    })  
    $('.post-job').click(function(){
        $.ajax({
            url: '/admin/post-job',
            method:'post',
            success: function (data){
                $('#ctn').html(data)
            } 
        })
    });
    $('.list-job').click(function(){
        $.ajax({
            url: '/admin/list-job',
            method:'post',
            success: function (data){
                $('#ctn').html(data)
            } 
        })
    });
    $('.bt_duyet').click(function(){
        let id = $(this).val();
        let str_id = id.substring(0,id.indexOf('*'));
        let str_user = id.substring(id.indexOf('*')+1,id.indexOf('$'));
        let name = id.substring(id.indexOf('$')+1,id.length);
        $.ajax({
            url: '/Xuly/update_job',
            method: 'get',
            data:{
                id_job : str_id,
                id_user : str_user
            }
        }).done((data)=>{
            if(data){
                $('#guiden').val(name+'@'+str_user);
                $('#id_job').val(str_id);
                $('#send_email').modal('show');
                /*$('#email').click(function(e){
                    let mess = $('#message').val()
                    database_realtime.ref('SendEmail/').set({send:str_id,to:str_user,message:mess})
                    window.location.reload();
                })*/
            }
        
        })
    })
    $('.bt_huy').click(function(){
        let id = $(this).val();
        let str_id = id.substring(0,id.indexOf('*'));
        let str_user = id.substring(id.indexOf('*')+1,id.indexOf('$'));
        $.ajax({
            url: '/Xuly/update_huy_job',
            method: 'get',
            data:{
                id_job : str_id,
                id_user : str_user
            }
        }).done((data)=>{
            if(data){
                $('#guiden').val(name+'@'+str_user);
                $('#id_job').val(str_id);
                $('#send_email').modal('show');
            }
        
        })
    })
});

