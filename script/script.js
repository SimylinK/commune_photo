$(function(){

  var sel = $('#listNumber');
  for (i = 1; i<= 128; i++) {
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
    minLength : 3,
    source : function(requete, reponse){ // les deux arguments représentent les données nécessaires au plugin
      $.ajax({
        url : 'http://infoweb-ens/~jacquin-c/codePostal/codePostalComplete.php', // on appelle le script JSON
        dataType : 'json', // on spécifie bien que le type de données est en JSON
        data : {
          commune : $('#commune').val() // on donne la chaîne de caractère tapée dans le champ de recherche

        },
        success : function(donnee){
          var past = "";
          var index = 0;
          reponse( $.map( donnee, function( item ){
            console.log(item.Ville+" "+past);
            if (!(past.contains(item.Ville)) && index < 15) {
              index ++
              //alert(past);
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
