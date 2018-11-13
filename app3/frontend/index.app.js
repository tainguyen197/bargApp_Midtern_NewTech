$(function() {
    // alert('msg');

    $.ajax({
        url: 'http://localhost:3000/api/products',
        type: 'GET',
        dataType: 'json',
        timeout: 10000
    }).done(function(data) {
        // console.log(data);
        var source = document.getElementById("product-template").innerHTML;
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#products').html(html);
    })
});