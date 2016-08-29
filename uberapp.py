import folium
import pandas
import csv

file = open("uber-trip-data\uber-raw-data-apr14.csv", "rb")
scanner = csv.reader(file)

i = 0
maxLat = 0
maxLong = 0
for row in scanner:
    if i == 0:
        header = row
    else:
        col = 0
        for column in row:
            if col == 1:
                if column > maxLat:
                    maxLat = column
            if col == 2:
                if column > maxLong:
                    maxLong = column
            col += 1
    i += 1
file.close()
        

#data = pandas.read_cvs("uber-trip-data\uber-raw-data-apr14.csv")
map = folium.Map(location = [maxLat, maxLong], zoom_start = 6, tiles = 'Mapbox bright')

rect = L.rectangle([[59.9, 29.9], [60.1, 30.1]]);
map.addLayer(rect);
rect.editing.enable();

map.save(outfile = 'map.html')
