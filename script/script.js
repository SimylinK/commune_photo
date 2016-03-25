function displayInfo(photoID, divID) {
  $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=5149a64fa91469647a7511af9adf33a5&format=json&nojsoncallback=1", {
      photo_id:photoID
  }, function(data) {
      $("#" + divID).html("Titre : " + data.photo.title._content + "</br>" +
        "Date : " + data.photo.dates.taken + "</br>" +
        "Photographe : " + data.photo.owner.realname)
      $("#" + divID).dialog("open");
  });
}


$(function(){

  var sel = $('#listNumber');
  for (var i = 1; i<= 128; i++) {
    sel.append($("<option>").attr('value',i).text(i));
  }

  $(function() {
    $( "#tabs" ).tabs();
  });

  //Dialod UI

  $( "#dialog-noResult" ).dialog({
    autoOpen: false,
  });
  $("#dialog-infoPhoto ").dialog({
    autoOpen: false,
  })

  $( "#datepicker" ).datepicker();

  $("#checkbox1").prop('checked', false);
  $('#autoUpdate').fadeToggle();
  $('#checkbox1').change(function () {
    $('#autoUpdate').fadeToggle();
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
    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=5149a64fa91469647a7511af9adf33a5&format=json&nojsoncallback=1"
    if ($("#checkbox1").is(':checked')) {
      url += "&min_upload_date=" + $("#datepicker").val();
    }

    $.getJSON(url, {
        sort:"relevance",
        text: $("#commune").val()
    }, function(data) {


      $("#dvImages").html("");
      $("#affichage").html("");
        var vide = true;
      $.each(data.photos.photo, function(i, item) {
          vide = false;
          var img = $("<img/>");


          var imgPhoto = "<img src=\"https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg\" height=\"250px\" width=\"400px\" onclick=\"displayInfo(\'"+ item.id +"\', \'div"+ i.toString() +"\')\">"
          $("#dvImages").append(imgPhoto);

          var div ="<div id=\"div"+i.toString()+"\"> Cédric est un PD</div>";
          $("#dvImages").append(div);
          $("#div" + i.toString()).dialog({
            autoOpen: false,
            height: 280,
            width: 400,
            modal: true,
            dialogClass: 'dlgfixed',
            position: "center",
          })
          $("#dvImages").append("</br>");

          var imgTable = "<img src=\"https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg\" height=\"250px\" width=\"400px\">"
          // $("#affichage").append("<tr><td id='test'>test</td></tr>");

          getInfo(item.id, imgTable);

          if (i == $("#listNumber").val()-1) return false;
      });
      if (vide) $( "#dialog-noResult" ).dialog( "open" );
    });
  });






  function getInfo(photoID, imgTxt) {
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=5149a64fa91469647a7511af9adf33a5&format=json&nojsoncallback=1", {
        photo_id:photoID
    }, function(data) {
          var info = "<td>Titre : " + data.photo.title._content + "</br>" +
          "Date : " + data.photo.dates.taken + "</br>" +
          "Photographe : " + data.photo.owner.realname+"</td>";

          $("#affichage").append("<tr><td>"+imgTxt+"</td>"+info+"</tr>");
    });
  }
});
