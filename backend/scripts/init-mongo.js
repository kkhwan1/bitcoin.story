db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'crypto_platform'
    }
  ]
});

db = db.getSiblingDB('crypto_platform');

// 인덱스 생성
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.posts.createIndex({ author: 1 });
db.posts.createIndex({ coinSymbol: 1 });
db.posts.createIndex({ createdAt: -1 }); 