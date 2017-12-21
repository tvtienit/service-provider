exports.query = `
    type Query {
        extract(token: String!): Auth,
        users: [User],
        categories(page: Int, limit: Int): [Category],
        firstByUsername(username: String!): User,
        categoriesByCity(cgrId: String, city: String!, page: Int, limit: Int): [Category],
        categoryById(categoryId: String!): Category,
        locationsByHost: [Location]
        locationById(locationId: String!): Location,
        locationsByCity(city: String!, page: Int, limit: Int): [Location],
        inspectedLocations(page: Int, limit: Int): [Location],
        unInspectedLocations(page: Int, limit: Int): [Location],
        locationDrafts(page: Int, limit: Int): [LocationDraft]
    }
`;