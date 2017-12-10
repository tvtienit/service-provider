exports.InputType = `
    input UserInput {
        username: String,
        password: String,
        email: String,
        phone: String,
        nickname: String
    }

    input HostInput {
        phone: String,
    }

    input CategoryInput {
        title: String,
        description: String
    }

    input ReviewInput {
        locationId: String,
        stars: Int,
        content: String
    }

    input LocationInput {
        title: String,
        description: String,
        categoryId: String,
        city: String,
        img_source: String,
        address: String,
        lat: Float,
        long: Float,
        price: Float,
        hostId: String,
    }
`;