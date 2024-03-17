CREATE EXTENSION postgis;

SELECT *
FROM your_polygon_table
WHERE ST_Intersects(geom, 'POLYGON((-122.5 37.5, -122.6 37.5, -122.6 37.6, -122.5 37.6, -122.5 37.5))');

SELECT *
FROM your_polygon_table
WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint(5, 5), 4326));

INSERT INTO your_polygon_table (geom) VALUES
    (ST_GeomFromText('POLYGON((0 0, 0 10, 10 10, 10 0))', 4326)),
    (ST_GeomFromText('POLYGON((-122.4 37.4, -122.5 37.4, -122.5 37.5, -122.4 37.5, -122.4 37.4))', 4326));

SELECT
    id,
    ST_AsText(geom) AS polygon_text,
    ST_NumPoints(geom) AS num_points,
    ST_Area(geom) AS area,
    ST_Perimeter(geom) AS perimeter
FROM
    your_polygon_table;


CREATE TABLE your_polygon_table (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Polygon, 4326) -- 4326 is the SRID for WGS 84 (latitude/longitude)
);

# When bound to the GIST access method, a the default index for a geometry is an R-Tree.
CREATE INDEX your_polygon_table_geom_gist_idx ON your_polygon_table USING GIST (geom);


# show tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' -- Optional: You can filter by schema if needed
  AND table_type = 'BASE TABLE';



  SELECT
    id,
    ST_AsText(geom) AS polygon_text,
    ST_NumPoints(geom) AS num_points,
    ST_Area(geom) AS area,
    ST_Perimeter(geom) AS perimeter
FROM
    your_polygon_table;