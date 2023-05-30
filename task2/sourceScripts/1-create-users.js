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
				_id: {
					bsonType: 'number',
					description: 'must be a number and is required',
				},
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
		{
			_id: 1,
			firstname: 'card',
			lastname: 'card',
			age: 22,
			email: 'card@mail',
		},
		{
			_id: 2,
			firstname: 'card1',
			lastname: 'card2',
			age: 22,
			email: 'c1ard@mail',
		},
		{
			_id: 3,
			firstname: 'card2',
			lastname: 'card3',
			age: 23,
			email: 'cardd@mail',
		},
		{
			_id: 4,
			firstname: 'card2',
			lastname: 'card3',
			age: 24,
			email: 'cardd@mail',
		},
	]);
} catch (e) {
	print(e);
}
