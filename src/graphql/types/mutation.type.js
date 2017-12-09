exports.mutation = `
    type Mutation {
        login(username: String!, password: String!): String,
        register(user: UserInput!): String,
        registerService(service: HostInput!): Host,
        addCategory(category: CategoryInput!): Category,
        addLocation(location: LocationInput!): Location,
        rate(review: ReviewInput!): Review,
        subscribes(locationId: String!): Subscriber
    }
`;