function getUrlParameterId() {
  const queryString = window.location.search  //récupérer la string glissée dans l'url de la page
  const urlParams = new URLSearchParams(queryString)  //Définir la string comme paramètre de rechercher url
  const id = urlParams.get('id')  //Récupérer l'id dans les paramètres url
  return id //Renvoyer uniquement l'id
}

const id = getUrlParameterId() //Stocker l'id dans une constante au travers de tout le code

async function getProductFromId(id) {
  return fetch(`http://localhost:3000/api/products/${id}`) //Récupération du produit correspondant à id
  .then((response) => response.json()) //Mise au format JSON de la réponse
}

function createProductPageFromArray(object) {
  const productImage = document.createElement('img') //Création de la balise Img
  productImage.src = object.imageUrl //Définition de l'attribut src de la balise img
  productImage.alt = object.altText  //Définiition de l'attribut alt de la balise img
  const imageContainer = document.querySelector('.item__img') //Identification du parent de la balise img dans le DOM
  imageContainer.appendChild(productImage)  //Insertion de la balise img dans le DOM
  const productName = object.name  //Récupération du nom produit
  document.querySelector('title').innerText = productName
  document.getElementById('title').innerText = productName  //Insertion du nom produit dans la balise cible
  const productPrice = object.price  //Définition du prix produit
  document.getElementById('price').innerText =productPrice  //Insertion du prix produit dans la balise cible
  const productDescription = object.description  //Récupération de la description produit
  document.getElementById('description').innerText = productDescription  //Insertion de la description produit dans la balise cible
  for (let color of object.colors) { //Pour chaque ligne du tableau object.colors (Une ligne = Une couleur)
    let newColor = document.createElement('option') //Création d'une balise option
    newColor.setAttribute('value', `${color}`)  //Définition de son attribut value au nom de la couleur
    newColor.innerText = color  //Insertion du nom de la couleur dans la balise option
    document.getElementById('colors').appendChild(newColor) //Insertion de la balise option dans le DOM
  }
  
} 

async function createProductPage() {
  const product = await getProductFromId(id)  //Récupérer l'objet de l'API depuis son id stocké l.8
  createProductPageFromArray(product) //Utiliser l'objet récupéré de l'API pour remplir la page

}

createProductPage()


/*// Lorsque je change à l'intérieur du select et que je choisis une option, le select.value prend la valeur de l'option sélectionnée.
async function addSelectedToColorOption() {
  await getProductFromId(id)  //Attendre d'obtenir la liste des options
  let selection = document.getElementById('colors') //Cibler la liste d'options
  let options = selection.querySelectorAll('option')  //Faire une liste de toutes les options
  selection.addEventListener('change', function() { //Quand la couleur sélectionnée change
    let index = selection.selectedIndex //Récupérer l'index de l'option sélectionné
    for (let option of options) { //Effacer tous les attributs selected
      option.removeAttribute('selected')
      }
    if (index == 0) {}  //Si c'est l'option "--SVP, choisissez une couleur", ne rien faire
    else {
    options[index].setAttribute('selected', 'selected') //Sinon attribuer le selected à la couleur sélectionnée via son index
      }
    })
}

addSelectedToColorOption()*/

function verifyColor() {
  let colorSelector = document.getElementById('colors')
  colorSelector.addEventListener('change', () => {
    if (colorSelector.value === "" && !colorSelector.parentElement.querySelector('p')) {
      colorSelector.removeAttribute('value')
      let errorMessage = document.createElement('p')
      errorMessage.innerText = "Veuillez choisir une couleur de produit pour l'ajouter au panier."
      colorSelector.parentElement.appendChild(errorMessage)
    } else if (colorSelector.value != "") {
      if (colorSelector.parentElement.querySelector('p')) {
        colorSelector.parentElement.removeChild(document.querySelector('.item__content__settings__color p:last-child'))
      }
    }
  })
  return colorSelector.value
}
verifyColor()

function verifyQuantity() {
  let quantity = document.getElementById('quantity')  //Sélection de l'input quantity
  let errorMessage = document.createElement('p')  //Création d'un paragraphe contenant le futur message d'erreur
  quantity.addEventListener('change', () => {  //Fonction traitant les divers cas de valeurs saisies
    if (quantity.value == Number.isNaN(quantity.value) && quantity.value != "0") {  //Si les données saisies ne sont pas un nombre et suppression de la particularité du cas Zéro du comportement de isNaN
      quantity.value = 0  //Mise de l'input à la valeur par défaut
      errorMessage.innerText = "Veuillez entrer un nombre s'il vous plait"  
      if (!document.querySelector('.item__content__settings__quantity p')) {
      document.querySelector('.item__content__settings__quantity').appendChild(errorMessage)  //Insertion du message d'erreur
    }
    return console.error('not a number')
    } else if(quantity.value == "0" || Number(quantity.value) < 1) { //Traitement des cas où input <1 et traitement du cas spécifique ou le chiffre saisi est 0
      quantity.value = 0  //Mise de l'input à la valeur par défaut
      errorMessage.innerText = "La quantité minimale à ajouter au panier est de un (1)" 
      if (!document.querySelector('.item__content__settings__quantity p')) {
        document.querySelector('.item__content__settings__quantity').appendChild(errorMessage)  //Insertion du message d'erreur
      }
      return console.error('0 or less')
    } else if (Number(quantity.value) > 100) {  //Traitement du cas où la quantité demandée est supérieure à 100
      quantity.value = 0 //Mise de l'input à la valeur par défaut
      errorMessage.innerText = "La quantité maximale est de cent (100)" 
      if (!document.querySelector('.item__content__settings__quantity p')){
        document.querySelector('.item__content__settings__quantity').appendChild(errorMessage)  //Insertion du message d'erreur
      }
      return console.error('over 100')
    } else if ((Number(quantity.value) >= 1) && (Number(quantity.value) <= 100)) { //Cas où les données sont correctes
      document.getElementById('quantity').setAttribute('value', `${quantity.value}`)
      if(document.querySelector('.item__content__settings__quantity p:last-child')) { //Cas où les données sont corrigées de la part de l'utilisateur 
        document.querySelector('.item__content__settings__quantity').removeChild(document.querySelector('.item__content__settings__quantity p:last-child')) //Suppression du message d'erreur
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




function createCommandProductInLocalStorage() {
  let button = document.getElementById('addToCart')  
  button.addEventListener('click', () => {
    let colorSelected = verifyColor()
    let quantitySelected = verifyQuantity()
    if ((colorSelected != "") && ((quantitySelected >= 1) && (quantitySelected <= 100))) {
      if (!window.localStorage.getItem('cart')) {
        let cart = {}
        cart[id] = []
        let newColorAdded = {
          color: colorSelected,
          quantity: quantitySelected
        }
        cart[id].push(newColorAdded)
        window.localStorage.setItem('cart', JSON.stringify(cart))
      } else if (window.localStorage.getItem('cart')) {
        let cart = JSON.parse(window.localStorage.getItem('cart'))
        if (!cart.hasOwnProperty(id)) {
          cart[id] = []
          let newColorAdded = {
            color: colorSelected,
            quantity: quantitySelected
          }
          cart[id].push(newColorAdded)
          window.localStorage.setItem('cart', JSON.stringify(cart))
        } else if (cart.hasOwnProperty(id)) {
          let products = cart[id]
          console.log(products)
          if (isColorInCart(products, colorSelected)) {
            for (let product of products) {
              if (product.color === colorSelected) {
                product.quantity = product.quantity + quantitySelected
                window.localStorage.setItem('cart', JSON.stringify(cart))
              }
            }
          } else {
            let newColorAdded = {
              color: colorSelected,
              quantity: quantitySelected
            }
            cart[id].push(newColorAdded)
            window.localStorage.setItem('cart', JSON.stringify(cart))
          }
        }    
      }
    }
    if (document.querySelector('.item__content > p')) {
      let divItemContent = document.querySelector('div.item__content')
      divItemContent.removeChild(document.querySelector('div.item__content > p:last-child'))
    } else {
    let addErrorMessage = document.createElement('p')
    addErrorMessage.innerText = "Veuillez vérifier la couleur et la quantité sélectionnées"
    addErrorMessage.setAttribute('style', 'text-align: center')
      if (!document.querySelector('.item__content > p')) {
        document.querySelector('.item__content').appendChild(addErrorMessage)
      }
    }
  })
}

createCommandProductInLocalStorage()


    /*let selector = document.getElementById('colors')
    let colors = selector.querySelectorAll('option')
    let numberOfColors = (colors.length - 1)
    let color = selector.value
    let quantityInput = document.getElementById('quantity')
    let quantity = quantityInput.value
    let errorMessage = document.createElement('p')
    if (selector.value === "" && errorMessage.innerText != "") {
      errorMessage.innerText = "Veuillez choisir une couleur de produit pour l'ajouter au panier."
      let colorParent = document.querySelector('.item__content__settings__color')
      colorParent.appendChild(errorMessage)
      if (Number(quantity) < 1 || Number(quantity > 100)) {
        errorMessage = errorMessage + " Veuillez également entrer une quantité pour le produit."
      }
    }
  })
}*/
