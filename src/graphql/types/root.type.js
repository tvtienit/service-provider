"use strict"
import { query } from './query.type';
import { mutation } from './mutation.type';
import { subscription } from './subscription.type';
import { intf } from './interface.type';

const rootType = `
    type Auth {
        _id: ID,
        username: String,
        message: String
    }

    type Subscriber {
        _id: ID,
        userId: String,
        locationId: String,
    }

    type User {
        _id: ID,
        username: String,
        email: String,
        nickname: String,
        phone: String,
        registration_date: String,
        registered: Host,
        reviews: [Review],
        subLocations: [Location],
        pages: Int
    }

    type Host {
        _id: ID,
        user: User,
        host_title: String,
        phone: String,
        head_office: String,
        location: [Location],
        pages: Int
    }

    type Category {
        _id: ID,
        title: String,
        description: String,
        locations: [Location],
        pages: Int
    }

    type Review {
        _id: ID,
        user: User,
        location: Location,
        stars: Int,
        content: String,
        date: String,
        pages: Int
    }

    type Location implements ILocation {
        _id: ID,
        title: String,
        description: String,
        category: Category,
        city: String,
        img_source: String,
        address: String,
        lat: Float,
        long: Float,
        price: Float,
        is_inspected: Boolean
        host: Host,
        reviews: [Review],
        subscribers: [User], 
        pages: Int
    }

    # Describe the draft version of a location that've edited by its own hoster
    type LocationDraft implements ILocation {
        _id: ID,
        title: String,
        description: String,
        category: Category,
        city: String,
        img_source: String,
        address: String,
        lat: Float,
        long: Float,
        price: Float,
        is_inspected: Boolean,
        realId: String,
        pages: Int
    }
`;

exports.RootType = rootType.concat(query, mutation, subscription, intf);