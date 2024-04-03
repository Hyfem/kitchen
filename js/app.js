

let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHtml = document.querySelector('.listProduct');
let listCartHtml = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    listProductHtml.innerHTML = '';
    if (listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHtml.appendChild(newProduct);
        });
    }
};

listProductHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id); // here i Call addToCart function with product_id
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHtml();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHtml = () => {
    listCartHtml.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];
            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    $${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHtml.appendChild(newCart);

        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
});

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch(type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHtml();
}

const initApp = () => {
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            listProduct = data;
            addDataToHTML();

            if(localStorage.getItem('cart')){
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHtml();
            }
        });
};

initApp();

const checkoutBtn = document.querySelector('.checkoutbtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        // here i construct  the URL with cart items
        let url = 'purchase.html?';
        let cartItems = document.querySelectorAll('.listCart .item');
        console.log("Cart items:", cartItems); // i just have to debug statement
        cartItems.forEach((item, index) => {
            let itemName = item.querySelector('.name').innerText;
            let itemPrice = item.querySelector('.totalPrice').innerText;
            let itemQuantity = item.querySelector('.quantity span:nth-child(2)').innerText;
            console.log("Item name:", itemName); // Debug statement
            console.log("Item quantity:", itemQuantity); // i am Debugging statement to be sure
            console.log("Item price:", itemPrice); // Debugging statement here as well
            url += `item${index + 1}_name=${encodeURIComponent(itemName)}&item${index + 1}_quantity=${encodeURIComponent(itemQuantity)}&item${index + 1}_price=${encodeURIComponent(itemPrice)}&`;
        });
        console.log("Final URL:", url); // Debugging statement
        // Redirect to the purchase page with cart items as query parameters
        window.location.href = url;
    });
} else {
    console.error('Checkout button not found in the DOM.');
}
