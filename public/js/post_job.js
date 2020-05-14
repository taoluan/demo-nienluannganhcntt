(function ($) {
    $(document).ready(function(){
        var skills = [ "JavaScript","PHP","C++","C#","Python","Java","Nodejs","MongoDB","Ruby","AI","Css/Boostrap","MySQL","Elasticsearch","Cassandra","FondEnd","BackEnd","Scala","Swift","TypeScript","Objective-C","English","SQL","Android",".NET"];
        var skills = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: skills
        });
        $('input[name="skills"]').tagsinput({
            typeaheadjs: {
            name: 'skills',
            source: skills
            }
        });
        $('.save').click(function(){
            let addname =  $('#addname').val();
            if(addname !== ''){
                $('#sel').append( '<option value="'+addname+'">'+addname+'</option>');
                $('.save').attr("data-dismiss","modal");  
            }
            });
            function formattext (id){
                var key = window.event.keyCode;
                if (key === 13) {
                    id.val(id.val()+"*")
                return false;
            }
                else {
                    return true;
                }
            }
            $('#format_descript').keypress(function(){
                formattext ($('#format_descript'));
            })
            $('#format_req_skill').keypress(function(){
                formattext ($('#format_req_skill'));
            })
            $('#format_req_additional').keypress(function(){
                formattext ($('#format_req_additional'));
            })

    })
})(window.jQuery)