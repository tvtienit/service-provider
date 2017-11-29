exports.query = `
    type Query {
        users: [User],
        firstByUsername(username: String!): User,
        categoriesByCity(cgrId: String, city: String!, page: Int, limit: Int): [Category],
        locationsByCity(city: String!, page: Int, limit: Int): [Location]
    }
`;