//Récupération de l'id depuis l'url
function getUrlParameterId() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const id = urlParams.get('id')
  return id
}

const id = getUrlParameterId()

//Récupération de la fiche produit depuis l'API avec l'id
async function getProductFromId(id) {
  return fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
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


//Création d'<option> 
function createNewOption(value) {
  let newOption = document.createElement("option")
  newOption.setAttribute("value", value)
  newOption.value = value
  newOption.innerText = value
  return newOption
}


function createProductPageFromObject(object) {
  const productImage = createNewImage(object.imageUrl, object.altTxt)
  const imageContainer = document.querySelector('.item__img')
  imageContainer.appendChild(productImage)
  document.getElementById('title').innerText = object.name
  document.getElementById('price').innerText = (object.price / 100)
  document.getElementById('description').innerText = object.description
  for (let color of object.colors) {
    let newColor = createNewOption(color)
    document.getElementById('colors').appendChild(newColor)
  }
}

async function createProductPage() {
  const product = await getProductFromId(id)  //Récupérer l'objet de l'API depuis son id stocké l.8
  createProductPageFromObject(product) //Utiliser l'objet récupéré de l'API pour remplir la page

}

createProductPage()

function verifyColor() {
  let colorSelector = document.getElementById('colors')
  colorSelector.addEventListener('change', () => {
    if (colorSelector.value === "" && !colorSelector.parentElement.querySelector('p')) {
      colorSelector.removeAttribute('value')
      let errorMessage = document.createElement('p')
      errorMessage.classList.add("colorError")
      errorMessage.innerText = "Veuillez choisir une couleur de produit pour l'ajouter au panier."
      colorSelector.parentElement.appendChild(errorMessage)
    } else if (colorSelector.value != "") {
      if (colorSelector.parentElement.querySelector('p.colorError')) {
        colorSelector.parentElement.removeChild(document.querySelector('.item__content__settings__color p.colorError'))
      }
    }
  })
  return colorSelector.value
}
verifyColor()

function verifyQuantity() {
  let quantity = document.getElementById('quantity')  //Sélection de l'input quantity
  let errorMessage = document.createElement('p')  //Création d'un paragraphe contenant le futur message d'erreur
  errorMessage.classList.add('errorQuantity')
  quantity.addEventListener('change', () => {  //Fonction traitant les divers cas de valeurs saisies
    if (quantity.value == Number.isNaN(quantity.value) && quantity.value != "0") {  //Si les données saisies ne sont pas un nombre et suppression de la particularité du cas Zéro du comportement de isNaN
      quantity.value = 0  //Mise de l'input à la valeur par défaut
      errorMessage.innerText = "Veuillez entrer un nombre s'il vous plait"  
      if (!document.querySelector('.item__content__settings__quantity p.errorQuantity')) {
      document.querySelector('.item__content__settings__quantity').appendChild(errorMessage)  //Insertion du message d'erreur
    } else if (document.querySelector('.item__content__settings__quantity p.errorQuantity')) {
      document.querySelector('.item__content__settings__quantity p.errorQuantity').innerText = "Veuillez entrer un nombre s'il vous plait" 
    }
    return console.error('not a number')
    } else if(quantity.value == "0" || Number(quantity.value) < 1) { //Traitement des cas où input <1 et traitement du cas spécifique ou le chiffre saisi est 0
      quantity.value = 0  //Mise de l'input à la valeur par défaut
      errorMessage.innerText = "La quantité minimale à ajouter au panier est de un (1)" 
      if (!document.querySelector('.item__content__settings__quantity p.errorQuantity')) {
        document.querySelector('.item__content__settings__quantity').appendChild(errorMessage)  //Insertion du message d'erreur
      } else if (document.querySelector('.item__content__settings__quantity p.errorQuantity')) {
        document.querySelector('.item__content__settings__quantity p.errorQuantity').innerText = "La quantité minimale à ajouter au panier est de un (1)"
      }
      return console.error('0 or less')
    } else if (Number(quantity.value) > 100) {  //Traitement du cas où la quantité demandée est supérieure à 100
      quantity.value = 0 //Mise de l'input à la valeur par défaut
      errorMessage.innerText = "La quantité maximale est de cent (100)" 
      if (!document.querySelector('.item__content__settings__quantity p.errorQuantity')){
        document.querySelector('.item__content__settings__quantity').appendChild(errorMessage)  //Insertion du message d'erreur
      } else if (document.querySelector('.item__content__settings__quantity p.errorQuantity')) {
        document.querySelector('.item__content__settings__quantity p.errorQuantity').innerText = "La quantité maximale est de cent (100)"
      }
      return console.error('over 100')
    } else if ((Number(quantity.value) >= 1) && (Number(quantity.value) <= 100)) { //Cas où les données sont correctes
      document.getElementById('quantity').setAttribute('value', `${quantity.value}`)
      if(document.querySelector('.item__content__settings__quantity p.errorQuantity')) { //Cas où les données sont corrigées de la part de l'utilisateur 
        document.querySelector('.item__content__settings__quantity').removeChild(document.querySelector('.item__content__settings__quantity p.errorQuantity')) //Suppression du message d'erreur
      }
      return quantity.value
    }
  })
  return Number(quantity.value)
}

verifyQuantity()

function isColorInCart(array = [], colorToFind) {
  for (let object of array) {
    if(object.color == colorToFind) {
      return true
    }
  }
  return false
}

function removeOverHundredMessage() {
  if (document.querySelector('.item__content > p.overHundred')) {
    document.querySelector('.item__content').removeChild(document.querySelector('p.overHundred'))
  }
}

function addNewColorToArray(array, colorToAdd, quantityToAdd) {
  let newColorAdded = {
    color: colorToAdd,
    quantity: quantityToAdd
  }
  array.push(newColorAdded)
}

function createCommandProductInLocalStorage() {
  let button = document.getElementById('addToCart')  
  button.addEventListener('click', () => {
    let colorSelected = verifyColor()
    let quantitySelected = verifyQuantity()
    if ((colorSelected != "") && ((quantitySelected >= 1) && (quantitySelected <= 100))) {
      if (!window.localStorage.getItem('cart')) {
        let cart = {}
        cart[id] = []
        addNewColorToArray(cart[id], colorSelected, quantitySelected)
        removeOverHundredMessage()
        window.localStorage.setItem('cart', JSON.stringify(cart))
      } else if (window.localStorage.getItem('cart')) {
        let cart = JSON.parse(window.localStorage.getItem('cart'))
        if (!cart.hasOwnProperty(id)) {
          cart[id] = []
          addNewColorToArray(cart[id], colorSelected, quantitySelected)
          removeOverHundredMessage()
          window.localStorage.setItem('cart', JSON.stringify(cart))
        } else if (cart.hasOwnProperty(id)) {
          let products = cart[id]
          if (isColorInCart(products, colorSelected)) {
            for (let product of products) {
              if (product.color === colorSelected) {
                product.quantity = product.quantity + quantitySelected
                  if (product.quantity > 100) {
                    product.quantity = 100
                    let overHundredErrorMessage = document.createElement('p')
                    overHundredErrorMessage.innerText = "Vous avez ajouté le nombre maximum d'exemplaire de cet article au panier!"
                    overHundredErrorMessage.classList.add('overHundred')
                    overHundredErrorMessage.setAttribute('style', 'text-align: center')
                      if (!document.querySelector('div.item__content > p.overHundred')) {
                        document.querySelector('div.item__content').appendChild(overHundredErrorMessage)
                      }
                  } else removeOverHundredMessage() 
                window.localStorage.setItem('cart', JSON.stringify(cart))
              }
            }
          } else {
            addNewColorToArray(cart[id], colorSelected, quantitySelected)
            window.localStorage.setItem('cart', JSON.stringify(cart))
          }
        }    
      }
      if (document.querySelector('.item__content > p.inputsError')) {
        let divItemContent = document.querySelector('div.item__content')
        divItemContent.removeChild(document.querySelector('div.item__content > p.inputsError'))
      }
    } else {
    let addErrorMessage = document.createElement('p')
    addErrorMessage.innerText = "Veuillez vérifier la couleur et la quantité sélectionnées"
    addErrorMessage.classList.add('inputsError')
    addErrorMessage.setAttribute('style', 'text-align: center')
      if (!document.querySelector('.item__content > p.inputsError')) {
        document.querySelector('.item__content').appendChild(addErrorMessage)
      }
    }
  })
}

createCommandProductInLocalStorage()