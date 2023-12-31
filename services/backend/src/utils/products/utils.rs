use crate::error::{Error, Result};

use super::{Price, PriceCurrency, Product};

pub fn get_product_by_id(products: Vec<Product>, product_id: &str) -> Result<Product> {
    for product in products {
        if product.id == product_id {
            // Return the product if the price key is found
            return Ok(product);
        }
    }

    // Return None if the price key is not found
    Err(Error::StripeFieldNotFoundError(format!(
        "Product with id '{}' was not found. Critical",
        product_id
    )))
}

pub fn get_product_by_price_key(products: Vec<Product>, price_key: &str) -> Result<Product> {
    for product in products {
        if product.prices.iter().any(|price| price.key == price_key) {
            // Return the product if the price key is found
            return Ok(product);
        }
    }

    // Return None if the price key is not found
    Err(Error::StripeFieldNotFoundError(format!(
        "Product with price key '{}' was not found. Critical",
        price_key
    )))
}

pub fn get_price_by_price_key(products: Vec<Product>, price_key: &str) -> Result<Price> {
    for product in products {
        if let Some(price) = product.prices.iter().find(|price| price.key == price_key) {
            // Return the product if the price key is found
            return Ok(price.clone());
        }
    }

    // Return None if the price key is not found
    Err(Error::StripeFieldNotFoundError(format!(
        "Price with price key '{}' was not found. Critical",
        price_key
    )))
}

pub fn get_price_currency_from_price(
    price: Price,
    currency: stripe::Currency,
) -> Result<PriceCurrency> {
    price
        .price_currencies
        .iter()
        .find(|&p| p.currency == currency)
        .ok_or(Error::StripeFieldNotFoundError(format!(
            "Price currency with currency '{}' was not found. Critical",
            currency
        )))
        .map(|p| p.clone())
}
