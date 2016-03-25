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


  $('#commune').autocomplete({
    minLength : 2,
    source : function(requete, reponse){ // les deux arguments représentent les données nécessaires au plugin
      $.ajax({
        url : 'http://infoweb/~e146187z/commune.php', // on appelle le script JSON
        dataType : 'json', // on spécifie bien que le type de données est en JSON
        data : {
          commune : $('#commune').val(), // on donne la chaîne de caractère tapée dans le champ de recherche
          maxRows : 10
        },

        success : function(donnee){
          reponse( $.map( donnee, function( item ){
            return item.Ville;
          }) );
        }
      });
    }
  });
});
