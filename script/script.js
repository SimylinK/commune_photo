$(function(){

  //Mise en place du formulaire

  //Pemet de choisir un nombre entre 1 et 128
  var sel = $('#listNumber');
  for (var i = 1; i<= 128; i++) {
    sel.append($("<option>").attr('value',i).text(i));
  }

  //La checkbox permet d'utiliser le DatePicker
  $("#checkbox1").prop('checked', false);
  $('#autoUpdate').fadeToggle();
  $('#checkbox1').change(function () {
    $('#autoUpdate').fadeToggle();
  });

  //Mise en place des UI jquery

  //UI tabs
  $(function() {
    $( "#tabs" ).tabs();
  });

  //UI Dialog
  $( "#dialog-noResult" ).dialog({
    autoOpen: false,
  });
  //On place le dialog en haut à droite
  $("#dialog-infoPhoto ").dialog({
    autoOpen: false,
    modal: true,
    resizable: true,
    width: 400,
    height: 300,
    position: {
        my: "left+150% top",
        at: "left+25% top",
        of: window,
        collision: "none"
      }
  });

  //UI DatePicker
  $( "#datepicker" ).datepicker();

  //UI DataTables
  $(function() {
    $("#example").DataTable();
  });


  //Mise en place de l'autocomplete pour le nom des communes dans le formulaire
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

  //Fonction principal
  //Permet la recherche des photos sur flickr en appuyant sur l'icone
  $("#icon").on('click', function(){

    //L'url de la requête est préparée en avance pour pouvoir inclure la contrainte de date si nécessaire
    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=76dec8cfa6ca832032f96c4a4bfd7a24&format=json&nojsoncallback=1"
    if ($("#checkbox1").is(':checked')) {
      url += "&min_upload_date=" + $("#datepicker").val();
    }

    //On demande à trier par pertinence, et avec le tag text
        $.getJSON(url, {
        sort:"relevance",
        text: $("#commune").val()
    }, function(data) {
      //On réinitialise les 2 vues
      $("#dvImages").html("");
      $("#tabs-2").html("<table id=\"affichage\" class=\"display\" width=\"100%\" cellspacing=\"0\">"
                           +"<thead>"
                               +"<tr>"
                                   +"<th>Photo</th>"
                                   +"<th>Titre</th>"
                                   +"<th>Date</th>"
                                   +"<th>Photographe</th>"
                               +"</tr>"
                           +"</thead>"
                           +"<tfoot>"
                               +"<tr>"
                                   +"<th>Photo</th>"
                                   +"<th>Titre</th>"
                                   +"<th>Date</th>"
                                   +"<th>Photographe</th>"
                               +"</tr>"
                           +"</tfoot>"
                           +"<tbody>"

                           +"</tbody>"
                       +"</table>");

      //La variable vide va nous permettre d'afficher un messsage s'il n'y a pas de résultats
      var vide = true;
      $.each(data.photos.photo, function(i, item) {
          vide = false;

          //Pour la vue Photo
          var imgPhoto = "<img src=\"https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg\")\">"
          $("#dvImages").append(imgPhoto);
          //sur le click d'une image on obtient les renseignements
          $("#dvImages img:last").on('click', function(){
            displayInfo(item.id);
          });
          $("#dvImages").append("</br>");

          //Pour la vue Table
          //On ajoute l'image et ses infos à la table avec getInfo()
          var imgTxt = "<a class=\"fancybox\" rel='group' href=\"https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg\"><img src=\"https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +".jpg\" height=\"175px\" width=\"300px\"></a>";
          getInfo(item.id, imgTxt);

          //On vérifie s'il n'y a plus d'images à afficher
          if (i == $("#listNumber").val()-1) return false;
      });
      //Si aucune image n'a été affichée, on ouvre le dialog
      if (vide) $( "#dialog-noResult" ).dialog( "open" );
    });

    //Un timer de 2 secondes est mis en place afin de s'assurer que toutes les requêtes sont finis
    setTimeout(function(){
      $(function() {
        $("#affichage").DataTable();
      });
    }, 2000);

  });

  //Fonction pour afficher les informations d'une photo dans un UI Dialog
  //Utilisée pour la vue Photo
  function displayInfo(photoID) {
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=76dec8cfa6ca832032f96c4a4bfd7a24&format=json&nojsoncallback=1", {
        photo_id:photoID
    }, function(data) {
        $("#dialog-infoPhoto").html("Titre : " + data.photo.title._content + "</br>" +
          "Date : " + data.photo.dates.taken + "</br>" +
          "Photographe : " + data.photo.owner.realname)
        $("#dialog-infoPhoto").dialog("open");
    });
  }

  //Fonction pour ajouter les informations d'une photo dans la vue Table
  //Attention l'affichage ici est temporarire, il est repris juste après pour être repris avec l'UI DataTable
  function getInfo(photoID, imgTxt) {
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=76dec8cfa6ca832032f96c4a4bfd7a24&format=json&nojsoncallback=1", {
        photo_id:photoID
    }, function(data) {
          var info = "<td>" + data.photo.title._content + "</td>" +
          "<td>" + data.photo.dates.taken + "</td>" +
          "<td>" + data.photo.owner.realname+"</td>";

          $("#affichage tbody").append("<tr><td>"+imgTxt+"</td>"+info+"</tr>");
          //$("#tabs-2").append("<tr><td>"+imgTxt+"</td>"+info+"</tr>");
    });
  }


});
