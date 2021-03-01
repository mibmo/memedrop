#![feature(proc_macro_hygiene, decl_macro)]

extern crate openssl;
#[macro_use]
extern crate rocket;

use std::collections::HashMap;

use rocket::request::{Form, FromForm};
use rocket_contrib::{templates::Template, serve::StaticFiles};

//use serde::Serialize;

use memedrop::DropDb as DbConn;

#[derive(FromForm)]
struct AddDropForm {
    lat: f64,
    long: f64,
    mimetype: String,
    content: String,
}

#[get("/")]
fn landing() -> Template {
    let context: HashMap<(), ()> = HashMap::new();
    Template::render("landing", &context)
}

#[get("/drops")]
fn show_all_drops(conn: DbConn) -> String {
    match conn.get_all_drops() {
        Err(e) => format!("Database error: {}", e),
        Ok(drops) => drops
            .into_iter()
            .map(|req| format!("ID: {id}\nLocation: ({lat}, {long})\nMimetype: {mimetype}\nContent: {content}\n", id = req.id, lat = req.location.0, long = req.location.1, mimetype = req.mimetype, content = req.content))
            .collect::<Vec<String>>()
            .join("\n"),
    }
}

#[post("/add", data = "<data>")]
fn add_drop_with_coordinates(conn: DbConn, data: Form<AddDropForm>) -> String {
    match conn.create_drop(data.lat, data.long, &data.mimetype, &data.content) {
        Err(err) => format!("An error occured: {:?}", err),
        Ok(id) => format!("ID: {}", id),
    }
}

#[get("/near?<lat>&<long>")]
fn closest_drop(conn: DbConn, lat: f64, long: f64) -> String {
    match conn.get_closest_drop(lat, long) {
        Err(err) => format!("An error occured: {:?}", err),
        Ok(drop) => match drop {
            None => "No drops were found.".to_string(),
            Some((drop, distance)) => format!("{:?}\nDistance: {}", drop, distance),
        },
    }
}

#[catch(404)]
fn not_found() -> Template {
    let context: HashMap<(), ()> = HashMap::new();
    Template::render("404", &context)
}

fn main() {
    let catchers = catchers![not_found];
    let routes = routes![landing, show_all_drops, add_drop_with_coordinates, closest_drop];

    rocket::ignite()
        .mount("/", routes)
        .mount("/res", StaticFiles::from("/public/resources"))
        .register(catchers)
        .attach(DbConn::fairing())
        .attach(Template::fairing())
        .launch();
}
