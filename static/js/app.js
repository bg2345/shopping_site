
// example of setting and getting session storage information
// let item = {
//   'id': 101,
//   'name': 'Title',
//   'price': 3.98
// };
//
// sessionStorage.setItem('item', JSON.stringify(item));
//
// // retrieving information and tirning it back into an object
// let data = sessionStorage.getItem('item')
//
// let parsed_item = JSON.parse(data);
//
// console.log(parsed_item);

/*******************************
Start of loading products
*******************************/

// step 1: create a callback function
function showProducts(res) {
  // create an empty string
  html = '';

  // loop through all products in the response
  for (let i in res) {
    // make a new row for any iteration starting at 0, 3, 6, 9
    if (i % 3 == 0) {
      html += '<div class="row top-margin-md">';
    }

    // create a card for each product with their respective information
    html += `
      <div class="col-md-4">
        <div class="card">
          <img src="${res[i].img_url}" alt="Placeholder" class="card-img">
          <div class="card-title">${res[i].name}</div>
          <div class="card-subtitle">$${res[i].price.toFixed(2)}</div>
          <div class="card-text">${res[i].description}</div>
          <button class="btn btn-success" onClick="addItem(${res[i].id})">Add to Cart</button>
        </div> <!-- ends card -->
      </div> <!-- ends col 4 for card -->
    `;

    // end the row for any iteration ending in 2, 5, 8 or if the iteration is the same as the length of the array
    if ((i + 1) % 3 == 0 || res.length === i + 1) {
      html += '</div> <!-- ends row -->'
    }
  }

  // use jQuery to send string as html
  $('#products').html(html);
}


// step 2: get a response from products.json using jQuery
$.get('../../products.json', showProducts)

/******************************
End of loading products
******************************/



/****************************
Start cart operation functions
*******************************/

  // create add item function to push to cart
function addItem(id) {
  // clear session storage
  // sessionStorage.clear();

  if (sessionStorage.getItem('cart')) {
    var cart = JSON.parse(sessionStorage.getItem('cart'));
  } else {
    var cart = [];
  }

  // check to see if a cartt key exists in session storage

// if it does, set a local cart variable to work with, using the parsed string

// if it does not exist, set up an empty array

  // send a response to products.json and create a callback that loops through the products and checks the product id
  // to add all item information use jQuery to grab item from json
  $.ajax({
    type: "GET",
    url: "../../products.json",
    async: false,
    success: function(res) {
      for (let i in res) {
        if (res[i].id == id) {
          // if the product id in the current iteration is the same as the id being taken in as the parameter, then push it to the cart.
          cart.push(res[i]);
          break;
        }
      }
    }
  });

  // store the cart into the session storage
  sessionStorage.setItem('cart', JSON.stringify(cart));

  showCart();
}


// create a remove item function that splices the given item

function removeItem(id) {
  // get cart key from session storage and parse it into an object
  let cart = JSON.parse(sessionStorage.getItem('cart'));

  // loop through all items in the cart
    for (let i in cart) {
      // check if the id passed in is the same as the current item
      if (cart[i].id == id){
          // if it is, remove it, and break
        cart.splice(i, 1);
        break;
      } else {
        showCart();
      }
    }

  // add stringified cart to session storage under cart key
  sessionStorage.setItem('cart', JSON.stringify(cart));

  // call showCart again
  showCart();
}

// calculating and returning the total
function calcTotal() {
// get the value and parse from session storage
let cart = JSON.parse(sessionStorage.getItem('cart'));

// define a total variable = 0
let amount = 0;

  // loop through all items in the cart
for (let i in cart) {
  amount += cart[i].price;

}
    // add each items price to Total

  // return the total
return amount.toFixed(2);
}


// updating all classes with total being displayed
function updateTotals() {
  // define a total variable from the return of calc total
let total_amount = calcTotal()

  // insert that total into all places that render total
$(".total").text(`$${total_amount}`)

}



// create a show cart method to render all items within the cart variable
function showCart() {
  // get the value and parse from session storage
  let cart = JSON.parse(sessionStorage.getItem('cart'));

  let cart_table = document.getElementById('cart')
  // if cart is empty, set the table in the cart col md 3 section to display none
  if (cart.length < 1) {
    cart_table.style.display = "none";
  } else {
    cart_table.style.display = "block";

    let html = '';

    for (let i in cart){
      html += `
      <tr>
        <td>1</td>
        <td>${cart[i].name}</td>
        <td>${cart[i].price.toFixed(2)}</td>
        <td>
          <button onCLick="removeItem(${cart[i].id})" class="btn btn-danger">X</button>
        </td>
      </tr>
      `
    }

    $('tbody').html(html);
  }

  updateTotals();

  // otherwise show table by setting display to block, loop over all items in cart and create a new row for each item

  // send the proper string into the tbody section
}

showCart();

/*****************************
End cart operation functions
*****************************/
