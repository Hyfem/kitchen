// Function to get URL parameters get element by either id or name 
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// this Function to display item data and calculate total price
function displayItemData() {
  var itemsDiv = document.getElementById('items');
  var index = 1;
  var total = 0; // Initialize total price
  var itemName, itemQuantity, itemPrice;
  while (true) {
      itemName = getParameterByName('item' + index + '_name');
      if (!itemName) break; // loop will exit if there is no more item
      itemQuantity = parseInt(getParameterByName('item' + index + '_quantity'));
      itemPrice = parseFloat(getParameterByName('item' + index + '_price').replace('$', ''));
      total += itemQuantity * itemPrice; // sum up  total price
      // item data display immediately 
      var itemDiv = document.createElement('div');
      itemDiv.innerHTML = `<p>Item Name: ${itemName}</p>
                           <p>Quantity: ${itemQuantity}</p>
                           <p>Price: $${itemPrice.toFixed(2)}</p>`;
      itemsDiv.appendChild(itemDiv);
      index++;
  }
  // Display total price of each item
  var totalPriceElement = document.getElementById('total-price');
  if (totalPriceElement) {
      totalPriceElement.textContent = total.toFixed(2);
  }
}

// Call function to display item data and calculate total price when the page loads i did not add image 
window.onload = function() {
  console.log("Page loaded"); // Debug statement
  displayItemData();
};
