$(function(){

  var sel = $('#listNumber');
  for (var i = 1; i<= 128; i++) {
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
        img.attr("src", item.media.m).appendTo("#dvImages");
        if (i == $("#listNumber").val()-1) return false;
      });

    });
  });
*/

  $('#commune').autocomplete({
    minLength : 2,
    source : function(requete, reponse){ // les deux arguments représentent les données nécessaires au plugin
      $.ajax({
        url : '../commune.php', // on appelle le script JSON
        dataType : 'json', // on spécifie bien que le type de données est en JSON
        data : {
          commune : $('#commune').val(), // on donne la chaîne de caractère tapée dans le champ de recherche
          maxRows : 10
        },
        success : function(donnee){
          var past = "";
          reponse( $.map( donnee, function( item ){
            if (item.Ville != past) {
              past = item.Ville;
              return item.Ville;
            }
          }) );
        }
      });
    }
  });


$("#button").on('click', function(){
  $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5149a64fa91469647a7511af9adf33a5&format=json&nojsoncallback=1", {
      sort:"relevance",
      tags: $("#commune").val()

  }, function(data) {

      $("#dvImages").html("");
      $("#affichage").html("");
      $.each(data.photos.photo, function(i, item) {
          var img = $("<img/>");
          img.attr('width', '400px');
          img.attr('height', '250px');
          img.attr("src", "https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg").appendTo("#dvImages");
          
            
          var imgTxt = "<img src=\"https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg\" height=\"250px\" width=\"400px\">" 
          // $("#affichage").append("<tr><td id='test'>test</td></tr>");
          
          
          $("#affichage").append("<tr><td id='test'>"+imgTxt+"</td></tr>");
          if (i == $("#listNumber").val()-1) return false;
      });
  });
});

});
