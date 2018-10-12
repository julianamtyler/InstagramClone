
$(function () {
    function render(userContent) {
        $('#galleryList').html(userContent);
    }

    const displayContent = () => {
        $.ajax({url: 'api/photos', method: 'GET'}) 
            .then(function(data){  
                let content = '';
                if (data != ''){         
                    data.forEach(e => content += `<img src='${e.photo_url}' class='gallery-image'>
                        <div class="heartcomment">
                        <i class="fas fa-heart empty"></i>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i class="far fa-comment"></i>
                        <button photoId='${e._id}' class='remove big-icon'><i class="fas fa-times"></i></button>
                        </div>` );     
                }
                else{
                    content = `<img src="./Image/blank.jpg" class="gallery-image" alt="">`;
                };
                render(content);
            });
    };


    // const addNewPhoto = () => {
    //     const addedURL = 
    //     $.ajax({url: 'api/photos', method: 'POST', data: {photo_url: addedURL}})
    //     .then(function(data){
    //         displayContent();
    //     });
    // };

    displayContent();

   $('#addPhoto').on("click", function(){$('#inputUploadPhoto').click();});
   $('#inputUploadPhoto').on("change", function(){$('#frmUpload').submit();});

   $('#galleryList').on('click', '.remove', function() {

        //$.ajax({url: "/api/photo/" + $(this).attr('photoId'), method: "DELETE" })
        $.ajax({url: `/api/photo/${$(this).attr('photoId')}`, method: "DELETE" })
            .then(function(data) {
                console.log('deleted');
                displayContent();
            });
   })

})

