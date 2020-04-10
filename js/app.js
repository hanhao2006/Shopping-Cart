//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');

const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.car-overlay');

const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products-center');

let cart = [];
// bouttons
let bouttonDOM = [];

//getting the products
class Products {
  async getProduct() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();

      let products = data.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach(product => {
      result += `
                 <!-- single products -->
                    <article class="product">
                        <div class="img-container">
                            <img src=${product.image} alt="product" 
                            srcset="" class="product-img">
                            <button class="bag-btn" data-id=${product.id}>
                                <i class="fas fa-shopping-cart"></i>
                                add to cart
                            </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>$${product.price}</h4>
                    </article>
            <!-- end of single products -->
                `;
    });
    productDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    bouttonDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      } else {
        button.addEventListener('click', event => {
          event.target.innerText = 'In Cart';
          event.target.disabled = true;

          //get product from products
          let cartItem = { ...Storage.getProduct(id), amout: 1 };
          //add product to the cart
          cart = [...cart, cartItem];
          //save cart in lcoal storage
          Storage.saveCart(cart);
          //set cart values
          this.setCartValues(cart);
          //dispay cart items
          this.addCartItem(cartItem);
          //show the cart
          this.showCart();
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amout;
      itemTotal += item.amout;
    });
    cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    cartItems.innerHTML = itemTotal;
  }
  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
         <img src=${item.image} alt="product" srcset=""  class="cart-item-img">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>${item.price}</h5>
                        <span class="remove-item" data-id = ${item.id}>Remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id = ${item.id}></i>
                        <p class="item-amount">${item.amout}</p>
                        <i class="fas fa-chevron-down" data-id = ${item.id}></i>
                    </div>
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }
  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }

  cartLogic() {
    //clear cart
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    
    cartContent.addEventListener('click',event=>{
        if(event.target.classList.contains('remove-item')){
            let  removeItem = event.target;
            let id = removeItem.dataset.id;
            cartContent.removeChild(removeItem.parentElement.parentElement);
            this.removeItem(id);
        }else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item=>item.id === id);
                tempItem.amout = tempItem.amout + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerHTML = tempItem.amout;
        }else if  (event.target.classList.contains('fa-chevron-down')){
            let lowAmout = event.target;
            let id = lowAmout.dataset.id;
              let tempItem = cart.find(item => item.id === id);
              tempItem.amout = tempItem.amout - 1;
              if(tempItem.amout>0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowAmout.previousElementSibling.innerHTML = tempItem.amout;

              }else{
                     cartContent.removeChild(
                       lowAmout.parentElement.parentElement
                     );
                     this.removeItem(id);
              }
            
        }
    })

  }
  // cart functionality


  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));

    while(cartContent.children.length>0){
        cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart"`;
  }

  getSingleButton(id){
      return bouttonDOM.find(button=>button.dataset.id === id);
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  //set up application
  ui.setupApp();
  // get all products
  products
    .getProduct()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
