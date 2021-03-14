use std::fmt;

use super::schema::drops;
use diesel_geometry::pg::data_types::*;
use serde::{
    ser::{SerializeStruct, Serializer},
    Serialize,
};

#[derive(Clone, Queryable)]
pub struct MemeDrop {
    pub id: String,
    pub location: PgPoint,
    pub mimetype: String,
    pub content: String,
}

#[derive(Insertable)]
#[table_name = "drops"]
pub struct NewMemeDrop {
    pub id: String,
    pub location: PgPoint,
    pub mimetype: String,
    pub content: String,
}

#[derive(Serialize)]
struct Point {
    lat: f64,
    long: f64,
}

impl MemeDrop {
    pub fn empty() -> Self {
        Self {
            id: "".to_string(),
            location: PgPoint(0.0, 0.0), // null island
            mimetype: "".to_string(),
            content: "".to_string(),
        }
    }
}

impl Serialize for MemeDrop {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("MemeDrop", 4)?;
        s.serialize_field("id", &self.id)?;
        s.serialize_field(
            "location",
            &Point {
                lat: self.location.0,
                long: self.location.1,
            },
        )?;
        s.serialize_field("mimetype", &self.mimetype)?;
        s.serialize_field("content", &self.content)?;
        s.end()
    }
}
