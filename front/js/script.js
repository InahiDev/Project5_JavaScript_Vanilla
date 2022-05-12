//Récupértion du tableau [products] depuis l'API (verbe "GET" par défaut, sans paramètre)
async function getProductsArray() {
  return await fetch('http://localhost:3000/api/products')
  .then((response) => response.json())  //Mise de la réponse de l'API au format JSON
  .catch((error) => console.log(error))
}

const section = document.querySelector('section.items') //Facilitation d'écriture pour plus tard en sélectionnant la section à remplir

//Création d'une card (<a>-><article>->(<img>-<h3>-<p>)
function createNewProductArticle() {
    let newLink = document.createElement('a')
    let newArticle = document.createElement('article')
    let newImage = document.createElement('img')
    let newTitle = document.createElement('h3')
    newTitle.classList.add("class", "productName")
    let newP = document.createElement('p')
    newP.classList.add("class", "productDescription")
    newArticle.appendChild(newImage)
    newArticle.appendChild(newTitle)
    newArticle.appendChild(newP)
    newLink.appendChild(newArticle)
    section.appendChild(newLink)
}

//Fonction permmettant de modifier chaque href en fonction de l'id présent au niveau de l'article (reflétant l'idProduit)
function createUrlParamsRequest(link) {
  link.setAttribute('href', `product.html?id=${link.getAttribute('id')}`)
}

//Depuis un Array, créer une nouvelle card pour chaque élément de l'array. Utilisation des informations contenu dans les objets de l'array pour remplir les cards.
function createProductOverview(index = 0, array) {
  const product = array[index]  //Définition intrinsèque des paramètres de la fonction
  const indexSelector = index + 1  //Décalage de l'index pour création du sélecteur CSS
  createNewProductArticle()
  const newLink = section.querySelector(`a:nth-child(${indexSelector})`)
  newLink.id = product._id  //Correspondance idProduit avec idA (idCard)
  createUrlParamsRequest(newLink) //Modification des href personnalisée pour chaque card
  const parentA = document.getElementById(product._id)
  parentA.querySelector('img').src = product.imageUrl  //Remplissage des attributs src et alt des img
  parentA.querySelector('img').alt = product.altTxt
  parentA.querySelector('h3').innerText = product.name
  parentA.querySelector('p').innerText = product.description
}

//Récupération du tableau des produits et création d'une card remplie pour chaque élément du tableau
async function createProductsOverviews() {
  let products = await getProductsArray()  //Récupération du tableau de produits depuis l'API (verbe "GET" sans paramètre)
  for (let elem of products) {  //Création d'une card pour chaque produit à chaque itération de la boucle
    createProductOverview(products.indexOf(elem), products)
  }
}

createProductsOverviews()