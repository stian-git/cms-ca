const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const jacketId = params.get("id");
const jacketContainer = document.querySelector(".jacket-details");
const jacketName = document.querySelector(".jacketname__h1");

//console.log(jacketId);

// clears the size-variables for each run.

async function showProductDetails() {
    const jacket = await getProducts(jacketId);
    const averageRating = Math.abs(jacket.average_rating);
    //console.log("Avg.Rating: " + averageRating);
    let sizeS,
        sizeM,
        sizeL,
        sizeXL,
        sizeXXL = "";

    let jacketSizes = [];
    jacket.attributes[1].options.forEach((size) => {
        jacketSizes.push(size.toUpperCase());
    });
    //console.log(jacketSizes);
    jacketSizes.forEach((size) => {
        //Adds a string to each size that are present on the given jacket. Strings that remain blank will not be displayed.
        switch (size) {
            case "S":
                sizeS = `<input type="radio" name="size" id="size-s" value="size-s" hidden="true"><label for="size-s"><img src="../images/size-s.png" aria-label="Size: S"></label>`;
                break;
            case "M":
                sizeM = `<input type="radio" name="size" id="size-m" value="size-m" hidden="true"><label for="size-m"><img src="../images/size-m.png" aria-label="Size: M"></label>`;
                break;
            case "L":
                sizeL = `<input type="radio" name="size" id="size-l" value="size-l" hidden="true"><label for="size-l"><img src="../images/size-l.png" aria-label="Size: L"></label>`;
                break;
            case "XL":
                sizeXL = `<input type="radio" name="size" id="size-xl" value="size-xl" hidden="true"><label for="size-xl"><img src="../images/size-xl.png" aria-label="Size: XL"></label>`;
                break;
            case "XXL":
                sizeXXL = `<input type="radio" name="size" id="size-xxl" value="size-xxl" hidden="true"><label for="size-xxl"><img src="../images/size-xxl.png" aria-label="Size: XXL"></label>`;
                break;
            default:
                break;
        }
    });
    let genderMale = `<input type="radio" name="gender" id="male" value="male" hidden="true"><label for="male" class="gender"><p class="required"><img src="../images/outline_male_red_24dp.png"><span class="tooltip_top tooltip_gendertop">Male</span></p></label>`;
    let genderFemale = `<input type="radio" name="gender" id="female" value="female" hidden="true"><label for="female" class="gender"><p class="required"><img src="../images/outline_female_red_24dp.png"><span class="tooltip_top tooltip_gendertop">Female</span></p></label>`;
    if (jacket.attributes[0].options.length == 1) {
        if (jacket.attributes[0].options[0] == "female") {
            genderMale = "";
        } else {
            genderFemale = "";
        }
    }

    //console.log("Images: " + jacket.images.length);
    const jacketReviews = await getReviews(jacket.id);
    let jacketReviewsHTML = "";
    jacketReviews.forEach((review) => {
        jacketReviewsHTML += `<img src="../images/${review.rating}-stars.png" aria-label="Rating-stars: ${review.rating}" title="Rating-stars: ${review.rating}">
        <blockquote>${review.review}</blockquote>
        <p class="reviewername">${review.reviewer}</p>`;
    });

    let thumbsHTML = "";
    jacket.images.forEach((img) => {
        thumbsHTML += `<div>
                            <img src="${img.src.replace(".jpg", "-150x150.jpg")}" alt="${
            jacket.name
        }-1" title="Thumb 1, ${
            jacket.name
        }" class="thumbimage" onclick="changeProductImage(1)" onerror="this.style.display='none'"/>
  </div>`;
    });

    jacketContainer.innerHTML = `<section class="jacketdetails__images">

<img src="${jacket.images[0].src.replace(".jpg", "-300x300.jpg")}" alt="${jacket.name}" class="product-image" title="${
        jacket.name
    }" onerror="this.style.display='none'"/>
<div class="product-image_thumbnails">
${thumbsHTML}
</div>
</section>
<section class="jacketdetails__intro_form">
  <h3>${jacket.name}</h3>
  <p class="ratingstars"><a href="#jacketdetails_reviews" title="View Reviews"><img src="../images/${averageRating}-stars.png" aria-label="Review Stars: ${averageRating}"></a></p>
  ${jacket.short_description}
  <p><a href="#jacket_details" alt="Read details for this jacket" title="Read details about this jacket">Read more...</a></p>
  <form action="checkout.html" class="form_orderdetails" onsubmit="return false">
    <fieldset>
      <legend>Select Gender:</legend>
      ${genderFemale}
      ${genderMale}
    </fieldset>
    <fieldset>
    <legend>Select Size:</legend>
      ${sizeS}
      ${sizeM}
      ${sizeL}
      ${sizeXL}
      ${sizeXXL}
    </fieldset>
    <p class="product-specific__price">${jacket.price} NOK</p>
    <input type="hidden" value="${jacketId}" id="id" name="id">
    <button type="submit" class="jacket-cta addtobasket" aria-label="Click to buy now">Add to basket</button>
    <a href="checkout.html" title="Checkout"><button type="button" class="jacket-cta checkout" aria-label="Click to buy now">Checkout</button></a>
  </form>
  
  </div>
  
</section>
<section class="jacketdetails__details">
  <h2 id="jacket_details">Details</h2>
  <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem</p>
  <p>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
  <p>Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
  <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est </p>
<p><a href="#top" alt="Scroll to the top" title="Scroll to the top of page">To the top...</a></p>

</section>
<section class="jacketdetails__reviews">
  <h2 id="jacketdetails_reviews">Reviews</h2>
  ${jacketReviewsHTML}
</section>`;
}
showProductDetails();

async function getReviews(id) {
    let getProductReviewUrl = baseUrlCMS + "wp-json/wc/v3/products/reviews/?product=" + id;
    let reviewArray;
    try {
        const result = await fetch(getProductReviewUrl, { method: "GET", headers: headers });
        reviewArray = await result.json();
    } catch (error) {
        console.log("Catching reviews failed, returning empty array");
    }
    console.log(reviewArray);
    return reviewArray;
}
