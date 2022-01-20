const storage = window.localStorage;
const baseUrlCMS = "https://tekniskpotet.no/rainydays/";
const authConsumerKey = "ck_34ff56c60c7369ee8c203d18f5e4f2179b7d596f";
const authConsumerSecret = "cs_1cd09593ba430b4a32cac4c96362fd75b24e3e1e";
const loaderIcon = document.querySelector(".fa-compact-disc");

let jacket;

basketCounterContainer = document.querySelector(".basket_items-number");

// Updates basket item counter:
function updateBasketItemCount() {
    let counter = 0;
    if (storage.getItem("Basket")) {
        let basketArray = storage.getItem("Basket").split(";");
        let currentItemCount;
        basketArray.forEach((item) => {
            currentItemCount = Number(item.match(/\w+$/)[0]);
            counter += currentItemCount;
        });
    }
    basketCounterContainer.innerHTML = counter;
}
updateBasketItemCount();

// Add or removes items from the basket using +/- or add to basket-button.
function addOrRemoveFromBasket(num, arr, arridx) {
    let oldItemData = arr[arridx];
    let oldItemCount = Number(oldItemData.match(/\w+$/)[0]);
    let newItemCount = oldItemCount + num;
    // Makes sure the item count can`t go below 1.
    if (newItemCount == 0) {
        newItemCount = 1;
    }
    let newItemData = oldItemData.replace("," + oldItemCount, "," + newItemCount);
    arr[arridx] = newItemData;
    storage.setItem("Basket", arr.join(";"));
}

let headers = new Headers();
headers.set("Authorization", "Basic " + btoa(authConsumerKey + ":" + authConsumerSecret));

async function getProducts(id) {
    let getProductsURL = baseUrlCMS + "wp-json/wc/v3/products";
    // Fetching all jackets like this, makes it probably slow to use the live-search.
    if (id) {
        getProductsURL = baseUrlCMS + "wp-json/wc/v3/products/" + id;
        try {
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            const data = await result.json();
            //console.log(data);
            return data;
        } catch (error) {
            // jacketsContainer.innerHTML =
            //     "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            console.log("Unable to retrieve jackets from API: " + error);
        }
    } else {
        try {
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            data = await result.json();
            //console.log(data);
            storage.setItem("AllProducts", JSON.stringify(data));
            return data;
        } catch (error) {
            // NB: Below error is not available in the checkout. Maybe missing another place too?
            jacketsContainer.innerHTML =
                "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            console.log("Unable to retrieve jackets from API: " + error);
        }
    }
}

// Making banner- carousel
const topBannerContainer = document.querySelector(".banner_container.top");
const bottomBannerContainer = document.querySelector(".banner_container.bottom");

//topBannerContainer.innerHTML = topBannerHTML;
//bottomBannerContainer.innerHTML = topBannerHTML;

async function getBannerData() {
    let getBannerDataURL = baseUrlCMS + "wp-json/wc/v3/products/?category=25";
    try {
        const result = await fetch(getBannerDataURL, { method: "GET", headers: headers });
        const data = await result.json();
        return data;
    } catch (error) {
        console.log("An error occured fetching the bannerdata");
    }
}

let counter = 0;
function displayBanners(productData) {
    //console.log(productData);
    //console.log(productData[0].images[0].src);
    const imgArray = [
        "https://tekniskpotet.no/rainydays/wp-content/uploads/2022/01/jacket-id6.jpg",
        "https://tekniskpotet.no/rainydays/wp-content/uploads/2022/01/jacket-id2.jpg",
    ];
    const bannerHTML = `
    <a href="jacketdetails.html?id=${productData[0].id}" alt="Banner Image" title="banner image">
        <img src="${productData[0].images[0].src}" class="banner_image" alt="Offer: Banner advertisement for one of our jackets" aria-label="Offer: Banner advertisement for one of our jackets"/>
    </a>
    <a href="jacketdetails.html?id=${productData[0].id}" class="banner_text" title="Jacket banner text">Rainy days - Gets you out of the comfort zone.</a>
    `;
    topBannerContainer.innerHTML = bannerHTML;
    bottomBannerContainer.innerHTML = bannerHTML;
    const myInterval = setInterval(() => {
        if (counter >= productData.length) {
            //console.log("Now resetting...");
            counter = 0;
            return;
        }
        //console.log(productData[counter].images[0].src);
        const prodId = productData[counter].id;
        const prodImg = productData[counter].images[0].src;
        document.querySelector(".banner_container.top .banner_image").src = prodImg;
        document.querySelector(".banner_container.bottom .banner_image").src = prodImg;
        document.querySelector(".banner_container.top .banner_text").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.top a").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.bottom .banner_text").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.bottom a").href = "jacketdetails.html?id=" + prodId;
        counter++;
    }, 10000);
    // Array of images to use.
    //getBannerData();

    //const prodId = 53;
    //const prodImg = "../images/pexels-yan-krukov-5792901-500px.jpg";

    // const bannerHTML = `
    // <a href="jacketsdetails.html?id=${prodId}" alt="Banner Image" title="banner image">
    //     <img src="${prodImg}" class="banner_image" alt="Offer: Nordic extreme rain jacket for men" aria-label="Offer: Nordic extreme rain jacket for men"/>
    // </a>
    // <a href="jacketsdetails.html?id=${prodId}" class="banner_text" title="Jacket banner text">"Nordoc Extreme": Gets you out of the comfort zone.</a>
    // `;
    // topBannerContainer.innerHTML = bannerHTML;
    // bottomBannerContainer.innerHTML = bannerHTML;
}

//displayBanners();
getBannerData().then((bannerData) => {
    displayBanners(bannerData);
});
// setInterval(() => {
//     console.log("Swap image!");
//     displayBanners();
// }, 3000);
