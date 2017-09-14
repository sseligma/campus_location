(function ($) {
  Drupal.behaviors.camppusLocationScript = {
    attach: function (context, settings) {

      locationMarkers = {};
    	
      function initMap() {
        	
        $.getJSON( "/campus-locations-data", function( data ) {
          //console.log(data);
          var mapOptions = {
            zoom: 17,
        	center: new google.maps.LatLng(0, 0),
        	disableDefaultUI: true,
        	zoomControl: true,
        	zoomControlOptions: {
        	  position: google.maps.ControlPosition.TOP_RIGHT
        	},
          };
        	  
          var map = new google.maps.Map(document.getElementById('campus-locations-map'),mapOptions);
          var infowindow = new google.maps.InfoWindow;
          var bounds = new google.maps.LatLngBounds();
          var latlng
                        
          for (var i = 0; i < data.nodes.length; i++) {
            var node = data.nodes[i].node; 
            
            latlng = new google.maps.LatLng({lat: node.latitude, lng: node.longitude});
            bounds.extend(latlng);

                  var marker = new google.maps.Marker({
                      position: latlng,
                      map: map,
                      nid: node.nid,
                      title: node.title,
                      img: node.image.src,
                      body: node.body,
                      address: node.address,
                      zIndex: 1
                    });
                              
                    marker.addListener('click', function() {
                      showLocationInfo(this);
                      console.log(this);
                    }); 
                    
                    // add the marker to the locationMarkers hashmap
                    locationMarkers[String(marker.nid)] = marker;

          }
        	 
          map.fitBounds(bounds);
            
        });     
          
      }

      function showLocationInfo(marker) {
    	console.log(marker);
    	
    	var img = '<img src="' + marker.img  + '" alt="' + marker.title + '" />'; 
    	$('#campus-location-info .image-container').html(img);
    	$('#campus-location-info .info-container h1').html(marker.title);  
    	$('#campus-location-info .info-container .description').html(marker.body);  
        $('#campus-location-info .info-container .address').html(marker.address);          	
      	$('#campus-location-info').show();	    	
      }
      
      $(document).ready(function() {
    	  
    	var mapsApiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + mapsApiKey;
    	
    	$.getScript( mapsApiUrl )
    	  .done(function( script, textStatus ) {
    	    initMap();
    	  })
    	  .fail(function( jqxhr, settings, exception ) {
    	    $( "div.log" ).text( "Triggered ajaxError handler." );
    	});

    	// add click event to close info window
    	$('#campus-location-info a.close-location-info').click(function(event){
    	  event.preventDefault();
    	  $('#campus-location-info').hide();
    	});
    	
    	$('.show-location-info-link').click(function(event){
      	  event.preventDefault();
      	  
      	  var nid = $(this).attr('data-nid');
      	  if (locationMarkers != undefined) {
      	    showLocationInfo(locationMarkers[nid]);	  
      	  }
    		
    	});
    	
      }); // end doc ready
                
    } // end of attach function
  };
})(jQuery);
