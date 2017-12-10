exports.query = `
    type Query {
        extract(token: String!): Auth,
        users: [User],
        firstByUsername(username: String!): User,
        categoriesByCity(cgrId: String, city: String!, page: Int, limit: Int): [Category],
        locationsByCity(city: String!, page: Int, limit: Int): [Location],
        inspectedLocations: [Location],
        unInspectedLocations: [Location],
        locationDrafts: [LocationDraft]
    }
`;