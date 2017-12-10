exports.intf = `
    interface ILocation {
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
    }
`;