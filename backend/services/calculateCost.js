// DELIVERY TYPE CHARGES

const DELIVERY_TYPE_CHARGES = {
  standard: 0,
  overnight: 2500,
  sameday: 5000,
};

// NATIONAL ZONE CHARGES

const NATIONAL_ZONE_CHARGES = {
  same_city: 1000,
  short_distance: 2500,
  long_distance: 4500,
};

// NATIONAL HANDLING CHARGES

const NATIONAL_HANDLING_CHARGES = {
  document: 0,
  books: 0,
  clothing: 300,
  cosmetics: 500,
  food: 700,
  medicine: 800,
  electronics: 1200,
  fragile: 1500,
  small_package: 600,
  large_package: 2000,
};

// INTERNATIONAL ZONE CHARGES

const INTERNATIONAL_ZONE_CHARGES = {
  africa: 15000,
  europe: 25000,
  north_america: 30000,
  south_america: 32000,
  asia: 28000,
  middle_east: 22000,
  oceania: 35000,
};

// INTERNATIONAL HANDLING CHARGES

const INTERNATIONAL_HANDLING_CHARGES = {
  document: 1000,
  books: 1200,
  clothing: 1500,
  cosmetics: 2000,
  food: 2500,
  medicine: 3000,
  electronics: 5000,
  fragile: 6000,
  small_package: 2000,
  large_package: 7000,
};

// COUNTRY → ZONE MAP

const INTERNATIONAL_COUNTRY_ZONES = {
  // Africa
  ghana: "africa",
  kenya: "africa",
  egypt: "africa",
  south_africa: "africa",

  // Europe
  united_kingdom: "europe",
  uk: "europe",
  france: "europe",
  germany: "europe",

  // North America
  united_states: "north_america",
  usa: "north_america",
  canada: "north_america",

  // Asia
  china: "asia",
  india: "asia",
  japan: "asia",
  singapore: "asia",

  // Middle East
  uae: "middle_east",
  united_arab_emirates: "middle_east",
  qatar: "middle_east",
  saudi_arabia: "middle_east",

  // Oceania
  australia: "oceania",
  new_zealand: "oceania",
};

// NORMALIZE COUNTRY

const normalizeCountry = (country) => {
  return country
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
};

// GET INTERNATIONAL ZONE

const getInternationalDestinationZone = (country) => {
  const normalized = normalizeCountry(country);

  return INTERNATIONAL_COUNTRY_ZONES[normalized] || null;
};

// NATIONAL DELIVERY ZONE

const getNationalZone = (origin, destination) => {
  const originLower = origin.toLowerCase();
  const destinationLower = destination.toLowerCase();

  if (originLower === destinationLower) {
    return "same_city";
  }

  const northernCities = [
    "abuja",
    "kaduna",
    "kano",
    "jos",
  ];

  const southernCities = [
    "lagos",
    "ibadan",
    "port harcourt",
    "benin",
  ];

  const originNorth = northernCities.includes(originLower);
  const destinationNorth =
    northernCities.includes(destinationLower);

  const originSouth = southernCities.includes(originLower);
  const destinationSouth =
    southernCities.includes(destinationLower);

  if (
    (originNorth && destinationNorth) ||
    (originSouth && destinationSouth)
  ) {
    return "short_distance";
  }

  return "long_distance";
};

// NATIONAL WEIGHT

const calculateNationalWeightCharge = (weight) => {
  if (weight <= 1) {
    return {
      band: "0-1kg",
      charge: 0,
    };
  }

  if (weight <= 5) {
    return {
      band: "1-5kg",
      charge: 1000,
    };
  }

  if (weight <= 10) {
    return {
      band: "5-10kg",
      charge: 2500,
    };
  }

  if (weight <= 25) {
    return {
      band: "10-25kg",
      charge: 5000,
    };
  }

  if (weight <= 50) {
    return {
      band: "25-50kg",
      charge: 9000,
    };
  }

  if (weight <= 70) {
    return {
      band: "50-70kg",
      charge: 15000,
    };
  }

  throw new Error(
    "Shipments above 70kg require a custom freight quote."
  );
};

// INTERNATIONAL WEIGHT

const calculateInternationalWeight = (weight) => {
  if (weight <= 0.5) {
    return {
      band: "0-0.5kg",
      charge: 0,
    };
  }

  if (weight <= 1) {
    return {
      band: "0.5-1kg",
      charge: 5000,
    };
  }

  const extraKg = Math.ceil(weight - 1);

  return {
    band: `${weight}kg`,
    charge: 5000 + extraKg * 4000,
  };
};

// MAIN CALCULATOR

export const calculateCost = ({
  originCity,
  destinationCity,
  destinationCountry,
  shipmentType,
  deliveryType,
  parcelCategory,
  weight,
}) => {

  if (!weight || weight <= 0) {
    throw new Error("Invalid weight.");
  }

  const deliveryTypeCharge =
    DELIVERY_TYPE_CHARGES[deliveryType] || 0;

  // NATIONAL

  if (shipmentType === "national") {
    const zone = getNationalZone(
      originCity,
      destinationCity
    );

    const zoneCharge =
      NATIONAL_ZONE_CHARGES[zone];

    const weightInfo =
      calculateNationalWeightCharge(weight);

    const handlingCharge =
      NATIONAL_HANDLING_CHARGES[
        parcelCategory
      ] || 0;

    const price =
      zoneCharge +
      weightInfo.charge +
      deliveryTypeCharge +
      handlingCharge;

    return {
      type: "national",
      originCity,
      destinationCity,
      parcelCategory,
      weight,
      currency: "NGN",
      price,

      breakdown: {
        zone,
        zoneCharge,
        weightBand: weightInfo.band,
        weightCharge: weightInfo.charge,
        deliveryType,
        deliveryTypeCharge,
        handlingCharge,
      },
    };
  }

  // INTERNATIONAL

  if (shipmentType === "international") {

    const destinationZone =
      getInternationalDestinationZone(
        destinationCountry
      );

    if (!destinationZone) {
      throw new Error(
        `Shipping to ${destinationCountry} is not supported yet.`
      );
    }

    const zoneCharge =
      INTERNATIONAL_ZONE_CHARGES[
        destinationZone
      ];

    const weightInfo =
      calculateInternationalWeight(weight);

    const handlingCharge =
      INTERNATIONAL_HANDLING_CHARGES[
        parcelCategory
      ] || 0;

    const price =
      zoneCharge +
      weightInfo.charge +
      deliveryTypeCharge +
      handlingCharge;

    return {
      type: "international",
      originCity,
      destinationCity,
      destinationCountry,
      parcelCategory,
      weight,
      currency: "NGN",
      price,

      breakdown: {
        destinationZone,
        zoneCharge,
        weightBand: weightInfo.band,
        weightCharge: weightInfo.charge,
        deliveryType,
        deliveryTypeCharge,
        handlingCharge,
      },
    };
  }

  throw new Error(
    "Invalid shipment type."
  );
};