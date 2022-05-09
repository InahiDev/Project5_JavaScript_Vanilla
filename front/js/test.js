let productArticles = []
  productArticlesNodes.forEach(element => {
    productArticles.push(element)
  })
  productArticles.shift()
  productArticles.shift()
  productArticles.shift()
  console.log(productArticles)
  for (let article of productArticles) {
    let articleIndex = productArticles.indexOf(article) +1
    console.log(articleIndex)
  }
  