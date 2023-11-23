use time::OffsetDateTime;

use crate::error::Result;

pub mod user;
pub mod email;

pub fn normalize_timestamp(time: OffsetDateTime) -> Result<usize> {
    return Ok(time
        .date()
        .with_hms_milli(time.hour(), time.minute(), time.second(), 0)?
        .assume_utc().unix_timestamp() as usize);
}
