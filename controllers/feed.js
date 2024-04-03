exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: "1",
            title: "First Posts",
            content: "This is the first post!",
            imageUrl: "images/book.png",
            creator: {
                name: "Mikeson"
            },
            createdAt: new Date()
        }]
    });
};


exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    // Create Posts in DB
    res.status(201).json({
        message: "Post created successfully!",
        post: {
            _id: new Date().toISOString,
            title: title,
            content: content,
            creator: {
                name: "Mikeson"
            },
            createdAt: new Date()
        }
    })

}