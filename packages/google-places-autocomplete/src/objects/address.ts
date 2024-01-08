import { AddressComponent } from './addressComponent';
import { Geometry } from './geometry';
import { Photo } from './photo';
import { OpeningHours } from './openingHours';
import { PlaceReview } from './placeReview';

export class Address {
    public address_components: AddressComponent[];
    public adr_address: string;
    public formatted_address: string;
    public formatted_phone_number: string;
    public geometry: Geometry;
    public html_attributions: string[];
    public icon: string;
    public id: string;
    public international_phone_number: string;
    public name: string;
    public opening_hours: OpeningHours;
    public permanently_closed: boolean;
    public photos: Photo[];
    public place_id: string;
    public price_level: number;
    public rating: number;
    public reviews: PlaceReview[];
    public types: string[];
    public url: string;
    public utc_offset: number;
    public vicinity: string;
    public website: string;
}
