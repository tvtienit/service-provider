exports.mutation = `
    type Mutation {
        login(username: String!, password: String!): String,
        register(user: UserInput!): String,
        registerService(service: HostInput!): Host,
        addCategory(category: CategoryInput!): Category,
        updateCategory(categoryId: String!,category: CategoryInput!): Category,
        deleteCategory(categoryId: String!): Category,
        addLocation(location: LocationInput!): Location,
        rate(review: ReviewInput!): Review,
        subscribes(locationId: String!): Subscriber,
        inspect(locationId: String): Location,
        undoInspection(locationId: String): Location,
        updateLocation(locationId: String, location: LocationInput!): LocationDraft,
        inspectUpdation(draftId: String): Location,
        profile: User
    }
`;