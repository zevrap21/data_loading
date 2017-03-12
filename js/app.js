$(document).foundation();
jQuery(document).ready(function($) {

    // browser window scroll (in pixels) after which the "back to top" link is shown
    var offset = 300,
        //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        offset_opacity = 1200,
        //duration of the top scrolling animation (in ms)
        scroll_top_duration = 700,
        //grab the "back to top" link
        $back_to_top = $('.cd-top');

    //hide or show the "back to top" link
    $(window).scroll(function() {
        ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible'): $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if($(this).scrollTop() > offset_opacity) {
            $back_to_top.addClass('cd-fade-out');
        }
    });

    //smooth scroll to top
    $back_to_top.on('click', function(event) {
        event.preventDefault();
        $('body,html').animate({
            scrollTop: 0,
        }, scroll_top_duration);
    });



    //the remove data btn is disabled  
    $('#btn-remove').prop('disabled', true);
    //when the remove data btn is clicked it will do the folling
    $('#btn-remove').click(function() {
        //this removes all the loaded data 
        $('#dataTable').html('');
        //load data btn is no longer disabled
        $('#load-btn').prop('disabled', false);
        //the remove data btn is disabled
        $('#btn-remove').prop('disabled', true);
        //the load data btn html text now says Load Data
        $('#load-btn').html('Load Data');
       
    });


 	//on click calls ajax_get_json() function and passes value in the input filed
	//removes any white space and makes everything lowercase before passing
    $('#load-btn').click(function() {
 		 
        ajax_get_json($('#input').val().trim().toLowerCase());

    });


});
 
/**
 * Makes an ajax jquery call to get back json data. 
 * Pass json data to loadData() function.
 *  
 *@param {string} url - url used to make request.
 */
function ajax_get_json(url) {

    $.ajax({
        type: 'GET',
        url: url,
        data: {},
        dataType: 'json',
        success: function(data) {
			 //pass data to loadData function
             loadData(data);
			
			 //disable the load data btn  
			 $('#load-btn').prop('disabled', true);
			 //enable the remove data btn
			 $('#btn-remove').prop('disabled', false);
			 //update the load data btn text
			 $('#load-btn').html('Data Loaded');
 	
        },
        error: function(result) {
 
            alert("Enter a valid file location");
        }
    });

}


/**
 * Output first 20 or less data items to html table.
 * If data items > 20 call loadAdditionalData() function.
 * 
 *@param {string} data - json data.
 */
function loadData(data) {
	//Get total number items in datta
    var totalItems = data.configurations.length; 

    //if total items > 20 then only the first 20 items will load otherwise all the items will load
    if(totalItems > 20) {
        var itemLoop = 20;
    } else {
        var itemLoop = totalItems;
    }

    // loads each item in a table row up to the first 20
    var r = new Array(),
        j = -1;
    for(var i = 0; i < itemLoop; i++) {

        r[++j] = '<tr class="row" ><td class="name item">';
        r[++j] = data.configurations[i].name;
        r[++j] = '</td><td class="hostname item">';
        r[++j] = data.configurations[i].hostname;
        r[++j] = '</td><td class="port item">';
        r[++j] = data.configurations[i].port;
        r[++j] = '</td><td class="username item">';
        r[++j] = data.configurations[i].username;
        r[++j] = '</td></tr>';
    }


    // once all the items have been stored in the array, it adds to html
    // adding items all at once helps with performance by avoiding reflow of DOM

    $('#dataTable').append(r.join(''));
    //data.configurations.splice(20, 0);

    // if items > 20 then call function loadAdditionalData()
    if(totalItems > 20) {
        loadAdditionalData(data);
    }

}


/**
 * If called, outputs the remaining data items to html table.
 * 
 *@param {string} data - json data.
 */
function loadAdditionalData(data) {

    //Get total number items in datta 
    var totalItems = itemEndTemp = data.configurations.length;
    //determins how many blocks are needed to divide remaining data in
    var block = Math.ceil(totalItems / 20) - 1;

    //sets the end point of when to stop loading data 
    var itemEnd = totalItems - 20;

    // if items > 20 then set starting and ending locations 
    if(totalItems > 20) {
        var itemStart = (itemEndTemp - 20);
        itemEnd = itemEnd - 20;;
    } else {
        // if items < 20 then find how many items remain to set the start and end points 
        itemStart = (itemEndTemp - (totalItems % 20));
        itemEnd = 0;
    }
    // this is needed to prevent the end point from going into the negatives and throwing console errors
    if((totalItems > 20) & (totalItems < 40)) {
        itemEnd = 0;
    }
    //keepts track of what data item to show between the start and end points 
    var index = 20;
    //counter to keep track how many blocks data have been loaded 
    var counter = 0;

    //checks to see when someone starts to scroll page
    $(window).scroll(function() {
        //checks to see when someone reaches 80% bottom of page
        var windowsHeight = $(document).height() - $(window).height();
        var currentScroll = $(window).scrollTop();

        if(((currentScroll * 100) / windowsHeight) > 80) {
            //keep track how many blocks remain
            if(counter < block) {

                // loads each item in a table row up to 20 at a time 
                var r = new Array(),
                    j = -1;
                // the starting point will decrease each time a items has been stored inside the array until it reaches the ending point
                for(itemStart; itemStart > itemEnd; itemStart--) {

                    r[++j] = '<tr class="row" ><td class="name item">';
                    r[++j] = data.configurations[index].name;
                    r[++j] = '</td><td class="hostname item">';
                    r[++j] = data.configurations[index].hostname;
                    r[++j] = '</td><td class="port item">';
                    r[++j] = data.configurations[index].port;
                    r[++j] = '</td><td class="username item">';
                    r[++j] = data.configurations[index].username;
                    r[++j] = '</td></tr>';
                    index++;
                }
                // once all the items have been stored in the array, it adds to html
                // adding items all at once helps with performance by avoiding reflow of DOM
                $('#dataTable').append(r.join(''));


                //gets the new ending point 
                if((itemEnd < 20)) {
                    itemEnd = (itemStart - (totalItems % 20));

                } else {
                    itemEnd = (itemStart - 20);

                }
            }

            counter++;
        }
    });

}