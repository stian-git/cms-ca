
//const productContainer = document.querySelector(".product_container");

async function getProducts() {
    const getProductsURL = "https://tekniskpotet.no/rainydays/flower-power/wp-json/wc/store/products";
    const result = await fetch(getProductsURL);
    const data = await result.json();
    console.log(data);
    // data.forEach(element => {
    //     displayProducts(element);
    // });
    
}

function displayProducts(product) {
    //console.log(product);
    const productPriceNok = product.prices.price;
    const productImage = product.images[0].src;
    const productName = product.name;
    productContainer.innerHTML += `
    <div class="product">
        <h4>${productName}</h4>
        <img src="${productImage}">
        <p>${productPriceNok} NOK</p>
    </div>`
}

getProducts();
