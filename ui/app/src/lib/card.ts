/* eslint-disable sonarjs/no-small-switch */
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatCardBrand = (brand: string) => {
  switch (brand) {
    case "amex":
      return "American Express";
    default:
      return capitalizeFirstLetter(brand);
  }
};

export const getCardImageFromBrand = (brand: string) => {
  switch (brand) {
    case "visa":
      return "/card/visa.png";
    case "mastercard":
      return "/card/mastercard.png";
    case "amex":
      return "/card/amex.png";
    case "unionpay":
      return "/card/unionpay.png";
    case "discover":
      return "/card/discover.png";
    case "jcb":
      return "/card/jcb.png";
    // case "discover":
    //   return "/images/discover.png";
  }
};
