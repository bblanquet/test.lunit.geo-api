CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    coordinate GEOMETRY(Point, 4326) -- 4326 is the SRID for WGS 84 (latitude/longitude)
);

CREATE INDEX points_coordinate_gist_idx
ON points
USING GIST (coordinate);

CREATE TABLE contours (
    id SERIAL PRIMARY KEY,
    coordinates GEOMETRY(Polygon, 4326) -- 4326 is the SRID for WGS 84 (latitude/longitude)
);

CREATE INDEX contours_coordinates_gist_idx
ON contours
USING GIST (coordinates);