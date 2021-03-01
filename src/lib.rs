#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate diesel;

use diesel::prelude::*;
use diesel_geometry::pg::data_types::*;

use nanoid::nanoid;

pub mod models;
pub mod schema;

use models::*;

#[database("drop_db")]
pub struct DropDb(diesel::pg::PgConnection);

use schema::drops;
impl DropDb {
    pub fn create_drop(&self, lat: f64, long: f64, mimetype: &str, content: &str) -> QueryResult<String> {
        let new_drop = NewMemeDrop {
            id: nanoid!(),
            location: PgPoint(lat, long),
            mimetype: mimetype.to_string(),
            content: content.to_string(),
        };

        diesel::insert_into(drops::table)
            .values(&new_drop)
            .returning(drops::dsl::id)
            .get_result(&self.0)
    }

    /// Given a coordinate, returns the closest of all drops along with the distance from the given
    /// point.
    pub fn get_closest_drop(&self, lat: f64, long: f64) -> QueryResult<Option<(MemeDrop, f64)>> {
        let drops = self.get_all_drops()?;

        let point = PgPoint(lat, long);

        let mut closest = (&MemeDrop::empty(), f64::MAX);
        drops.iter().for_each(|drop| {
            let dist = distance_between_points(&point, &drop.location);
            if closest.1 > dist {
                closest = (drop, dist);
            }
        });

        if closest.1 == f64::MAX { return Ok(None) }

        Ok(Some((closest.0.clone(), closest.1)))
    }

    pub fn get_all_drops(&self) -> QueryResult<Vec<MemeDrop>> {
        drops::table.load::<MemeDrop>(&self.0)
    }
}

fn distance_between_points(p1: &PgPoint, p2: &PgPoint) -> f64 {
    ((p1.0 - p2.0).powi(2) + (p1.1 - p2.1).powi(2)).sqrt()
}
