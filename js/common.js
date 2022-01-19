const storage = window.localStorage;
const baseUrlCMS = "https://tekniskpotet.no/rainydays/";
const authConsumerKey = "ck_34ff56c60c7369ee8c203d18f5e4f2179b7d596f";
const authConsumerSecret = "cs_1cd09593ba430b4a32cac4c96362fd75b24e3e1e";

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

// let jacketArrayV3 = [];
// let someName = "Cold and Wet";
// let somePrice = 123;
// let jacketDetails = {
//     name: someName,
//     price: somePrice,
// };
// jacketArrayV3.push({ name: someName, price: somePrice });
// console.log(jacketArrayV3);
let headers = new Headers();
headers.set("Authorization", "Basic " + btoa(authConsumerKey + ":" + authConsumerSecret));

async function getProducts(id) {
    //console.log("API v3 attempt: ");

    let getProductsURL = baseUrlCMS + "wp-json/wc/v3/products";
    // Fetching all jackets like this, makes it probably slow to use the live-search.
    if (id) {
        console.log("Fetching productdetails of ID: " + id);
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
            const data = await result.json();
            //console.log(data);
            showJackets(data);
        } catch (error) {
            jacketsContainer.innerHTML =
                "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            console.log("Unable to retrieve jackets from API: " + error);
        }
    }
}
