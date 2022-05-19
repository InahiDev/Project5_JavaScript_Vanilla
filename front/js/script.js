//Récupértion du tableau [products] depuis l'API (verbe "GET" par défaut, sans paramètre)
async function getProductsArray() {
  return await fetch('http://localhost:3000/api/products')
  .then((response) => response.json())  //Mise de la réponse de l'API au format JSON
  .catch((error) => console.log(error))
}

const section = document.querySelector('section.items') //Facilitation d'écriture pour plus tard en sélectionnant la section à remplir

//Regroupement de plusieurs éléments dans un parent
function gatherElementsInNewParent(tagParent, array, cssSelector) {
  let parent = createNewFlowElement(tagParent, cssSelector)
  for (let element of array) {
    if (element) {
      parent.appendChild(element)
    }
  }
  return parent
}

//Création d'un <a></a> sans texte (<a> englobant une card par exemple)
function createNewLink(href, linkText) {
  let newLink = document.createElement("a")
  newLink.href = href
  if (linkText) {newLink.innerText = linkText}
  return newLink
}

//Création d'un <article> spécifique possédant les attributs data-id & data-color
function createNewArticle(cssClass, dataId, dataColor) {
  let newArticle = document.createElement("article")
  if (cssClass) {newArticle.classList.add(cssClass)}
  if (dataId) {newArticle.setAttribute('data-id', `${dataId}`)}
  if (dataColor) {newArticle.setAttribute('data-color', `${dataColor}`)}
  return newArticle
}

//Création d'un élément (div / span / p / h / section / article)
function createNewFlowElement(tagName, cssClass, textToInsert, id) {
  let newFlowElement = document.createElement(tagName)
  if (cssClass) {newFlowElement.classList.add(cssClass)}
  if (textToInsert) {newFlowElement.innerText = textToInsert}
  if (id) {newFlowElement.id = id}
  return newFlowElement
}

//Création d'une card (<a>-><article>->(<img>-<h3>-<p>)
function createNewProductArticle() {
  let newImage = document.createElement('img')
  let newTitle = createNewFlowElement("h3", "productName")
  let newP = createNewFlowElement("p", "productDescription") 
  let newArticle = gatherElementsInNewParent("article", [newImage, newTitle, newP])
  let newLink = gatherElementsInNewParent("a", [newArticle])
  section.appendChild(newLink)
}

//Fonction permmettant de modifier chaque href en fonction de l'id présent au niveau de l'article (reflétant l'idProduit)
function createUrlParamsRequest(link) {
  link.setAttribute('href', `product.html?id=${link.getAttribute('id')}`)
}

//Depuis un Array, créer une nouvelle card pour chaque élément de l'array. Utilisation des informations contenu dans les objets de l'array pour remplir les cards.
function createProductOverview(index = 0, array = []) {
  const product = array[index]  //Définition intrinsèque des paramètres de la fonction
  const indexSelector = index + 1  //Décalage de l'index pour création du sélecteur CSS
  createNewProductArticle()
  const newLink = section.querySelector(`a:nth-child(${indexSelector})`)
  newLink.id = product._id  //Définition de l'idCard idProduit depuis le tableau donné en paramètre
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
  products.forEach(elem => createProductOverview(products.indexOf(elem), products))
}

createProductsOverviews()