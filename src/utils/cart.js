export function getCart(){
    let cart = localStorage.getItem("cart")
    cart = JSON.parse(cart)
    if(cart == null){
        cart = []
        localStorage.setItem("cart",JSON.stringify(cart))
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
}

