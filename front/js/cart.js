async function getProductsArray() {
  return await fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
}

//let cart = {}


/*
function pushIdsAndColorsInCart(array) {
  let productId = array.
}*/

function returnIdOfProduct(index, array) {
  let product = array[index]
  let id = JSON.stringify(product._id)
  id = new Array(2)
}

function extractColors(array) {
  for (let color of array) {
    return color
  }
}

let cart = []

async function createCart() {
  const products = await getProductsArray()
  let cart = []
  for (let elem of products){
    let elemId = new Array(elem._id = new Array(elem.colors, quantity = 0))
    console.log(elemId)
    cart.push(elemId)
    console.log(cart)
  }
}
  


createCart()