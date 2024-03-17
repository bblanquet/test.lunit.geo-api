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



INSERT INTO points (coordinate)
VALUES (ST_SetSRID(ST_MakePoint(-122.5, 37.5), 4326)),
       (ST_SetSRID(ST_MakePoint(-122.6, 37.6), 4326)),
       (ST_SetSRID(ST_MakePoint(-122.4, 37.4), 4326));