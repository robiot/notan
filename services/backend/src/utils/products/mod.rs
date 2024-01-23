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
    pub max_tags: Option<i32>,
    pub max_per_domain: Option<i32>,

    pub max_notes: Option<i32>,
    pub max_note_characters: Option<i32>,
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

pub fn free() -> Perks {
    Perks {
        max_tags: Some(5),
        max_per_domain: Some(5),

        max_notes: Some(15),
        max_note_characters: Some(300),
    }
}

pub fn products() -> Vec<Product> {
    let mut products = Vec::new();

    // Subscriptions
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
                    price: 800,
                }],
            },
            Price {
                key: "plus_annually".to_string(),
                billing_period: BillingPeriod::Yearly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 7200,
                }],
            },
        ],
        perks: Perks {
            max_tags: Some(15),
            max_per_domain: Some(20),

            max_notes: None,
            max_note_characters: None,
        },
        max_own: None,
    });

    products.push(Product {
        id: "prod_pro".to_string(),
        title: "Pro".to_string(),
        description: "Pro".to_string(),
        kind: ProductKind::Subscription,
        prices: vec![
            Price {
                key: "pro_monthly".to_string(),
                billing_period: BillingPeriod::Monthly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 1200,
                }],
            },
            Price {
                key: "pro_annually".to_string(),

                billing_period: BillingPeriod::Yearly,
                price_currencies: vec![PriceCurrency {
                    currency: stripe::Currency::USD,
                    price: 12000,
                }],
            },
        ],
        perks: Perks {
            max_tags: None,
            max_per_domain: None,

            max_notes: None,
            max_note_characters: None,
        },
        max_own: None,
    });
    products
}
