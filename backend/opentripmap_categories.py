# These are all of the available kinds of places that can be searched for in the OpenTripMap API.

# List for Interesting Places
interesting_places = {
    "islands",
    "natural_springs",
    "hot_springs",
    "geysers",
    "other_springs",
    "geological_formations",
    "mountain_peaks",
    "volcanoes",
    "caves",
    "canyons",
    "rock_formations",
    "water",
    "crater_lakes",
    "rift_lakes",
    "salt_lakes",
    "dry_lakes",
    "reservoirs",
    "rivers",
    "canals",
    "waterfalls",
    "lagoons",
    "other_lakes"
}

# List for Beaches and Nature Reserves
nature_reserves = {
    "nature_reserves",
    "aquatic_protected_areas",
    "wildlife_reserves",
    "national_parks",
    "other_nature_reserves",
    "natural_monuments",
    "nature_conservation_areas",
    "glaciers"
}

# List for Cultural Places
cultural_places = {
    "cultural_places",
    "museums",
    "sylvan_theatres",
    "opera_houses",
    "music_venues",
    "concert_halls",
    "puppetries",
    "childrens_theatres",
    "other_theatres",
    "movie_theatres",
    "circuses"
}

# List for Urban Environment and Historical Places
urban_historical_places = {
    "urban_historical_places",
    "wall_painting",
    "squares_and_streets",
    "installation",
    "gardens_and_parks",
    "fountains",
    "sculptures",
    "historical_places",
    "fortifications",
    "monuments_and_memorials",
    "archaeology",
    "burial_places",
    "churches",
    "cathedrals",
    "mosques",
    "synagogues",
    "buddhist_temples",
    "hindu_temples",
    "egyptian_temples",
    "other_temples",
    "monasteries"
}

# List for Amusements and Sports
amusements_sports = {
    "amusements_sports",
    "amusement_parks",
    "miniature_parks",
    "water_parks",
    "roller_coasters",
    "ferris_wheels",
    "other_amusement_rides",
    "baths_and_saunas",
    "winter_sport",
    "diving",
    "climbing",
    "surfing",
    "kitesurfing",
    "stadiums",
    "pools"
}

# List for Tourist Facilities including Foods and Banks
tourist_facilities = {
    "tourist_facilities",
    "transport",
    "shops",
    "supermarkets",
    "conveniences",
    "fish_stores",
    "outdoor",
    "malls",
    "marketplaces",
    "bakeries",
    "foods",
    "restaurants",
    "cafes",
    "fast_food",
    "food_courts",
    "pubs",
    "bars",
    "biergartens",
    "picnic_sites",
    "banks",
    "atm",
    "bureau_de_change"
}

# List for Accommodations
accommodations = {
    "accommodations",
    "apartments",
    "guest_houses",
    "campsites",
    "resorts",
    "motels",
    "hotels",
    "hostels",
    "villas_and_chalet",
    "alpine_huts",
    "love_hotels"
}

class CategoryChecker:
    # Combine all sets into one static variable for easy access and efficient membership testing
    all_categories_set = interesting_places.union(
        nature_reserves,
        cultural_places,
        urban_historical_places,
        amusements_sports,
        tourist_facilities,
        accommodations
    )

    @staticmethod
    def is_value_in_categories(value):
        return value in CategoryChecker.all_categories_set
