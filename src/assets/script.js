// Before deployment, make sure to update these endpoints
var endpoints = {
    catalog: "https://<id>.execute-api.us-west-2.amazonaws.com/Prod",
    users: "https://<id>.execute-api.us-west-2.amazonaws.com/Prod",
    order: "https://<id>.execute-api.us-west-2.amazonaws.com/Prod/order"
};

var selectedUser;
var selectedProduct;

$(document).on('click', '.radio', function () {
    $(this).parent().find('.radio').removeClass('selected');
    $(this).addClass('selected');
    switch ($(this).data("type")) {
        case 'user':
            selectedUser = {
                "name": $(this).data("name"),
                "username": $(this).data("username"),
                "email": $(this).data("email"),
                "firstname": $(this).data("firstname"),
                "lastname": $(this).data("lastname"),
                "id": $(this).data("id"),
            };
            break;
        case 'product':
            selectedProduct = {
                "name": $(this).data("name"),
                "id": $(this).data("id"),
                "description": $(this).data("description"),
                "price": $(this).data("price"),
                "quantity": "1",
            };
            break;
        default:
            console.log("Unknown data type " + $(this).data("type"))
    }
    return false;
});

$(document).ready(function () {
    var products;
    var users;

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;

    // Get all products
    $.ajax({
        url: endpoints.catalog + "/products",
        success: function (data) {
            products = data;
            for (i = 0; i < data.data.length; i++) {
                product = data.data[i]
                $("#prodcards").append('<div class="col mb-4 radio" data-type="product" data-id="' + product.id + '" data-name="' + product.name + '" data-description="' + product.shortDescription + '" data-price="' + product.price + '"> <div class="card h-100"> <img src="' + product.imageUrl1 + '" class="card-img-top" alt="..."> <div class="card-body"> <h5 class="card-title">' + product.name + '</h5> <p class="card-text">' + product.shortDescription + '</p> </div> </div> </div>');
            }
        },
    });

    // Get all users
    $.ajax({
        url: endpoints.users + "/users",
        success: function (data) {
            users = data;
            for (i = 0; i < data.data.length; i++) {
                user = data.data[i]
                $("#usercards").append('<div class="col mb-4 radio" data-type="user" data-id="' + user.id + '" data-firstname="' + user.firstname + '" data-lastname="' + user.lastname + '" data-email="' + user.email + '" data-username="' + user.firstname + '" data-name="' + user.firstname + ' ' + user.lastname + '"> <div class="card h-100"> <div class="row no-gutters"> <div class="col-md-4"> <i class="far fa-user fa-6x"></i> </div> <div class="col-md-6"> <div class="card-body"> <p class="card-text"> ' + user.firstname + '<br />' + user.lastname + '</p> </div> </div> </div> </div> </div>')
            }
        },
    });

    $(".next").click(function () {

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();

        // Update fields for overview page
        if (next_fs.attr("id") == "overview") {
            $("#exampleInputUser").val(selectedUser.name);
            $("#exampleInputProduct").val(selectedProduct.name);
        }

        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 600
        });
    });

    $(".previous").click(function () {

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 600
        });
    });

    $("#make_payment").click(function () {
        ord = {
            "userid": selectedUser.id,
            "firstname": selectedUser.firstname,
            "lastname": selectedUser.lastname,
            "address": {
                "street": "3401 Hillview Ave",
                "city": "Palo Alto",
                "zip": "94304",
                "state": "CA",
                "country": "United States"
            },
            "email": selectedUser.email,
            "delivery": "instore",
            "card": {
                "Type": "Visa",
                "Number": "4222222222222",
                "ExpiryMonth": 7,
                "ExpiryYear": 2021,
                "CVV": "672"
            },
            "cart": [
                {
                    "id": selectedProduct.id,
                    "description": selectedProduct.description,
                    "quantity": selectedProduct.quantity,
                    "price": "\"" + selectedProduct.price + "\""
                }
            ],
            "total": "1402"
        }

        console.log(JSON.stringify(ord))

        $.ajax({
            url: endpoints.order + "/add/" + selectedUser.id,
            type: "POST",
            data: JSON.stringify(ord),
            success: function (data) {
                console.log(data)
            },
            error: function (data) {
                console.log(data)
            }
        })
        return false;
    })

    $("#buy_another").click(function () {
        $(location).attr("href", $(location).attr('href'));
        return false;
    })

});