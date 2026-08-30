const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/"

// Select all dropdown elements from the DOM
let selects = document.querySelectorAll("select");

// Populate the select dropdowns when the DOM is fully loaded
// window.addEventListener("DOMContentLoaded", () => {
  let fromSelect = selects[0];
  let toSelect = selects[1];

  // Create and prepend default USD option to 'from' dropdown
  let fromOption = document.createElement("option");
  fromOption.value = "USD";
  fromOption.innerText = "USD";
  fromSelect.prepend(fromOption);

  // Create and prepend default BDT option to 'to' dropdown
  let toOption = document.createElement("option");
  toOption.value = "BDT";
  toOption.innerText = "BDT";
  toSelect.prepend(toOption);

  // ADD remaining currencies to select Dropdown from countryList object
  for (let select of selects) {
    for (let currencyCode in countryList) {
      if (select.name === "from" && currencyCode === "USD") {
        continue;
      }
      if (select.name === "to" && currencyCode === "BDT") {
        continue;
      }

      let option = document.createElement("option");
      option.value = currencyCode;
      option.innerText = currencyCode;
      select.append(option);
    }
  }
// });

// State variables for tracking selections and input amount
let selectCurrencyCode = null;
let selectCountryCode = null;

let base = "USD";
let targetCurrency = "BDT";
let fromAmount = 0;

// Select DOM elements for input and text display
let amountInp = document.querySelector("input");
let spans = document.querySelectorAll("span");
let span1 = spans[0];
let span2 = spans[1];
let span3 = spans[2];
let span4 = spans[3];

// Listen for user input and update input display
amountInp.addEventListener("input", () => {
  span1.innerText = amountInp.value.trim();
  fromAmount = Number(amountInp.value);
  span3.textContent = ""; // Clear output on new input
});

// Listen for currency selection changes and update flags
for (let select of selects) {
  select.addEventListener("change", function (e) {
    selectCurrencyCode = e.target.value;
    selectCountryCode = countryList[selectCurrencyCode];

    if (e.target.name === "from") {
      span2.innerText = selectCurrencyCode;
      base = selectCurrencyCode;
    }

    if (e.target.name === "to") {
      span4.innerText = selectCurrencyCode;
      targetCurrency = selectCurrencyCode;
    }

// Finds and selects the <img> tag inside the parent container of the clicked element.
    let selectImg = e.target.parentElement.querySelector("img");
    console.log(e)
    selectImg.setAttribute(
      "src",
      `https://flagsapi.com/${selectCountryCode}/shiny/64.png`
    );
  });
}

// Handle form submission and fetch conversion rate
let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Basic input validation
  if (!fromAmount || fromAmount <= 0 || isNaN(fromAmount)) {
    span3.textContent = "Please enter a valid amount";
    return;
  }

  // Fetch exchange rate data from API
  fetch(
    `${BASE_URL}${base.toLowerCase()}.json`
  )
    .then((response) => {
      // Basic HTTP error handling
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Currency data not found");
        } else if (response.status === 429) {
          throw new Error("Too many requests, try again later");
        } else {
          throw new Error("Something went wrong!");
        }
      }
      return response.json(); // Convert response to JSON
    })
    .then((res) => {
      // Extract target rate and calculate converted value
      //I get the object of the base currency, then I access it to get the exchange rate.
      let exchangeRate = res[base.toLowerCase()][targetCurrency.toLowerCase()]; 
      // input amount to excahnge
      let conversion = (fromAmount * exchangeRate).toFixed(3);

      span3.textContent = conversion; // Display result
    })
    .catch((error) => {
      // Handle network errors or thrown exceptions
        alert(error);

    });
});