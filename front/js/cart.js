const section = document.getElementById('cart__items')

async function getProductFromId(id) {
  return fetch(`http://localhost:3000/api/products/${id}`) //Récupération du produit correspondant à id
  .then((response) => response.json()) //Mise au format JSON de la réponse
  .catch((error) => console.log(error))
}

async function getAllProducts() {
  return fetch(`http://localhost:3000/api/products`)
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

//Création d'un élément (div / span / p / h / section / article)
function createNewFlowElement(tagName, cssClass= "", textToInsert = "", id = "") {
  let newFlowElement = document.createElement(tagName)
  if (cssClass != "") {newFlowElement.classList.add(cssClass)}
  if (textToInsert != "") {newFlowElement.innerText = textToInsert}
  if (id != "") {newFlowElement.id = id}
  return newFlowElement
}

//Création d'un <article> spécifique possédant les attributs data-id & data-color
function createNewArticle(cssClass = "", dataId = "", dataColor = "") {
  let newArticle = document.createElement("article")
  if (cssClass != "") {newArticle.classList.add(cssClass)}
  if (dataId != "") {newArticle.setAttribute('data-id', `${dataId}`)}
  if (dataColor != "") {newArticle.setAttribute('data-color', `${dataColor}`)}
  return newArticle
}

//Création d'un <a></a> sans texte (<a> englobant une card par exemple)
function createNewLink(href) {
  let newLink = document.createElement("a")
  newLink.href = href
  return newLink
}

//Création d'<input> 
function createNewInput(type, cssClass, name, value = 0, min = 1, max = 100, id = "") {
  let newInput = document.createElement("input")
  newInput.type = type
  newInput.setAttribute("value", value)
  newInput.value = value
  newInput.min = min
  newInput.max = max
  if (id != undefined) {newInput.id = id}
  if (cssClass != undefined) {newInput.classList.add(cssClass)}
  if (name != undefined) {newInput.name = name}
  return newInput
}

//Création de la div container de Img pour l'article du cart
function createDivImg(product) {
  let newDivImg = createNewFlowElement("div", "cart__item__img")
  let newImg = createNewImage(product.imageUrl, product.altTxt)
  newDivImg.appendChild(newImg)
  return newDivImg
}

//Création de la div Description pour l'article du cart
function createDivDescription(product, color) {
  let newDivDescription = createNewFlowElement("div", "cart__item__content__description")
  let newName = createNewFlowElement("h2", undefined, product.name)
  let newColor = createNewFlowElement("p", undefined, color)
  let newPrice = createNewFlowElement("p", undefined, `${product.price/100}€`)
  newDivDescription.appendChild(newName)
  newDivDescription.appendChild(newColor)
  newDivDescription.appendChild(newPrice)
  return newDivDescription
}

//Création de la div Quantity pour l'article du cart
function createDivQuantity(quantity) {
  let newDivQuantity = createNewFlowElement("div", "cart__item__content__settings__quantity")
  let newPQuantity = createNewFlowElement("p", undefined, "Qté : ")
  let newInputQuantity = createNewInput("number", "itemQuantity", "itemQuantity", quantity)
  newDivQuantity.appendChild(newPQuantity)
  newDivQuantity.appendChild(newInputQuantity)
  return newDivQuantity
}

//Création de la div Delete pour l'article du cart
function createDivDelete() {
  let newDivDelete = createNewFlowElement("div", "cart__item__content__settings__delete")
  let newPDelete = createNewFlowElement("p", undefined, "Supprimer")
  newDivDelete.appendChild(newPDelete)
  return newDivDelete
}

//Création de l'article du cart
function createProductArticle(product, color, quantity) {
  let newArticle = createNewArticle("cart__item", product._id, color)
  let newDivImg = createDivImg(product)
  let newDivContent = createNewFlowElement("div", "cart__item__content")
  let newDivDescription = createDivDescription(product, color)
  let newDivSettings = createNewFlowElement("div", "cart__item__content__settings")
  let newDivQuantity = createDivQuantity(quantity)
  let newDivDelete = createDivDelete()
  newDivSettings.appendChild(newDivQuantity)
  newDivSettings.appendChild(newDivDelete)
  newDivContent.appendChild(newDivDescription)
  newDivContent.appendChild(newDivSettings)
  newArticle.appendChild(newDivImg)
  newArticle.appendChild(newDivContent)
  section.appendChild(newArticle)
}

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

//Récupération des infos du cart et des infos produits de l'API, comparaison croisée pour créer un unique article par couleur
async function createArticlesFromCart() {
  if (window.localStorage.getItem('cart')) {
    let cart = JSON.parse(window.localStorage.getItem('cart'))    //Récupération des infos du cart
    let idsProducts = Object.getOwnPropertyNames(cart)  //Récupération des ids stockées dans le cart
    let colorsInCart = Object.values(cart)  //Récupération des couleurs sélectionnées et stockées
    for (let id of idsProducts) {
      let idIndex = idsProducts.indexOf(id) //Premier index de comparaison
      let product = await getProductFromId(id)  //Récupération des infos de l'API pour remplir les articles
      let colorsAvailable = product.colors  
      for (let colorsOrdered of colorsInCart) {
        let colorIndex = colorsInCart.indexOf(colorsOrdered) //Second index de comparaison
        if (colorIndex == idIndex) {  //Il s'agit bien du même produit dans les deux tableaux
          for (let colorOrdered of colorsOrdered) {
            for (let colorAvailable of colorsAvailable) {
              if (colorOrdered.color == colorAvailable) { //La couleur dans la fiche produit a été retrouvée dans le cart => création d'un <article>
                createProductArticle(product, colorOrdered.color, colorOrdered.quantity)
              }
            }
          }
        }
      }
    }
  }
}

//Récupération de toutes les values des itemQuantity
function getTotalQuantity() {
  let inputsQuantity = document.querySelectorAll(".itemQuantity")
  let totalQuantity = 0
  for (let input of inputsQuantity) {
    totalQuantity = totalQuantity += Number(input.value)  //Ajout à chaque itération de .itemQuantity.value
    document.getElementById('totalQuantity').innerText = totalQuantity
  }
}

//Récupération pour chaque <article> des value de itemQuantity et récupération du prix depuis l'API
async function getTotalPrice() {
  let articlesInPage = document.querySelectorAll('#cart__items > article.cart__item')
  let totalPrice = 0
  for (let article of articlesInPage) {
    let numberOfArticles = Number(article.querySelector('.itemQuantity').value)
    let articleId = article.getAttribute('data-id') //Récupération idProduct stored dans le data-id de article
    let product = await getProductFromId(articleId)
    let articlePrice = product.price  //Récupération du prix depuis l'API
    totalPrice = totalPrice += Number(numberOfArticles *= articlePrice /100)
    document.getElementById('totalPrice').innerText = totalPrice.toFixed(2) //Fixation de la fraction au centime
  }
}

//Suppression de l'article en appuyant sur le <p>Supprimer</p>
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
      getTotalPrice() //Recalcul à chaque suppression
      getTotalQuantity()  //Recalcul à chaque suppression
    })
  }
}

//Vérification des données entrées dans les inputs type="number"
function verifyQuantity(quantityInput) {
  let errorQuantityMsg = createNewFlowElement ("p", "errorQuantity")
  let parentDiv = quantityInput.closest('div')
    if (quantityInput.value == Number.isNaN(quantityInput.value) && quantityInput.value != "0") {  //Si les données saisies ne sont pas un nombre et suppression de la particularité du cas Zéro du comportement de isNaN
      quantityInput.value = 0  //Mise de l'input à la valeur minimale
      const notANumber = "Veuillez entrer un nombre s'il vous plait"
      errorQuantityMsg.innerText = notANumber  
      appendMsgIfDontExist(parentDiv, errorQuantityMsg, "p.errorQuantity")
      parentDiv.querySelector('p.errorQuantity').innerText = notANumber
  } else if(quantityInput.value == "0" || Number(quantityInput.value) < 1) { //Traitement des cas où input <1 et traitement du cas spécifique ou le chiffre saisi est 0
      quantityInput.value = 0  //Mise de l'input à la valeur minimale
      const underZero = "Pour supprimer l'article, appuyez sur «Supprimer»"
      errorQuantityMsg.innerText = underZero
      appendMsgIfDontExist(parentDiv, errorQuantityMsg, "p.errorQuantity")
      parentDiv.querySelector('p.errorQuantity').innerText = underZero
  } else if (Number(quantityInput.value) > 100) {  //Traitement du cas où la quantité demandée est supérieure à 100
      quantityInput.value = 100 //Mise de l'input à la valeur maximale
      const overHundred = "La quantité maximale à la commande est de cent (100)"
      errorQuantityMsg.innerText = overHundred 
      appendMsgIfDontExist(parentDiv, errorQuantityMsg, "p.errorQuantity")
      parentDiv.querySelector('p.errorQuantity').innerText = "La quantité maximale à la commande est de cent (100)"
  } else if ((Number(quantityInput.value) >= 1) && (Number(quantityInput.value) <= 100)) { //Cas où les données sont correctes
      quantityInput.setAttribute('value', quantityInput.value)
      removeMsgIfExist(parentDiv, "p.errorQuantity")
      return quantityInput.value
  }
}

//Monitoring des changements de valeurs des inputs quantité
function changeQuantity() {
  let quantityInputs = section.querySelectorAll('.cart__item__content__settings__quantity > input')
  for (let quantityInput of quantityInputs) {
    quantityInput.addEventListener('change', () => {
      verifyQuantity(quantityInput)
      getTotalPrice() //Recalcul à chaque modification
      getTotalQuantity()  //Recalcul à chaque modification
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

//Fonction de gestion du cart, créant le cart, faisant les deux totaux et gérant la suppression ou la modification
async function manageCart() {
  await createArticlesFromCart()
  getTotalQuantity()
  getTotalPrice()
  deleteArticle()
  changeQuantity()
}

manageCart()

//---------------------------------------------------------------------//
//----------------------------Regex------------------------------------//
//---------------------------------------------------------------------//
const formContact = document.querySelector('form.cart__order__form')

const nameRegex = /([A-Z]{1}[a-zéèàç]+){1,}([\S\-\1])*/
const nameRegex2 = /^([A-Z]{1}([a-zéèàçù][\D])*\b){1,}([\S\-]{1}(([A-Z]{1}([a-zéèàçù][\D])+))*\b)*$/
const nameRegex3 = /^([A-Z]{1}[a-zéèàç]+){1}\b(([\D][\S\-\1]))*$/
const nameRegex4 = /^([A-Z]{1}[a-zéèàçù-]+){1}\b$/
const nameRegex5 = /^(([A-Z]{1}([a-zâäëéèàùçï]+))([-][A-Z]{1}([a-zâäëéèàùçï]+))*){1}$/

const addressRegex = /([0-9]{1,4})\ {1}([^\t\n\r][a-zéèàçùA-Z0-9\s\-\,\.]+)$/

const cityRegex = /([0-9]{5}){1}\s([A-Z]{1}[a-zéèàçù\s-]+){1,}$/

const emailRegex = /([a-z]+[0-9]*[a-z0-9.\-_]+)+@([a-z]{1,}).([a-z]{1,})$/i

const emailRegex2 = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

//----------------------------------------------------------------------//
//--------------------Validation par les Regex--------------------------//
//----------------------------------------------------------------------//

function isValidAlphabetical(inputValue) {
  return nameRegex5.test(inputValue)
}

function isValidAddress(inputValue) {
  return addressRegex.test(inputValue)
}

function isValidCity(inputValue) {
  return cityRegex.test(inputValue)
}

function isValidEmail(inputValue) {
  return emailRegex2.test(inputValue)
}

//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//

//Vérification de l'input Prénom. Si incorrect, retourne "undefined"
function verifyFirstName() {
  let firstNameInput = document.getElementById('firstName')
  if (isValidAlphabetical(firstNameInput.value)) {
    return firstNameInput.value
  } else {
    return undefined
  }
}

//Affichage d'un message d'erreur pour l'<input> Prénom
function firstNameEventListener() {
  let firstNameInput = document.getElementById('firstName')
  let firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
  firstNameInput.addEventListener("change", () => { //EventListener pour affichage du message d'erreur et correction
    if (isValidAlphabetical(firstNameInput.value)) {
      if (firstNameErrorMsg.innerText !== "") {
        firstNameErrorMsg.innerText = ""
      }
    } else {
      if (firstNameErrorMsg.innerText === "") {
        firstNameErrorMsg.innerText = "Votre prénom doit commencer par une majuscule et ne contenir que des lettres (prénoms composés autorisés avec - , chaque prénom commençant par une majuscule exemple: Louis-Gabriel)"
      }
    }
  })
}

//Vérification de l'input Nom. Si incorrect return "undefined"
function verifyLastName() {
  let lastNameInput = document.getElementById('lastName')
  if (isValidAlphabetical(lastNameInput.value)) {
    return lastNameInput.value
  } else {
    return undefined
  }
}

//Affichage d'un message d'erreur pour l'<input> Nom
function lastNameEventListener() {
  let lastNameInput = document.getElementById('lastName')
  let lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
  lastNameInput.addEventListener("change", () => {  //EventListener pour affichage du message d'erreur et correction
    if (isValidAlphabetical(lastNameInput.value)) {
      if (lastNameErrorMsg.innerText !== "") {
        lastNameErrorMsg.innerText = ""
      }
    } else {
      if(lastNameErrorMsg.innerText === "") {
        lastNameErrorMsg.innerText = "Votre nom de famille doit commencer par une majuscule (noms composés autorisés)"
      }
    }
  })
}

//Vérification de l'input Adresse. Si incorrect return "undefined"
function verifyAddress() {
  let addressInput = document.getElementById('address')
  if (isValidAddress(addressInput.value)) {
    return addressInput.value
  } else {
    return undefined
  }
}

//Affichage d'un message d'erreur pour l'<input> Adresse
function addressEventListener() {
  let addressInput = document.getElementById('address')
  let addressErrorMsg = document.getElementById('addressErrorMsg')
  addressInput.addEventListener('change', () => { 
    if (isValidAddress(addressInput.value)) {
      if (addressErrorMsg.innerText !== "") {
        addressErrorMsg.innerText = ""
      }
    } else {
      if (addressErrorMsg.innerText === "") {
        addressErrorMsg.innerText = "Votre adresse doit commencer par votre n° suivi du nom de la voie"
      }
    }
  })
}

//Vérification de l'input Ville. Si incorrect return "undefined"
function verifyCity() {
  let cityInput = document.getElementById('city')
  if (isValidCity(cityInput.value)) {
    return cityInput.value
  } else {
    return undefined
  }
}

//Affichage d'un message d'erreur pour l'<input> City
function cityEventListener() {
  let cityInput = document.getElementById('city')
  let cityErrorMsg = document.getElementById('cityErrorMsg')
  cityInput.addEventListener('change', () => {
    if (isValidCity(cityInput.value)) {
      if (cityErrorMsg.innerText !== "") {
        cityErrorMsg.innerText = ""
      }
    } else {
      if (cityErrorMsg.innerText === "") {
        cityErrorMsg.innerText = "Veuillez indiquer d'abord votre code postal à 5 chiffres suivi d'un espace et du nom de votre ville commençant par une majuscule"
      }
    }
  })
}

//Vérification de l'input Email. Si incorrect return "undefined"
function verifyEmail() {
  let emailInput = document.getElementById('email')
  if (isValidEmail(emailInput.value)) {
    return emailInput.value
  } else {
    return undefined
  }
}

//Affichage d'un message d'erreur pour l'<input> Email
function emailEventListener() {
  let emailInput = document.getElementById('email')
  let emailErrorMsg = document.getElementById('emailErrorMsg')
  emailInput.addEventListener('change', () => {
    if (isValidEmail(emailInput.value)) {
      if (emailErrorMsg.innerText != "") {
        emailErrorMsg.innerText = ""
      }
    } else {
      if (emailErrorMsg.innerText == "") {
        emailErrorMsg.innerText = "Veuillez entrer une adresse mail conforme (example@messagerie.domaine, example.example2@messagerie.domaine)"
      }  
    }
  })
}

//-------------------------------------------------------------------------//
//-----------------------Appel des EventListener---------------------------//
//-------------------------------------------------------------------------//

firstNameEventListener()
lastNameEventListener()
addressEventListener()
cityEventListener()
emailEventListener()

//-------------------------------------------------------------------//
//------------Création de l'objet pour méthode "POST"----------------//
//-------------------------------------------------------------------//

//Création du tableau products pour la méthode "POST"
function getOrder() {
  let articlesToOrder =  section.querySelectorAll("article.cart__item")
  let articlesIdToOrder = []
  for (let articleToOrder of articlesToOrder) {
    let articleQuantityInputValue = articleToOrder.querySelector("div.cart__item__content__settings__quantity > input").value
    let articlePageId = articleToOrder.getAttribute('data-id')
    if ((!articlesIdToOrder.includes(articlePageId)) /*L'id n'est pas déjà présente dans le tableau*/ && articleQuantityInputValue > 0/*L'input n'est pas à zéro*/) {  //Choix personnel quant à la non-suppression d'un article dont l'input est à zéro
      articlesIdToOrder.push(articlePageId)
    }
  }
  if (articlesIdToOrder.length > 0) { //Si les conditions sont respectées et que le tableau n'est pas vide, le retourner
    return articlesIdToOrder
  } else {
    return undefined
  }
}

//Création de l'objet contact pour la méthode "Post"
function createContact() {
  let firstName = verifyFirstName()  //Vérification de tous les inputs de contact
  let lastName = verifyLastName()
  let address = verifyAddress()
  let city = verifyCity()
  let email = verifyEmail()
  if ((firstName && lastName && address && city && email) != undefined) { //newUser n'est créé que si tous les champs sont correctement remplis (vérifiés par les Regex)
    let newUser = {firstName, lastName, address, city, email}
    return newUser
  } else {
    return undefined
  }
}


//Création de la commande order: {contact:{...}, products:[...]}
function createCartOrder() {
  let articlesOrdered = getOrder()
  let user = createContact()
  if ((user && articlesOrdered) != undefined) { //Si le contact a été crée et qu'il y a des articles dans le panier
    let order = {
      contact: user,
      products: []
    }
    for (let article of articlesOrdered) {
      order.products.push(article)
    }
    return order
  } else {
    return undefined
  }
}

//Fonction fetch "POST" de l'objet order et récupération de l'orderId
async function getOrderId(order) {
  return fetch(`http://localhost:3000/api/products/order`, {
    method: "POST",
    headers: {
      "Accept": 'application/json',
      "Content-Type": "application/json"
    },
    body: order
  })
  .then((response) => response.json())
  .catch((error) => console.log(error))
}

//Fonction d'envoi du formulaire uniquement si les conditions sont toutes remplies
function sendCartOrder() {
  let commandButton = document.getElementById("order")
  const formParent = commandButton.closest('form')
  commandButton.addEventListener('click', async (event) => {
    event.preventDefault()
    if (createCartOrder() != undefined) { //Vérification de l'objet à envoyer à l'API (suivant la vérification des inputs de contact et du cart)
      let order = JSON.stringify(createCartOrder())
      let orderComplete = await getOrderId(order)
      let orderId = orderComplete.orderId //Récupération de l'orderId
      removeMsgIfExist(formParent, "p.sendErrorMsg")
      window.localStorage.removeItem('cart')  //Suppression du cart une fois la commande envoyée
      window.location.replace(`./confirmation.html?order-id=${orderId}`)  //Redirection vers la page confirmation avec une URLParamsRequest
    } else {  //Gestion du non-envoi du formulaire si toutes les conditions ne sont pas respectées
      let sendErrorMsg = createNewFlowElement("p", "sendErrorMsg", "Veuillez vérifier que votre panier n'est pas vide et que vos informations de contact sont correctes!")
      sendErrorMsg.setAttribute('style', 'text-align: center')
      appendMsgIfDontExist(formParent, sendErrorMsg, "p.sendErrorMsg")
    }
  })
}

sendCartOrder()