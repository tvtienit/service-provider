exports.mutation = `
    type Mutation {
        #Login for a user
        login(username: String!, password: String!): String,
        #Register a new user
        register(user: UserInput!): String,
        #Let current login user become a host
        registerService(service: HostInput!): Host,
        #Add a new Category
        addCategory(category: CategoryInput!): Category,
        #Update a category information
        updateCategory(categoryId: String!,category: CategoryInput!): Category,
        deleteCategory(categoryId: String!): Category,
        searchCategories(words: String!): [Category],
        addLocation(location: LocationInput!): Location,
        rate(review: ReviewInput!): Review,
        subscribes(locationId: String!): Subscriber,
        inspect(locationId: String): Location,
        undoInspection(locationId: String): Location,
        updateLocation(locationId: String, location: LocationInput!): LocationDraft,
        inspectUpdation(draftId: String): Location,
        profile: User,
        users(page: Int, limit: Int): [User]
    }
`;