const section = document.getElementById('cart__items')

async function getProductFromId(id) {
  return fetch(`http://localhost:3000/api/products/${id}`) //Récupération du produit correspondant à id
  .then((response) => response.json()) //Mise au format JSON de la réponse
}

async function getAllProducts() {
  return fetch(`http://localhost:3000/api/products`)
  .then((response) => response.json())
}

function createProductArticle(product, color, quantity) {
  let productId = product._id
  let productName = product.name
  let productImage = product.imageUrl
  let productPrice = product.price
  let productAltTxt = product.altTxt
  let newArticle = document.createElement('article')
  newArticle.classList.add('cart__item')
  newArticle.setAttribute('data-id', `${productId}`)
  newArticle.setAttribute('data-color', `${color}`)
  let newDivImg = document.createElement('div')
  newDivImg.classList.add('cart__item__img')
  let newImg = document.createElement('img')
  newImg.src = productImage
  newImg.alt = productAltTxt
  newDivImg.appendChild(newImg)
  let newDivContent = document.createElement('div')
  newDivContent.classList.add('cart__item__content')
  let newDivDescription = document.createElement('div')
  newDivDescription.classList.add('cart__item__content__description')
  let newName = document.createElement('h2')
  newName.innerText = productName
  let newColor = document.createElement('p')
  newColor.innerText = color
  let newPrice = document.createElement('p')
  newPrice.innerText = `${productPrice / 100}€`
  newDivDescription.appendChild(newName)
  newDivDescription.appendChild(newColor)
  newDivDescription.appendChild(newPrice)
  let newDivSettings = document.createElement('div')
  newDivSettings.classList.add('cart__item__content__settings')
  let newDivQuantity = document.createElement('div')
  newDivQuantity.classList.add('cart__item__content__settings__quantity')
  let newPQuantity = document.createElement('p')
  newPQuantity.innerText = "Qté : "
  let newInputQuantity = document.createElement('input')
  newInputQuantity.type = "number"
  newInputQuantity.classList.add('itemQuantity')
  newInputQuantity.name = "itemQuantity"
  newInputQuantity.min = "1"
  newInputQuantity.max = "100"
  newInputQuantity.setAttribute('value', `${quantity}`)
  newInputQuantity.value = quantity
  newDivQuantity.appendChild(newPQuantity)
  newDivQuantity.appendChild(newInputQuantity)
  let newDivDelete = document.createElement('div')
  newDivDelete.classList.add('cart__item__content__settings__delete')
  let newPDelete = document.createElement('p')
  newPDelete.innerText = "Supprimer"
  newDivDelete.appendChild(newPDelete)
  newDivSettings.appendChild(newDivQuantity)
  newDivSettings.appendChild(newDivDelete)
  newDivContent.appendChild(newDivDescription)
  newDivContent.appendChild(newDivSettings)
  newArticle.appendChild(newDivImg)
  newArticle.appendChild(newDivContent)
  section.appendChild(newArticle)
}

async function createArticlesFromCart() {
  let cart = JSON.parse(window.localStorage.getItem('cart'))
  let idsProducts = Object.getOwnPropertyNames(cart)
  let colorsInCart = Object.values(cart)
  for (let id of idsProducts) {
    let idIndex = idsProducts.indexOf(id)
    let product = await getProductFromId(id)
    let colorsAvailable = product.colors
    for (let colorsOrdered of colorsInCart) {
      let colorIndex = colorsInCart.indexOf(colorsOrdered)
      if (colorIndex == idIndex) {
        for (let colorOrdered of colorsOrdered) {
          if (colorOrdered.quantity != 0) {
            for (let colorAvailable of colorsAvailable) {
              if (colorOrdered.color == colorAvailable) {
                createProductArticle(product, colorOrdered.color, colorOrdered.quantity)
              }
            }
          }
        }
      }
    }
  }

}

function getTotalQuantity() {
  let inputsQuantity = document.querySelectorAll(".itemQuantity")
  let totalQuantity = 0
  for (let input of inputsQuantity) {
    totalQuantity = totalQuantity += Number(input.value)
    document.getElementById('totalQuantity').innerText = totalQuantity
  }
}

async function getTotalPrice() {
  let articlesInPage = document.querySelectorAll('#cart__items > article.cart__item')
  let totalPrice = 0
  for (let article of articlesInPage) {
    let numberOfArticles = Number(article.querySelector('.itemQuantity').value)
    let articleId = article.getAttribute('data-id')
    let product = await getProductFromId(articleId)
    let articlePrice = product.price
    totalPrice = totalPrice += Number(numberOfArticles *= articlePrice /100)
    document.getElementById('totalPrice').innerText = totalPrice.toFixed(2)
  }
}


function deleteArticle() {
  let deleteButtons = section.querySelectorAll('.cart__item__content__settings__delete > p')
  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', () => {
      let articleTargetDelete = deleteButton.closest('article.cart__item')
      let idArticleTarget = articleTargetDelete.getAttribute('data-id')
      let colorArticleTarget = articleTargetDelete.getAttribute('data-color')
      let cart = JSON.parse(window.localStorage.getItem('cart'))
      let productsTargetDelete = cart[idArticleTarget]
      for (let productTargetDelete of productsTargetDelete) {
        if (productTargetDelete.color == colorArticleTarget) {
          let indexOfTargetDelete = productsTargetDelete.indexOf(productTargetDelete)
          productsTargetDelete.splice(indexOfTargetDelete, 1)
          if (productsTargetDelete.length == 0) { //Cas où la suppression entraîne la suppression de la dernière couleur du produit
            delete cart[`${idArticleTarget}`]
          }
          window.localStorage.setItem('cart', JSON.stringify(cart))
          articleTargetDelete.parentNode.removeChild(articleTargetDelete)
        }
      }
      getTotalPrice()
      getTotalQuantity()
    })
  }
}


function verifyQuantity(quantityInput) {
  let errorMessageQuantity = document.createElement('p')  //Création d'un paragraphe contenant le futur message d'erreur
  errorMessageQuantity.classList.add('errorQuantity')
  let parentDiv = quantityInput.closest('div')
  if (quantityInput.value == Number.isNaN(quantityInput.value) && quantityInput.value != "0") {  //Si les données saisies ne sont pas un nombre et suppression de la particularité du cas Zéro du comportement de isNaN
      quantityInput.value = 0  //Mise de l'input à la valeur minimale
      errorMessageQuantity.innerText = "Veuillez entrer un nombre s'il vous plait"  
      if (!parentDiv.querySelector('p.errorQuantity')) {
      parentDiv.appendChild(errorMessageQuantity)  //Insertion du message d'erreur
      } else if (parentDiv.querySelector('p.errorQuantity')) {
        parentDiv.querySelector('p.errorQuantity').innerText = "Veuillez entrer un nombre s'il vous plait"
      }
    return console.error('not a number')
  } else if(quantityInput.value == "0" || Number(quantityInput.value) < 1) { //Traitement des cas où input <1 et traitement du cas spécifique ou le chiffre saisi est 0
      quantityInput.value = 0  //Mise de l'input à la valeur minimale
      errorMessageQuantity.innerText = "Pour supprimer l'article, appuyez sur «Supprimer»" 
      if (!parentDiv.querySelector('p.errorQuantity')) {
        parentDiv.appendChild(errorMessageQuantity)  //Insertion du message d'erreur
      } else if (parentDiv.querySelector('p.errorQuantity')) {
        parentDiv.querySelector('p.errorQuantity').innerText = "Pour supprimer l'article, appuyez sur «Supprimer»"
      }
      return console.error('0 or less')
  } else if (Number(quantityInput.value) > 100) {  //Traitement du cas où la quantité demandée est supérieure à 100
      quantityInput.value = 100 //Mise de l'input à la valeur par défaut
      errorMessageQuantity.innerText = "La quantité maximale à la commande est de cent (100)" 
      if (!parentDiv.querySelector('p.errorQuantity')){
        parentDiv.appendChild(errorMessageQuantity)  //Insertion du message d'erreur
      } else if (parentDiv.querySelector('p.errorQuantity')) {
        parentDiv.querySelector('p.errorQuantity').innerText = "La quantité maximale à la commande est de cent (100)"
      }
      return console.error('over 100')
  } else if ((Number(quantityInput.value) >= 1) && (Number(quantityInput.value) <= 100)) { //Cas où les données sont correctes
      quantityInput.setAttribute('value', quantityInput.value)
      if (parentDiv.querySelector('p.errorQuantity')) { //Cas où les données sont corrigées de la part de l'utilisateur 
        parentDiv.removeChild(parentDiv.querySelector('p.errorQuantity')) //Suppression du message d'erreur
      }
      return quantityInput.value
  }
}


function changeQuantity() {
  let quantityInputs = section.querySelectorAll('.cart__item__content__settings__quantity > input')
  for (let quantityInput of quantityInputs) {
    quantityInput.addEventListener('change', () => {
      verifyQuantity(quantityInput)
      getTotalPrice()
      getTotalQuantity()
      if (quantityInput.value >= 1 || quantityInput.value <= 100) {
        let articleTargetChange = quantityInput.closest('article.cart__item')
        let idArticleTarget = articleTargetChange.getAttribute('data-id')
        let colorArticleTarget = articleTargetChange.getAttribute('data-color')
        let cart = JSON.parse(window.localStorage.getItem('cart'))
        let productsTargetChange = cart[idArticleTarget]
        for (let productTargetChange of productsTargetChange) {
          if (productTargetChange.color == colorArticleTarget) {
            productTargetChange.quantity = quantityInput.value
            window.localStorage.setItem('cart', JSON.stringify(cart))
          }
        }
      }
    })
  }
}

async function manageCart() {
  await createArticlesFromCart()
  getTotalQuantity()
  getTotalPrice()
  deleteArticle()
  changeQuantity()
}

manageCart()
