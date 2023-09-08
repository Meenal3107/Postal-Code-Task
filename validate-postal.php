<?php

header("Access-Control-Allow-Origin: *");
$country = $_GET['country'];
$postalCode = $_GET['postal'];

$jsonUrl = 'https://raw.githubusercontent.com/Meenal3107/posal-code.json/master/postal-codes.json';
$jsonData = file_get_contents($jsonUrl);

if ($jsonData === false) {
    echo json_encode(array("status" => "error", "message" => "Failed to fetch JSON data."));
    exit;
}

$postalCodeData = json_decode($jsonData, true); // Parse JSON as an associative array
$countryRegexMap = [];

foreach ($postalCodeData as $entry) {
    $countryRegexMap[$entry['Country']] = $entry['Regex'];
}

if (isset($countryRegexMap[$country])) {
    $regex = "/" . $countryRegexMap[$country] . "/";
    if (preg_match($regex, $postalCode)) {
        echo json_encode(array("status" => "valid", "message" => "Postal code is valid for the selected country."));
    } else {
        echo json_encode(array("status" => "invalid", "message" => "Postal code is not valid for the selected country."));
     }
} else {
    echo json_encode(array("status" => "error", "message" => "Selected country not found in JSON data."));
}
?>
 