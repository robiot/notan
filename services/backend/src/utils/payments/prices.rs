use crate::error::{Error, Result};

/**
 * Gets price value for a stripe price
 */
pub fn get_price_value_from_price(price: stripe::Price) -> Result<i64> {
    if let Some(unit_amount) = price.unit_amount {
        return Ok(unit_amount);
    } else {
        return Err(Error::InternalServerError);
    }
}
