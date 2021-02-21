table! {
    use diesel::sql_types::*;
    use diesel_geometry::sql_types::*;

    drops (id) {
        id -> Text,
        location -> Point,
        mimetype -> Text,
        content -> Text,
    }
}
