const checkOutForm = document.querySelector(".checkoutDetails");
const fullName = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const addressLine1 = document.querySelector("#address1");
const addressLine2 = document.querySelector("#address2");
const zip = document.querySelector("#zip");
const city = document.querySelector("#city");
const country = document.querySelector("#country");

const shipmentPriceContainer = document.querySelector(".shipmentprice");
const invoiceFeeContainer = document.querySelector(".invoicefee");
const totalPriceContainer = document.querySelector(".totalprice");

// Fixed prices for fees in basket
let shipment = 7;
let invoiceFee = 2;

shipmentPriceContainer.innerHTML = shipment.toFixed(2);
invoiceFeeContainer.innerHTML = invoiceFee.toFixed(2);

// Validations:

function validateEmail(email) {
    const regEx = /\S+@\S+\.\S+/;
    const patternMatches = regEx.test(email);
    return patternMatches;
}

function lengthCheck(string, length) {
    if (string.trim().length >= length) {
        return true;
    } else {
        return false;
    }
}

function textOnlyCheck(string) {
    const regEx = /^[a-zA-ZæøåÆØÅ]+(([',. -][a-zA-ZæøåÆØÅ ])?[a-zA-ZæøåÆØÅ]*)*$/;
    const textOnly = regEx.test(string);
    return textOnly;
}

// Enables and toggles the icon that indicates if a field is ok or not.

function toggleValidation(field, status) {
    field.style.display = "inline-flex";
    if (status === true) {
        field.classList.remove("fa-exclamation-circle");
        field.classList.add("fa-check-circle");
        checkAllFields();
    } else {
        field.classList.remove("fa-check-circle");
        field.classList.add("fa-exclamation-circle");
        submitButton.disabled = true;
    }
}

// Validate name:

function validateName(event) {
    const validationField = document.querySelector(".name .fas");
    const helptext = document.querySelector("label[for=name] .helptext");
    const nameLength = 3;
    if (!lengthCheck(fullName.value, nameLength) || !textOnlyCheck(fullName.value)) {
        fullName.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Only letters. Minimum ${nameLength} characters.`;
    } else {
        fullName.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

fullName.addEventListener("blur", validateName);

// Validate email address:
function validateEmailAddress(event) {
    const validationField = document.querySelector(".email .fas");
    const helptext = document.querySelector("label[for=email] .helptext");
    if (!validateEmail(email.value)) {
        email.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = "Email address looks invalid";
    } else {
        email.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

email.addEventListener("blur", validateEmailAddress);

// Validate address line 1 field:
function validateAddress1(event) {
    const validationField = document.querySelector(".address1 .fas");
    const helptext = document.querySelector("label[for=address1] .helptext");
    const address1Length = 3;
    if (!lengthCheck(addressLine1.value, address1Length)) {
        addressLine1.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Minium ${address1Length} characters needed.`;
    } else {
        addressLine1.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

addressLine1.addEventListener("blur", validateAddress1);

// No validation on address line 2:
// addressLine2.addEventListener("blur", validateAddress2);

// Validate Zip:
function validateZip(event) {
    const validationField = document.querySelector(".zip .fas");
    const helptext = document.querySelector("label[for=zip] .helptext");
    const zipLength = 3;
    if (!lengthCheck(zip.value, zipLength)) {
        zip.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Minium ${zipLength} characters needed.`;
    } else {
        zip.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

zip.addEventListener("blur", validateZip);

// Validate City:
function validateCity(event) {
    const validationField = document.querySelector(".city .fas");
    const helptext = document.querySelector("label[for=city] .helptext");
    const cityLength = 3;
    if (!lengthCheck(city.value, cityLength) || !textOnlyCheck(city.value)) {
        city.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Only letters. Minimum ${cityLength} characters.`;
    } else {
        city.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

city.addEventListener("blur", validateCity);

// Validate Country:
function validateCountry(event) {
    const validationField = document.querySelector(".country .fas");
    const helptext = document.querySelector("label[for=country] .helptext");
    if (country.value === "") {
        country.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = "Please select a country.";
    } else {
        country.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

country.addEventListener("change", validateCountry);
country.addEventListener("blur", validateCountry);

// Validate terms:

const termsCheckbox = document.querySelector("#terms");

function validateTerms(event) {
    const helptext = document.querySelector(".placeorder_container .helptext");
    if (!termsCheckbox.checked) {
        helptext.style.display = "block";
        helptext.innerHTML = "Please accept terms to place order.";
        submitButton.disabled = true;
    } else {
        helptext.style.display = "none";
    }
}

termsCheckbox.addEventListener("click", validateTerms);

// Validate on submission
const submitButton = document.querySelector("button[type=submit].jacket-cta");
// Disables the submit-button by default.
submitButton.disabled = true;

// CHECK all validations and enable fields
function checkAllFields() {
    // NB: Currently missing additional check for Payment method as there are only one option.
    const validationCorrectCount = document.querySelectorAll(".fa-check-circle").length;
    if (validationCorrectCount === 6) {
        if (!termsCheckbox.checked || basketCounterContainer.innerHTML == 0) {
            validateTerms();
            return;
        }
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}
checkOutForm.addEventListener("change", checkAllFields);

// Fields to display basket data:
const basketItemContainer = document.querySelector("table");
const basketSummaryContainer = document.querySelector(".basket__summary");
const basketHeader = document.querySelector(".basket h2");

// Collect items from the basket and prepare the data to be displayed.
function getJacketsInBasket() {
    let totalPrice = 0;
    basketItemContainer.innerHTML = `<tr class="rowheader">
  <td class="name basket_headertext">Name</td>
  <td class="basket_headertext">Qty</td>
  <td class="basket_headertext">Price (per)</td>
  <td class="basket_headertext">Delete</td>
</tr>`;
    // Handle cases where basket is empty:
    basketItemContainer.style.display = "none";
    basketSummaryContainer.style.display = "none";
    basketHeader.innerHTML = "Basket (Currently empty)";
    // When the basket is not empty:
    if (!storage.getItem("Basket") == "") {
        basketItemContainer.style.display = "table";
        basketSummaryContainer.style.display = "grid";
        basketHeader.innerHTML = "Basket";
        let basketArray = storage.getItem("Basket").split(";");
        let arrayIdx;
        let itemId;
        let itemName;
        let itemSize;
        let itemCount;
        let itemPrice;
        let itemThumb;
        let itemGender;
        basketArray.forEach((item, i) => {
            itemId = item.match(/^\w+/)[0];
            arrayIdx = Number(itemId) - 1;
            itemPrice = allJackets[arrayIdx].price.toFixed(2);
            itemName = allJackets[arrayIdx].name;
            itemThumb = allJackets[arrayIdx].image.replace(".jpg", "-thumb.jpg");
            itemSize = item.split(",")[1].split("-")[1].toUpperCase();
            itemGender = item.split(",")[2];
            itemCount = item.split(",")[3];
            totalPrice += allJackets[arrayIdx].price * itemCount;
            let dataToDisplayInBasket = {
                basketArrayIndex: i,
                name: itemName,
                size: itemSize,
                qty: itemCount,
                img: itemThumb,
                price: itemPrice,
                gender: itemGender,
            };
            // Then displays the collected item:
            displayBasketItem(dataToDisplayInBasket);
        });
    }
    // Updates the price:
    totalPriceContainer.innerHTML = (totalPrice + shipment + invoiceFee).toFixed(2);
}

getJacketsInBasket();

// Adds each item to the basket. (populated from GetJacketsInBasket)
function displayBasketItem(item) {
    const basketItemContainer = document.querySelector("tbody");
    let genderImage;
    let genderText = item.gender.charAt(0).toUpperCase() + item.gender.slice(1);
    if (item.gender == "female") {
        genderImage = "../images/outline_female_red_24dp.png";
    } else {
        genderImage = "../images/outline_male_red_24dp.png";
    }
    let sizeImage;
    let sizeText;
    switch (item.size) {
        case "S":
            sizeImage = "../images/size-s.png";
            sizeText = "Small";
            break;
        case "M":
            sizeImage = "../images/size-m.png";
            sizeText = "Medium";
            break;
        case "L":
            sizeImage = "../images/size-l.png";
            sizeText = "Large";
            break;
        case "XL":
            sizeImage = "../images/size-xl.png";
            sizeText = "X-Large";
            break;
        case "XXL":
            sizeImage = "../images/size-xxl.png";
            sizeText = "2X-Large";
            break;

        default:
            break;
    }
    const itemHTML = `<tr>
  <td class="name">
    <img src="${item.img}" class="basket_productimage" />
    <p class="required">
      <img src="${sizeImage}" class="basket_navbutton" />
      <img src="${genderImage}" class="basket_navbutton" />
      <span class="tooltip_top">${sizeText}, ${genderText}</span>
    </p>

    <p class="basket_productname">${item.name}</p>
  </td>
  <td>
  <img src="./images/MinusButton.png" class="basket_navbutton subtractbutton arrId-${item.basketArrayIndex}" aria-label="Subtract 1" title="Subtract 1" />  
    <p class="basket_qty" aria-label="Current quantity">${item.qty}</p>
    <img src="./images/PlusButton.png" class="basket_navbutton addbutton arrId-${item.basketArrayIndex}" aria-label="Add 1" title="Add 1" />  
  </td>
  <td>${item.price}</td>
  <td>
    <img src="./images/X-Button.png" class="basket_navbutton deletebutton arrId-${item.basketArrayIndex}" aria-label="Delete-button" title="Delete" />
  </td>
</tr>`;
    basketItemContainer.innerHTML += itemHTML;
}

const deleteButtons = document.querySelectorAll(".deletebutton");

// Removes item from basket when the delete-button is triggered.
function deleteItem(event) {
    // Identify which item to delete:
    let arrIndexToDelete = event.target.classList.value.split("-")[1];
    let basketArray = storage.getItem("Basket").split(";");
    basketArray.splice(arrIndexToDelete, 1);
    storage.setItem("Basket", basketArray.join(";"));
    reloadAndKeepFormData();
}

deleteButtons.forEach((element) => {
    element.addEventListener("click", deleteItem);
});

const addButtons = document.querySelectorAll(".addbutton");
const subtractButtons = document.querySelectorAll(".subtractbutton");

let arr;
let newArr;
let arrIndexToAdd;

// function to increase an item (+ button)
function increaseItem(event) {
    arrIndexToAdd = event.target.classList.value.split("-")[1];
    arr = storage.getItem("Basket").split(";");
    newArr = addOrRemoveFromBasket(1, arr, Number(arrIndexToAdd));
    reloadAndKeepFormData();
}
// function to increase an item (- button)
function subtractItem(event) {
    arrIndexToSubtract = event.target.classList.value.split("-")[1];
    arr = storage.getItem("Basket").split(";");
    newArr = addOrRemoveFromBasket(-1, arr, Number(arrIndexToSubtract));
    reloadAndKeepFormData();
}

addButtons.forEach((addElement) => {
    addElement.addEventListener("click", increaseItem);
});

subtractButtons.forEach((subtractElement) => {
    subtractElement.addEventListener("click", subtractItem);
});

// Stores form data to storage when page is refreshed while interacting with the basket.
function reloadAndKeepFormData() {
    let customerName = fullName.value;
    let customerMail = email.value;
    let customerPhone = phone.value;
    let customerAddress1 = addressLine1.value;
    let customerAddress2 = addressLine2.value;
    let customerZip = zip.value;
    let customerCity = city.value;
    let customerCountry = country.value;
    let isTermsChecked = termsCheckbox.checked;
    storage.setItem("Name", customerName);
    storage.setItem("Mail", customerMail);
    storage.setItem("Phone", customerPhone);
    storage.setItem("Address1", customerAddress1);
    storage.setItem("Address2", customerAddress2);
    storage.setItem("Zip", customerZip);
    storage.setItem("City", customerCity);
    storage.setItem("Country", customerCountry);
    storage.setItem("Terms", isTermsChecked);
    storage.setItem("isReloaded", true);
    location.reload();
}

// on page-load we check if form data is already stored and retrieves them again.
function checkForReload() {
    if (storage.getItem("isReloaded") == "true") {
        fullName.value = storage.getItem("Name");
        email.value = storage.getItem("Mail");
        phone.value = storage.getItem("Phone");
        addressLine1.value = storage.getItem("Address1");
        addressLine2.value = storage.getItem("Address2");
        zip.value = storage.getItem("Zip");
        city.value = storage.getItem("City");
        country.value = storage.getItem("Country");
        if (storage.getItem("Terms") == "true") {
            termsCheckbox.checked = true;
        } else {
            termsCheckbox.checked = false;
        }
        storage.setItem("isReloaded", false);
        //Force a recheck of validations to enable/disable the "Place order"-button
        //reValidate();
    }
}
checkForReload();

// Recheck all validations.
function reValidate() {
    validateName();
    validateEmailAddress();
    validateAddress1();
    validateZip();
    validateCity();
    validateCountry();
    validateTerms();
    checkAllFields();
}
