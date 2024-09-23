import { RESTDataSource } from "@apollo/datasource-rest";
import { Amenity, CreateListingInput, Listing } from "../types";

export class ListingAPI extends RESTDataSource {
  baseURL = "https://rt-airlock-services-listing.herokuapp.com/";

  getFeaturedListings() {
    return this.get<Listing[]>("featured-listings")
  }

  getListing(id: string) {
    return this.get<Listing>(`listings/${id}`)
  }

  getAmenities(listingId: string) {
    console.log("Making a follow-up call for amenities with ", listingId);
    return this.get<Amenity[]>(`listings/${listingId}/amenities`)
  }

  createListing(createListingInput: CreateListingInput): Promise<Listing> {
    return this.post("listings", {
      body: {
        listing: createListingInput
      }
    })
  }
}