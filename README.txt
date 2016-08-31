URL OF APPLICATION: http://catebissell.com/uberapp.html

How To Run:
Opening the web page will display a Google map centered on the mean latitude and mean longitude of the data points.
Then, to select an area to view top pick up locations in that area, simply check the check box and a selection box will appear.
This selection box can be resized or dragged to a desired area. Inside the box, the top pick up locations in that area will 
be displayed as GoogleMap pins.

My Approach:
I implemented a listener to wait for changes in the bounds of the box. Then, when the bounds are changed (as is done immediately when the 
box is set around the center of the map), the latitude and longitude of all points within the bounds are analyzed and the number of times each
point appears is recorded, along with the point, in an array. Then the count of each point in the array is compared to find the highest count.
When the highest count is obtained, only points with counts above the highest count/2 are displayed, because these would qualify as top pick up spots.
I filtered on highest count/2 so as to keep the top spots only those points that repeat often.

Design Decisions:
When I first started this assignment, I decided to use LeafLet maps with GeoDjango on Python.
However, after I had the map showing on a page and was ready to move onto drawing a shape on the map,
I optimally decided to use GoogleMaps instead. I figure users are more familiar with GoogleMaps,
and it would be less of a learning curve for them when presented with a map interface they have seen before.
In addition, I know Javascript better than Python, and seeing as how I had limited time to complete this assignment,
I chose a language that would allow for maximum use of time. I valued this factor more highly than the cleanness of the code. 
Where in Python, I could easily parse a CSV file in one line of code, it was much more work in Javascript.
With regards to the way I handled parsing the CSV file, I originally converted it to a JSON string
in the Javascript, so I could easily access each element by name. However, because I needed to both
stringify AND parse, this ended up being a time-consuming operation, so I made the decision to stick with 
a traditional array.
I tried to base my design decisions primarily on the needs of the user, as well as quick response time of the app.

If I Had More Time:
When run locally, the map comes up very quickly. However, when hosted on my website it takes a very long time.
If I had more time, I would have investigated why this is happening.
Also, I would have included functionality to clear the markers when the rectangle has moved or
is removed from the map.
In addition, I would have added a display of the data points in a table to the side of the map. I did try this,
but had difficulty with displaying the data since, before the file is read, it is null.
I also wanted to add a function to calculate, based on how zoomed in the map is, how far away from the map's center the rectangle would be.
My current design of adding or subtracting .01 only works with the current zoom percentage.
Finally, I would have added in as many of the extra features listed as I could. 