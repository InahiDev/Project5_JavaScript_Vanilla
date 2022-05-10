function getUrlParameterOrderId() {
  const queryString = window.location.search  //récupérer la string glissée dans l'url de la page
  const urlParams = new URLSearchParams(queryString)  //Définir la string comme paramètre de rechercher url
  const orderId = urlParams.get('order-id')  //Récupérer l'order_id dans les paramètres url
  return orderId //Renvoyer uniquement l'order-id
}

const orderId = getUrlParameterOrderId()

function displayOrderId() {
  document.getElementById('orderId').innerText = orderId
}

displayOrderId()