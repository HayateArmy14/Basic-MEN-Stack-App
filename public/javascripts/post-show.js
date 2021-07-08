
let toggleEditForm =  document.querySelectorAll(".toggle-edit-form");
let editReviewForm =  document.querySelectorAll(".edit-review-form");

 for(let i=0; i<toggleEditForm.length; i++){
     toggleEditForm[i].addEventListener("click", function () {
     editReviewForm[i].classList.toggle("visible")
     toggleEditForm[i].innerHTML === "Edit" ? toggleEditForm[i].innerHTML = "Cancel" : toggleEditForm[i].innerHTML = "Edit" 
} )
}

//Add Click Listerner for clearing of rating from edit/new Form

$(".clear-rating").click(function () {
    $(this).siblings(".input-no-rate").click();
})