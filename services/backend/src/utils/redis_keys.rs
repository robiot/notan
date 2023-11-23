#[derive(Clone)]
pub struct Keys {}

impl Keys {
    pub fn email_verify_session(id: String) -> String {
        format!("email_verify_session:{}", id)
    }
}