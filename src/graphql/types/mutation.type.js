exports.mutation = `
    type Mutation {
        login(username: String!, password: String!): String,
        register(user: UserInput!): String,
        searchUsers(words: String!): [User],
        registerService(service: HostInput!): Host,
        searchHosts(words: String): [Host],
        addCategory(category: CategoryInput!): Category,
        updateCategory(categoryId: String!,category: CategoryInput!): Category,
        deleteCategory(categoryId: String!): Category,
        deleteLocation(locationId: String!): Location,
        searchInspected(words: String!): [Location],
        searchUninspected(words: String!): [Location],
        deleleAllLocations: Location,
        searchCategories(words: String!): [Category],
        addLocation(location: LocationInput!): Location,
        rate(review: ReviewInput!): Review,
        subscribes(locationId: String!): Subscriber,
        inspect(locationId: String): Location,
        undoInspection(locationId: String): Location,
        updateLocation(locationId: String, location: LocationInput!): LocationDraft,
        searchDrafts(words: String!): [LocationDraft],
        inspectUpdation(draftId: String): Location,
        profile: User,
        users(page: Int, limit: Int): [User]
    }
`;