const faker = require("faker");
const Post = require("./models/post");

async function seedPosts() {
    await Post.remove({});
    for(const i of new Array(600)){
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: "60e3337cc3124d240423f72c"
        }
        await Post.create(post);
    }
    console.log("600 created")
}

module.exports = seedPosts;