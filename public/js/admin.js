const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closes('article')

    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf,
        }
    }).then(result => {
        console.log(result)
        // productElement.remove() //not allowed IE
        productElement.parentNode.removeChild(productElement)
    }).catch(err => console.log(err))
}