let userName = process.env.MONGO_INITDB_DATABASE;
let password = process.env.MONGO_INITDB_DATABASE;
let database = process.env.MONGO_INITDB_DATABASE;

console.log('Creating users and collections');
db.createUser({
	user: userName,
	pwd: password,
	roles: [
		{
			role: 'readWrite',
			db: database,
		},
		{
			role: 'dbOwner',
			db: database,
		},
	],
});
db.getSiblingDB(database).createCollection('users', {
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['firstname', 'lastname', 'age', 'email'],
			properties: {
				firstname: {
					bsonType: 'string',
					description: 'must be a string and is required',
				},
				lastname: {
					bsonType: 'string',
					description: 'must be an string and is required',
				},
				age: {
					bsonType: 'number',
					description: 'must be an number and is required',
				},
				email: {
					bsonType: 'string',
					description: 'must be an string and is required',
				},
			},
		},
	},
});

try {
	db.getSiblingDB(database).users.insertMany([
		{ firstname: 'card', lastname: 'card', age: 22, email: 'card@mail' },
		{ firstname: 'card1', lastname: 'card2', age: 22, email: 'c1ard@mail' },
		{ firstname: 'card2', lastname: 'card3', age: 23, email: 'cardd@mail' },
		{
			firstname: 'card2',
			lastname: 'card3',
			age: 'abpba',
			email: 'cardd@mail',
		},
	]);
} catch (e) {
	print(e);
}
