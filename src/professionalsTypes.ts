export interface Professionals {
    code:     number;
    response: Response;
}

export interface Response {
    pros: Pro[];
}

export interface Pro {
    id:            number;
    name:          string;
    slug:          string;
    logo_url:      null | string;
    profile_url:   string;
    review_rating: number;
    reviews_count: number;
    is_verified:   boolean;
    main_address:  MainAddress;
}

export interface MainAddress {
    address_line_1: string;
    address_line_2: string;
    postcode:       string;
    town:           string;
}
