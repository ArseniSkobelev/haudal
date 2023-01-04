"use strict";
// import UserController from "../controllers/user";
// import { User } from "../models/user";
// import { app } from '../index';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const request = require('supertest');
// describe('User tests', () => {
//     // it('a user should be created and contain a jwt token', done => {
//     //     const controller = new UserController();
//     //     let result = controller.createUser({
//     //         "email": "test@haudal.com",
//     //         "password_hash": "testpassword"
//     //     });
//     //     expect(result.jwt).toBeTruthy();
//     //     done();
//     // })
//     // it('a user should NOT be created and SHOULD NOT contain a jwt token', async () => {
//     //     const controller = new UserController();
//     //     let result = controller.createUser({});
//     //     expect(result.jwt).toBeFalsy();
//     // })
// })
// test('GET /api/v1/ping', async () => {
//     const result = await request(app).get('/api/v1/ping');
//     expect(result.body.message).toEqual('Pong!');
//     expect(result.statusCode).toEqual(200);
// })
const mockingoose = require('mockingoose');
const user_1 = require("../models/user");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let tempUser = new user_1.User(user);
    tempUser.save();
});
describe('test mongoose User model', () => {
    it('should return the doc with findById', () => {
        const _doc = {
            _id: '63b57c29821b18029e3cb010',
            email: 'name@email.com',
            password_hash: "test"
        };
        mockingoose(user_1.User).toReturn(_doc, 'findOne');
        return user_1.User.findById({ _id: '63b57c29821b18029e3cb010' }).then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
        });
    });
});
