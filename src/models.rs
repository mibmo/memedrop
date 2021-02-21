use std::fmt;

use super::schema::drops;
use diesel_geometry::pg::data_types::*;

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

impl fmt::Debug for MemeDrop {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "ID: {id}\nLocation: ({lat}, {long})\nMimetype: {mimetype}\nContent: {content}", id = self.id, lat = self.location.0, long = self.location.1, mimetype = self.mimetype, content = self.content)
    }
}
