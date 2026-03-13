// utils/cart.js

export function getCart(){
    let cart = localStorage.getItem("cart")
    if(cart == null){
        cart = []
        localStorage.setItem("cart",JSON.stringify(cart))
    }else{
        cart = JSON.parse(cart)
    }
    return cart
}

export function removeFromCart(productId){
    let cart = getCart();

    const newCart = cart.filter(
        (item)=>{
            return item.productId != productId;
        }
    )

    localStorage.setItem("cart", JSON.stringify(newCart))
    // Dispatch event so Header can update
    window.dispatchEvent(new Event('cartUpdated'))
}

export function addToCart(productId, qty){
    let cart = getCart()

    let index = cart.findIndex((item) => {
        return item.productId == productId.productId;
    })

    if(index == -1){
        cart[cart.length] = {
            productId : productId.productId,
            name : productId.name,
            image : productId.images[0],
            sellingPrice : productId.sellingPrice,
            labelledPrice : productId.labelledPrice,
            qty : qty
        }
    }else{
        const newQty = cart[index].qty + qty;
        if(newQty<=0){
            removeFromCart(productId.productId);
            return;
        }else{
            cart[index].qty = newQty;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    // Dispatch event so Header can update
    window.dispatchEvent(new Event('cartUpdated'))
}

export function getTotal(){
    let cart = getCart();
    let total = 0;

    for(let i=0; i<cart.length; i++){
        total += cart[i].sellingPrice * cart[i].qty;
    }

    return total
}

// NEW FUNCTION: Get total number of items in cart (sum of quantities)
export function getCartCount(){
    let cart = getCart();
    let count = 0;

    for(let i=0; i<cart.length; i++){
        count += cart[i].qty || 1; // Add quantity (default to 1 if not specified)
    }

    return count
}

// OPTIONAL: Clear entire cart
export function clearCart(){
    localStorage.setItem("cart", JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'))
}

// OPTIONAL: Update quantity directly
export function updateQuantity(productId, newQty){
    let cart = getCart();
    let index = cart.findIndex((item) => item.productId == productId);
    
    if(index !== -1){
        if(newQty <= 0){
            removeFromCart(productId);
        }else{
            cart[index].qty = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'))
        }
    }
}