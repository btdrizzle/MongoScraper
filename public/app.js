$(document).ready(function() {
    $('.save-article').on("click", function () {
        $.ajax({
            url: "/api/post",
            type: "POST",
            data: {title: $(this).attr("data-title"),link: $(this).attr("data-link")},
            success: function(response){
                console.log(response);
            }
        });
    })
    $(".delete").on("click", function() {
        $.ajax({
            url: `/api/article/${$(this).attr("data-id")}`,
            type: "DELETE",
            data: {id: $(this).attr("data-id")},
            success: function(response){
                console.log(response);
            }
        }).then(function() {
            location.reload();
        })
    })
}) 

