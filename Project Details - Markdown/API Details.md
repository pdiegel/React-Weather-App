National Weather Service API will be used..
The API is located at: [https://api.weather.gov](https://api.weather.gov/)
General API FAQ: https://weather-gov.github.io/api/general-faqs
Gridpoints: https://weather-gov.github.io/api/gridpoints

## How do I determine the gridpoint for my location?
You can retrieve the metadata for a given latitude/longitude coordinate with the `/points` endpoint (`https://api.weather.gov/points/{lat},{lon}`).

The `forecastGridData` property will provide a link to the correct gridpoint for that location.

## How is the gridpoint data formatted?
- The data is presented as a JSON document.
- The document will contain metadata about the forecast grid, along with multiple layers of data (such as temperature).
- The layer data is presented as a time series.
    - Much of the data is calculated for each hour of the forecast period, but to conserve bandwidth the API will merge consecutive values that are equal.
    - Each data point will have the following properties:
        - validTime: This is the time interval that the value applies to. The interval is represented in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
            - For example, `2019-07-04T18:00:00+00:00/PT3H` represents an interval starting on July 4, 2019 at 1800 UTC and continuing for 3 hours (from 1800 to 2100).
        - value: This is the data that applies to that validTime interval.
            - For values that have a unit of measure, such as temperature, the layer will contain a `uom` property to indicate the unit of all the values in that time series.
            - The value may also be `null` to indicate there is no applicable data for that interval.

## Commonly used layers
- temperature: Air temperature
- dewpoint: Dewpoint temperature
- maxTemperature: High temperature
- minTemperature: Low temperature
- relativeHumidity: Relative humidity
- apparentTemperature: Apparent temperature (heat index or wind chill)
- heatIndex: Heat index. This is the apparentTemperature data with values filtered out that are below the threshold of the heat index calculation.
- windChill: Wind chill. This is the apparentTemperature data with values filtered out that are above the threshold of the wind chill calculation.
- skyCover: Percentage of sky with cloud cover
- windDirection: Direction of prevailing wind
- windSpeed: Maximum prevailing wind speed
- windGust: Maximum wind gust
- weather: Weather conditions
    - This data is not numeric, but an array.
    - Each array element is a JSON object representing a decoded [NDFD GRIB weather string](https://www.weather.gov/mdl/degrib_ndfdwx).
- hazards: Long-duration area watches, warnings, and advisories in effect.
    - This data is not numeric, but an array.
    - Each array element is a JSON object with `phenomenon` and `significance` properties. These values correspond to [P-VTEC phenomenon and significance codes](https://www.weather.gov/media/vtec/VTEC_explanation4-18.pdf). For example, `FF` and `A` would indicate a Flash Flood Watch.
    - Optionally, the object may include an `event_number` property. This number will correspond to an issued watch, warning, or advisory product. For example, `TO`, `A`, and `267` would indicate Tornado Watch #267.
    - Note that not all forecast offices utilize this layer for all watch/warning/advisory products. It is most typically used for tropical storm and hurricane watches and warnings.
- probabilityOfPrecipitation: Chance of precipitation
- quantitativePrecipitation: Amount of liquid precipitation