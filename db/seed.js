// grab our client with destructuring from the export in index.js
const { 
        client, 
        getAllUsers, 
        createUser, 
        updateUser, 
        createPost,
        updatePost,
        getAllPosts,   
        getPostsByUser,
        getUserById 
    } = require('./index');


// this function should call a query which drops all tables from our database
async function dropTables() {
    try {
        console.log('Starting to drop tables...')
        await client.query(`
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!")
    } catch (error) {
        console.error("Error Dropping tables", error)
        throw error; // we pass the error up to the function that calls dropTables
    }
}
  
// this function should call a query which creates all tables for our database 
async function createTables() {
    try {
        console.log('Starting to create tables...')
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active boolean DEFAULT true
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active boolean DEFAULT true
        );

        `);
        console.log("Finished creating tables!")
    } catch (error) {
        console.error("Error Building tables")
        throw error; // we pass the error up to the function that calls createTables
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99' , name: 'albert', location: 'Alberta'});
        const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra', location: 'Sandy Beach'});
        const glamgal = await createUser({ username: 'glamgal', password: 'soglam' , name: 'Glam', location: 'Beverly Hills'});
        

        console.log(albert);

        console.log("Finished creating users!");
    } catch(error) {
        console.error("Error creating users!");
        throw error;
    }
}  

async function createInitialPosts() {
    try {
        console.log("Starting to create posts...");
        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them."
        });

        await createPost({
            authorId: sandra.id,
            title: "Sandras Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them."
        });
        await createPost({
            authorId: glamgal.id,
            title: "A Glamorous First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them."
        });

        // console.log(albert);

        console.log("Finished creating posts!");
    } catch(error) {
        console.error("Error creating posts!");
        throw error;
    }
}  


async function rebuildDB() {
    try {
        client.connect();
    
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        throw error;
    }
}
  
async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Calling updateUsers on user[0]")
        const updateUserResult = await updateUser(users[0].id, {name: "SomeNew Name", location: "Omaha, NE"})
        console.log ("Result: ", updateUserResult)

        console.log("Finished database tests!");

        console.log("Getting all the posts");
        const posts = await getAllPosts();
        console.log("Result:", posts);
    
        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
          title: "New Title",
          content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Getting UserID 1 info")
        const user1 = await getUserById(1)
        console.log(user1)

    } catch (error) {
        console.error("Error testing database!");
        throw error;
    }
}



rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
