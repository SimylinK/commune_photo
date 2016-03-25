$(function(){

  var sel = $('#listNumber');
  for (i = 1; i<= 20; i++) {
   sel.append($("<option>").attr('value',i).text(i));
  }

  $(function() {
    $( "#tabs" ).tabs();
  });


  $("#button").on('click', function(){
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
        tags: $("#commune").val(),
        tagmode: "any",
        format: "json"
    }, function(data) {
        $("#dvImages").html("");
        $.each(data.items, function(i, item) {
            var img = $("<img/>");
            img.attr('width', '400px');
            img.attr('height', '250px');
            img.attr("src", item.media.m).appendTo("#dvImages");
            if (i == $("#listNumber").val()-1) return false;
        });
    });
  });



});
