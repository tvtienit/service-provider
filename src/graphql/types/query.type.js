exports.query = `
    type Query {
        extract(token: String!): Auth,
        users: [User],
        categories: [Category],
        firstByUsername(username: String!): User,
        categoriesByCity(cgrId: String, city: String!, page: Int, limit: Int): [Category],
        categoryById(categoryId: String!): Category,
        locationsByHost: [Location]
        locationById(locationId: String!): Location,
        locationsByCity(city: String!, page: Int, limit: Int): [Location],
        inspectedLocations: [Location],
        unInspectedLocations: [Location],
        locationDrafts: [LocationDraft]
    }
`;