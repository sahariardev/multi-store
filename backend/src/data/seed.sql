INSERT INTO "Store" (id, name, type) VALUES('1a2695d2-d871-11ed-afa1-0242ac120002', 'System', 'SYSTEM');
#rifat1234
INSERT INTO "User" (id, username, password, firstname, lastname, "createdAt", "superAdmin", "passwordReset", "storeAdmin", "storeId")
VALUES('3d06ccf2-d871-11ed-afa1-0242ac120002', 'rifatAdm', '$2b$05$/kSLFtBvDSmvXxX2uRk5gubCfAVK.8Fujg51UhnQNTaOdGuyN1.6S', 'Sahariar', 'Khandoker',
	   now()::timestamp, true, false, false, '1a2695d2-d871-11ed-afa1-0242ac120002');

INSERT INTO "Authority"(id, name) VALUES('a298d5c8-c341-11ed-afa1-0242ac120002','USER_CREATE');
INSERT INTO "Authority"(id, name) VALUES('a8f6990a-c341-11ed-afa1-0242ac120002','ROLE_ASSIGN');
INSERT INTO "Authority"(id, name) VALUES('a8f6990a-c341-11ed-afa1-0242ac120002','ATTENDANCE');