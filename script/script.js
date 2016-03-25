$(function(){

  var sel = $('#listNumber');
  for (i = 1; i<= 20; i++) {
   sel.append($("<option>").attr('value',i).text(i));
  }

  $(function() {
    $( "#tabs" ).tabs();
  });


/*  $("#button").on('click', function(){
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
            img.attr("src", "http://www.flickr.com/photos/" + item.photos.photo.owner + "/" + item.photos.photo.id +"/").appendTo("#dvImages");
            if (i == $("#listNumber").val()-1) return false;
        });
    });
  });



});*/


$("#button").on('click', function(){
  $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5149a64fa91469647a7511af9adf33a5&format=json&nojsoncallback=1", {
      sort:"relevance",
      tags: $("#commune").val()

  }, function(data) {

      $("#dvImages").html("");
      $.each(data.photos.photo, function(i, item) {
          var img = $("<img/>");
          img.attr('width', '400px');
          img.attr('height', '250px');
          img.attr("src", "https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg").appendTo("#dvImages");
          if (i == $("#listNumber").val()-1) return false;
      });
  });
});

});
