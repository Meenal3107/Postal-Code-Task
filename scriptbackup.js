
document.addEventListener("DOMContentLoaded", function () {
  const usRegex = /^\d{5}(?:-\d{4})?$/;
  const canadaRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;

  const countries = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ascension Island", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Antarctic Territory", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo, Democratic Republic", "Cook Islands", "Costa Rica", "Côte d'Ivoire (Ivory Coast)", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "El Salvador", "Egypt", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Heard and McDonald Islands", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Latvia", "Laos", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Maldives", "Malaysia", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Martinique", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russia", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tristan da Cunha", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "U.S. Virgin Islands", "Uzbekistan", "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Wallis and Futuna", "Yemen", "Zambia", "Zimbabwe"];

  function isPreferredPostalCode(postalCode) {
      console.log("Validating Postal Code against Canada and United-States postal code regex")
      
      if (usRegex.test(postalCode)) {
          return [true, "United-States"];
      }
      if (canadaRegex.test(postalCode)) {
          return [true, "Canada"];
      }
      return [false, ""];
  }

  const countrySelect = document.getElementById("country-select");

  countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.replace(" ", "-");
      option.textContent = country;
      countrySelect.appendChild(option);
  });

  var PostalForm = document.getElementById("postal-form");
  var postalCodeField = document.getElementById("postal-code");
  var selectCountryField = document.getElementById("country-select");
  var countryDropdown = document.getElementById("country-dropdown");

  var needCountrySelection = false;
  var postalCode = "";
  var selectedCountry = "";

  PostalForm.addEventListener("submit", function (event) {
      event.preventDefault();

      postalCode = postalCodeField.value;
      selectedCountry = selectCountryField.value;

      console.log("Validating :: Postal Code:", postalCode, " Selected Country:", selectedCountry);

      var _selectedCountry = "";
      var _isValidPostalCode;

      if (!needCountrySelection) {
          [_isValidPostalCode, _selectedCountry] = isPreferredPostalCode(postalCode);

          if (_isValidPostalCode) {
              console.log("Postal Code matches ",_selectedCountry," postal code regex")
              alert("Valid postal code. Submitting Form");
              // selectCountryField.value = _selectedCountry;
              PostalForm.submit();
              console.log("Form submitted successfully.");
          } else {
              console.log("Postal Code do not matches Canada and United-States postal code regex")
              needCountrySelection = true;
              alert("Postal Code outside Canada/United States. Please select your country");
              countryDropdown.style.display = "";
              console.log("Select country from DropDown")
          }
      }
      else {
          console.log("Validating Postal Code ", postalCode, " against selected country ", selectedCountry)

          validatePostalCode(postalCode, selectedCountry)
          .then((result) => {
              console.log("Validation Success:: Postal code: ", postalCode, " is valid for country: ", selectedCountry);
              alert("Valid postal code for the selected country.");
              PostalForm.submit();
              console.log("Form submitted successfully.");
              })
              .catch((error) => {
              console.log("Postal code validation failed with error:", error);
              console.log("Postal code: ", postalCode, " is not valid for country: ", selectedCountry);
              alert(error);
              console.log("Select country corresponding to entered postal code")
              });
      }
  });

  function validatePostalCode(postalCode, selectedCountry) {
      return new Promise((resolve, reject) => {
        if (postalCode === "") {
          reject("Postal code cannot be blank.");
          return;
        }
        if (selectedCountry === "") {
          reject("Please select a valid country.");
          return;
        }
    
        $.ajax({
          url: "/validate-postal.php",
          type: "GET",
          dataType: "json",
          data: {
            postal: postalCode,
            country: selectedCountry
          },
          success: function (response) {
            console.log("Response from validate-postal.php:", response);
    
            if (response.status === "valid") {
              resolve(response.message);
            } else {
              reject(response.message);
            }
          },
          error: function () {
            reject("An error occurred while validating the postal code.");
          }
        });
      });
    }
    
});