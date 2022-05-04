async function getProductsArray() { //Récupération du tableau des Produits depuis l'API
  return await fetch('http://localhost:3000/api/products') //Récupération des données
  .then((response) => response.json())  //Mise de la réponse de l'API au format JSON
  .catch((error) => {
    console.log(error)
  })
}

const section = document.querySelector('section.items') //Facilitation d'écriture pour plus tard en sélectionnant la section à remplir

function createNewProductTemplate() {
    //Recréation d'un Template d'article
    let newLink = document.createElement('a')    //Création de la balise englobante a
    newLink.href = "product.html"
    let newArticle = document.createElement('article')    //création de l'article conteneur
    let newImage = document.createElement('img')    //Création de la balise image
    let newTitle = document.createElement('h3')    //Création de la balise h3
    newTitle.classList.add("class", "productName")      //ajout de sa classe productName
    let newP = document.createElement('p')    //Création de la balise p
    newP.classList.add("class", "productDescription")      //ajout de sa classe productDescription
    newArticle.appendChild(newImage)    //Insertion des enfants dans newArticle
    newArticle.appendChild(newTitle)
    newArticle.appendChild(newP)
    newLink.appendChild(newArticle)    // Insertion de l'enfant de newLink
    section.appendChild(newLink)    //Insertion de newLink dans le DOM
}

function createUrlParamsRequest(link) {
  link.setAttribute('href', `product.html?id=${link.getAttribute('id')}`)
}

function createProductOverview(index = 0, array) {
  const product = array[index]  //Définition intrinsèque des paramètres de la fonction
  const indexSelector = index + 1  //Décalage de l'index pour création du sélecteur CSS
  createNewProductTemplate()  //Création de "l'instance" du produit
  const newLink = section.querySelector(`a:nth-child(${indexSelector})`) //Stockage pour réutilisation
  newLink.id = product._id  //Remplissage de l'Id de la card
  createUrlParamsRequest(newLink)
  const parentA = document.getElementById(product._id)  //Facilitation d'écriture pour la suite
  parentA.querySelector('img').src = product.imageUrl  //Remplissage des attributs src et alt des img
  parentA.querySelector('img').alt = product.altTxt
  parentA.querySelector('h3').innerText = product.name  //Insertion du nom du produit dans le h3
  parentA.querySelector('p').innerText = product.description  //Insertion de la description produit dans le paragraphe pré-destiné
}

async function createProductsOverviews() {
  let products = await getProductsArray()  //Récupération de l'ensemble des produits depuis l'API
  for (let elem of products) {  //Création d'une card pour chaque produit à chaque itération de la boucle
    createProductOverview(products.indexOf(elem), products)
  }
}

createProductsOverviews()

/*async function redirectToProductPage() {
  await getProductsArray()
  let linkArray = section.querySelectorAll('a')
  for (let a of linkArray) {
    const link = a.href
    console.log(link)
    const queryString = link.
    console.log(queryString)
    const urlParams = new URLSearchParams(link)
    const id = urlParams.get('id')
    console.log(id)
    let queryString = a.getAttribute('href')
    a.addEventListener("click", )
  }
}
redirectToProductPage()
*/