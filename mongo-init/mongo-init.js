db = db.getSiblingDB('conchclub');

// Create collections (optional but good for explicit checking)
db.createCollection('users');
db.createCollection('seasons');

// Create Indexes
db.users.createIndex({ username: 1 }, { unique: true });

// Insert Initial Admin User if not exists
// Password: password (BCrypt hash)
if (!db.users.findOne({ username: 'admin' })) {
    db.users.insertOne({
        username: 'admin',
        password: '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
        role: 'ADMIN',
        inviteCode: 'default_code',
        _class: 'com.conchclub.model.User'
    });
    print('Inserted admin user');
} else {
    print('Admin user already exists');
}

// Insert Default Season if not exists
if (!db.seasons.findOne({ name: 'Local Test Season 1' })) {
    db.seasons.insertOne({
        name: 'Local Test Season 1',
        active: true,
        locked: false,
        createdAt: new Date(),
        submissions: [],
        _class: 'com.conchclub.model.Season'
    });
    print('Inserted default season');
} else {
    print('Default season already exists');
}
