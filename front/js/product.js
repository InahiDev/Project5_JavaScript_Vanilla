//Récupération de l'id depuis l'url
function getUrlParameterId() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const id = urlParams.get('id')
  return id
}

const id = getUrlParameterId()

//Récupération de la fiche produit depuis l'API avec l'id (verbe "GET" par défaut avec paramètre id)
async function getProductFromId(id) {
  return fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .catch((error) => console.log(error))
}

//Création d'une <img src="" alt=""/>
function createNewImage(src, alt) {
  let newImg = document.createElement('img')
  newImg.src = src
  newImg.alt = alt
  return newImg
}

//Création d'un élément (<div> / <span> / <p> / <h> / <section> / <article> / ...)
function createNewFlowElement(tagName, cssClass= "", textToInsert = "", id = "") {
  let newFlowElement = document.createElement(tagName)
  if (cssClass != "") {newFlowElement.classList.add(cssClass)}
  if (textToInsert != "") {newFlowElement.innerText = textToInsert}
  if (id != "") {newFlowElement.id = id}
  return newFlowElement
}


//Création d'<option value="value">value</option> 
function createNewOption(value) {
  let newOption = document.createElement("option")
  newOption.setAttribute("value", value)
  newOption.value = value
  newOption.innerText = value
  return newOption
}

//Création des éléments du DOM (<img src="product.imageUrl" alt="product.altTxt"/>) et remplissage des éléments déjà créés
function createProductPageFromObject(object) {
  const productImage = createNewImage(object.imageUrl, object.altTxt) //Création de l'<img/>
  const imageContainer = document.querySelector('.item__img')
  imageContainer.appendChild(productImage)
  document.getElementById('title').innerText = object.name  //Remplissage des éléments
  document.getElementById('price').innerText = (object.price / 100)
  document.getElementById('description').innerText = object.description
  for (let color of object.colors) {  //Création des <option>
    let newColor = createNewOption(color)
    document.getElementById('colors').appendChild(newColor)
  }
}

//Récupération de l'objet prodruit depuis son id, donné en paramètre à la fonction de création de la page
async function createProductPage() {
  const product = await getProductFromId(id)
  createProductPageFromObject(product)
}

createProductPage()

//------------------------------------------------------------------------//
//------------------Vérification des inputs Temps Réel--------------------//
//------------------------------------------------------------------------//

//Ajout d'un message d'erreur s'il n'existe pas déjà
function appendMsgIfDontExist(parent, child, cssSelector) {
  if (!parent.querySelector(cssSelector)) {
    parent.appendChild(child)
  }
}

//Suppression d'un message d'erreur si correction
function removeMsgIfExist(parent, cssSelector) {
  if(parent.querySelector(cssSelector)) {
    parent.removeChild(parent.querySelector(cssSelector))
  }
}

//Affichage d'un message d'erreur lors de la mauvaise saisie dans le <select>
function colorEventListener() {
  const colorSelector = document.getElementById('colors')
  let colorErrorMsg = createNewFlowElement("p", "colorErrorMsg", "Veuillez choisir une couleur de produit pour l'ajouter au panier.")
  colorSelector.addEventListener('change', () => {  //EventListener pour création d'un message d'erreur en cas de sélection
    if (colorSelector.value === "") {
      appendMsgIfDontExist(colorSelector.parentElement, colorErrorMsg, "p.colorErrorMsg")
    } else {
      removeMsgIfExist(colorSelector.parentElement, "p.colorErrorMsg")
    }
  })
}

//Remise à zéro de l'input et de son attribut "value"
function resetInputValueAttribute(input) {
  input.value = 0
  input.setAttribute('value', `${input.value}`)
}

//EventListener de l'<input> et affichage d'un message d'erreur adéquat
function quantityEventListener() {
  const quantity = document.getElementById('quantity')
  const quantityErrorMsg = createNewFlowElement("p", "quantityErrorMsg")
  quantity.addEventListener('change', () => {  //EventListener traitant les divers cas de valeurs saisies
    let qty = quantity.value
    if (qty == Number.isNaN(qty) && qty != "0") {  //Une lettre ou le cas 0 isNaN
      resetInputValueAttribute(quantity)
      const notANumberMsg = "Veuillez entrer un nombre s'il vous plait"
      quantityErrorMsg.innerText = notANumberMsg
      appendMsgIfDontExist(quantity.parentNode, quantityErrorMsg, "p.quantityErrorMsg")
      document.querySelector('p.quantityErrorMsg').innerText = notANumberMsg 
    } else if(qty == "0" || Number(qty) < 1) {
      resetInputValueAttribute(quantity)
      const lessThanZeroMsg = "La quantité minimale à ajouter au panier est de un (1)"
      quantityErrorMsg.innerText = lessThanZeroMsg
      appendMsgIfDontExist(quantity.parentNode, quantityErrorMsg, "p.quantityErrorMsg")
      document.querySelector('p.quantityErrorMsg').innerText = lessThanZeroMsg
    } else if (Number(qty) > 100) {
      resetInputValueAttribute(quantity)
      const moreThanHundredMsg = "La quantité maximale est de cent (100)"
      quantityErrorMsg.innerText = moreThanHundredMsg
      appendMsgIfDontExist(quantity.parentNode, quantityErrorMsg, "p.quantityErrorMsg")
      document.querySelector('p.quantityErrorMsg').innerText = moreThanHundredMsg
    } else if ((Number(qty) >= 1) && (Number(qty) <= 100)) {
      quantity.setAttribute('value', `${qty}`)
      removeMsgIfExist(quantity.parentNode, "p.quantityErrorMsg")
    }
  })
}

//Appel des EventListener
colorEventListener()
quantityEventListener()

//---------------------------------------------------------------------//
//----------Vérification des inputs avant création du cart-------------//
//---------------------------------------------------------------------//

//Vérification du <select>
function verifyColor() {
  const colorSelector = document.getElementById('colors')
  if(colorSelector.value !== "") {
    return colorSelector.value
  } else {
    return undefined
  }
}

//Vérification de l'<input>
function verifyQuantity() {
  const quantity = document.getElementById('quantity')
  if (quantity.value !== "0") {
    return Number(quantity.value)
  } else {
    return undefined
  }
}

//Comparaison des couleurs présentes dans le cart (incluse dans l'array), à la couleur de l'input actuellement sélectionnée (colorToFind)
function isColorInCart(array, colorToFind) {
  for (let object of array) {
    if(object.color === colorToFind) {
      return true
    }
  }
  return false
}

//Ajout d'un nouvel objet {color: ..., quantity: ...} au tableau idProduct
function addNewColorToArray(array, colorToAdd, quantityToAdd) {
  let newColorAdded = {
    color: colorToAdd,
    quantity: quantityToAdd
    }
  array.push(newColorAdded)
}

//Suppression du message si la quantité ajoutée au cart ne dépasse pas 100
function removeOverHundredMessage() {
  const itemContent = document.querySelector('.item__content')
  removeMsgIfExist(itemContent, "p.overHundred")
}

//Affichage et gestion d'un message d'erreur concernant les inputs avant ajout au cart
function displayErrorMessageForCartChange() {
  const button = document.getElementById('addToCart')
  button.addEventListener('click', () => {
    let colorSelected = verifyColor()
    let quantitySelected = verifyQuantity() 
      if ((colorSelected && quantitySelected) !== undefined) {
        removeMsgIfExist(document.querySelector('div.item__content'), "p.inputsError")
      } else {
        const inputsErrorMsgContent = "Veuillez vérifier la couleur et la quantité sélectionnées"
        let inputsErrorMsg = createNewFlowElement("p", "inputsError", inputsErrorMsgContent)
        inputsErrorMsg.setAttribute('style', 'text-align: center')
        appendMsgIfDontExist(document.querySelector('.item__content'), inputsErrorMsg, '.item__content > p.inputsError')
      }
  })
}

//Appel de l'EventListener message d'erreur
displayErrorMessageForCartChange()

//Création du cart
function createCart(colorSelected, quantitySelected) {
  let cart = {}
  cart[id] = []
  addNewColorToArray(cart[id], colorSelected, quantitySelected)
  removeOverHundredMessage()
  window.localStorage.setItem('cart', JSON.stringify(cart))
}

//Ajout d'une propriété (un idProduct) au cart
function addNewIdToExistingCart (cart, colorSelected, quantitySelected) {
  cart[id] = []
  addNewColorToArray(cart[id], colorSelected, quantitySelected)
  removeOverHundredMessage()
  window.localStorage.setItem('cart', JSON.stringify(cart))
}

//Ajout nouvelle couleur à la propriété idProduct trouvée dans le cart
function addNewColorToExistingIdInCart(cart, colorSelected, quantitySelected) {
  removeOverHundredMessage()
  addNewColorToArray(cart[id], colorSelected, quantitySelected)
  window.localStorage.setItem('cart', JSON.stringify(cart))
}

//Affichage d'un message si l'on dépasse 100 dans le cart
function displayOverHundredMessage() {
  const itemContent = document.querySelector('div.item__content')
    const overHundredErrorMsgContent = "Vous avez ajouté le nombre maximum d'exemplaire de cet article au panier!"
    let overHundredErrorMsg = createNewFlowElement("p", "overHundred", overHundredErrorMsgContent)
    overHundredErrorMsg.setAttribute('style', 'text-align: center')
    appendMsgIfDontExist(itemContent, overHundredErrorMsg, "p.overHundred") 
}


function findProduct(array, colorToFind) {
  let result = null
  for (let object of array) {
    if (object.color === colorToFind) {
      result = object
      break
    }
  }
  return result
}

//Modifier la quantité d'un produit dont la couleur existe déjà dans le cart, la maximiser à 100 si l'ajout fait dépasser
function modifyQtyInCart(product, quantitySelected, cart) {
  product.quantity = product.quantity + quantitySelected
  if (product.quantity > 100) { //Gestion du cas où la quantité dans le cart dépasserait la quantité maximale pouvant être commandée
    product.quantity = 100
    window.localStorage.setItem('cart', JSON.stringify(cart))
    displayOverHundredMessage() 
  } else {
    removeOverHundredMessage() 
    window.localStorage.setItem('cart', JSON.stringify(cart))
  }
}

//Création du cart dans le localStorage lors de l'appui sur "Ajouter au panier", Modification s'il existe déjà
function createCommandProductInLocalStorage() {
  const button = document.getElementById('addToCart')  
  button.addEventListener('click', () => {
    let colorSelected = verifyColor()
    let quantitySelected = verifyQuantity()
    if ((colorSelected && quantitySelected) !== undefined) {  //Création ou modification seulement si les inputs sont valides
      if (!window.localStorage.getItem('cart')) { //Le cart n'existe pas
        createCart(colorSelected, quantitySelected)
      } else {
        let cart = JSON.parse(window.localStorage.getItem('cart'))  //Récupérer le cart
          if (!cart.hasOwnProperty(id)) { //Le cart ne contient pas de produit dont l'idProduct correspond
            addNewIdToExistingCart(cart, colorSelected, quantitySelected)
          } else {
            let products = cart[id] //Récupérer le tableau d'objets correspondant à l'idProduct
            if (isColorInCart(products, colorSelected)) { //Comparaison des couleurs déjà présentes dans le cart à la couleur actuellement sélectionnée
              let product = findProduct(products, colorSelected)
              modifyQtyInCart(product, quantitySelected, cart)
            } else {  //La couleur du produit déja présent n'était pas dans le cart
            addNewColorToExistingIdInCart(cart, colorSelected, quantitySelected)
            }
        }    
      }
    }
  })
}

createCommandProductInLocalStorage()