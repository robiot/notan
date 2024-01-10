// Enums, structs and traits for products
pub mod utils;

#[derive(Clone, Hash)]
pub enum ProductKind {
    OneTime,
    Subscription,
}

#[derive(Clone, Hash)]
pub enum BillingPeriod {
    Monthly,
    Yearly,
    OneTime,
}

#[derive(Clone, Hash)]
pub struct PriceCurrency {
    pub currency: stripe::Currency,
    pub price: i64,
}

#[derive(Clone, Hash)]
pub struct Price {
    pub key: String,
    pub billing_period: BillingPeriod,
    pub price_currencies: Vec<PriceCurrency>,
}

#[derive(Clone, Hash)]
pub struct Perks {
    pub no_domain_restrictions: bool,
    pub max_notes_increase: i32,
    pub max_note_characters_increase: i32,

    pub max_notes_base: Option<i32>,
    pub max_note_characters_base: Option<i32>,
}

#[derive(Clone, Hash)]
pub struct Product {
    pub id: String,
    pub title: String,
    pub description: String,
    pub kind: ProductKind,
    pub prices: Vec<Price>,
    pub perks: Perks,
    pub max_own: Option<i32>,
}

// Update this everytime you update the products, now using hash instead
// pub static mut PRODUCTS_VERSION: &str = "1.0.0";

pub fn products() -> Vec<Product> {
    let mut products = Vec::new();

    // Subscriptions
    products.push(Product {
        id: "prod_premium".to_string(),
        title: "Premium".to_string(),
        description: "Premium".to_string(),
        kind: ProductKind::Subscription,
        prices: vec![
            Price {
                key: "premium_monthly".to_string(),
                billing_period: BillingPeriod::Monthly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 999,
                }],
            },
            Price {
                key: "premium_annually".to_string(),

                billing_period: BillingPeriod::Yearly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 9999,
                }],
            },
        ],
        perks: Perks {
            no_domain_restrictions: true,
            max_notes_increase: 0,
            max_note_characters_increase: 0,
            max_notes_base: Some(2500),
            max_note_characters_base: Some(5000),
        },
        max_own: None,
    });

    products.push(Product {
        id: "prod_plus".to_string(),
        title: "Plus".to_string(),
        description: "Plus".to_string(),
        kind: ProductKind::Subscription,
        prices: vec![
            Price {
                key: "plus_monthly".to_string(),
                billing_period: BillingPeriod::Monthly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 399,
                }],
            },
            Price {
                key: "plus_annually".to_string(),
                billing_period: BillingPeriod::Yearly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 3999,
                }],
            },
        ],
        perks: Perks {
            no_domain_restrictions: true,
            max_notes_increase: 0,
            max_note_characters_increase: 0,
            max_notes_base: Some(190),
            max_note_characters_base: Some(900),
        },
        max_own: None,
    });

    // One time
    products.push(Product {
        id: "prod_ot_notes_1".to_string(),
        title: "+10 Max notes".to_string(),
        description: "Increase max note limit by 10".to_string(),
        kind: ProductKind::OneTime,
        prices: vec![Price {
            key: "ot_notes_1".to_string(),
            billing_period: BillingPeriod::OneTime,
            price_currencies: vec![PriceCurrency {
                currency: stripe::Currency::USD,
                price: 499,
            }],
        }],
        perks: Perks {
            no_domain_restrictions: false,
            max_notes_increase: 10,
            max_note_characters_increase: 0,
            max_notes_base: None,
            max_note_characters_base: None,
        },
        max_own: Some(1),
    });

    products.push(Product {
        id: "prod_ot_note_length_1".to_string(),
        title: "+100 Max length".to_string(),
        description: "Increase max note character limit by 100".to_string(),
        kind: ProductKind::OneTime,
        prices: vec![Price {
            key: "ot_note_length_1".to_string(),
            billing_period: BillingPeriod::OneTime,
            price_currencies: vec![PriceCurrency {
                currency: stripe::Currency::USD,
                price: 499,
            }],
        }],
        perks: Perks {
            no_domain_restrictions: false,
            max_notes_increase: 0,
            max_note_characters_increase: 100,
            max_notes_base: None,
            max_note_characters_base: None,
        },
        max_own: Some(1),
    });
    products
}
