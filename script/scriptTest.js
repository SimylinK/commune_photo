$(document).ready(function() {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
        tags: "sunset",
        tagmode: "any",
        format: "json"
    }, function(data) {
        $.each(data.items, function(i, item) {
            var img = $("<img/>");
            img.attr('width', '200px');
            img.attr('height', '150px');
            img.attr("src", item.media.m).appendTo("#dvImages");
            if (i == 3) return false;
        });
    });
});
