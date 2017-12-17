exports.findIndexes = (model) => {
    model.collection.indexes(function(err, indexes) {
        if (err && err.message === 'no collection') {
            return cb(null, {
                [name]: 'no collection'
            })
        }
        cb(err, {
            [name]: indexes
        })
    });
}