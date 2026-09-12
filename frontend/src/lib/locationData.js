export const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Kano",
  "Ibadan",
  "Enugu",
  "Port Harcourt",
  "Benin City",
  " Maiduguri",
  " Sokoto",
  " Jos"
];
  


const toOption = (value) => ({ value, label: value });

export const NIGERIAN_CITY_OPTIONS = NIGERIAN_CITIES.map(toOption);

export const INTERNATIONAL_COUNTRIES_WITH_CAPITALS = [
  { country: "Afghani", capital: "Kabul" },
  { country: "Bahrain", capital: "Manama" },
  { country: "Bangladesh", capital: "Dhaka" },
  { country: "Canada", capital: "Ottawa" },
  { country: "Germany", capital: "Berlin" },
  { country: "India", capital: "New Delhi" },
  { country: "Iran", capital: "Tehran" },
  { country: "Iraq", capital: "Baghdad" },
  { country: "Japan", capital: "Tokyo" },
  { country: "Kuwait", capital: "Kuwait City" },
  { country: "Lebanon", capital: "Beirut" },
  { country: "Mexico", capital: "Mexico City" },
  { country: "Nigeria", capital: "Abuja" },
  { country: "Oman", capital: "Muscat" },
  { country: "Qatar", capital: "Doha" },
  { country: "Russia", capital: "Moscow" },
  { country: "Saudi Arabia", capital: "Riyadh" },
  { country: "Singapore", capital: "Singapore" },
  { country: "South Korea", capital: "Seoul" },
  { country: "Turkey", capital: "Ankara" },
  { country: "United Arab Emirates", capital: "Abu Dhabi" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States", capital: "Washington, D.C." },
];

export const INTERNATIONAL_DESTINATION_OPTIONS =
  INTERNATIONAL_COUNTRIES_WITH_CAPITALS.map(({ country, capital }) =>
    toOption(`${country}, ${capital}`)
  );

export const getDestinationOptionsForShipmentType = (shipmentType) =>
  shipmentType === "international"
    ? INTERNATIONAL_DESTINATION_OPTIONS
    : NIGERIAN_CITY_OPTIONS;

export const isValidDestinationForShipmentType = (shipmentType, destination) =>
  !destination ||
  getDestinationOptionsForShipmentType(shipmentType).some(
    (o) => o.value === destination
  );

