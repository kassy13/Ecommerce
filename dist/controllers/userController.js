"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.RegisterUser = void 0;
const utils_1 = require("../utils/utils");
const userModel_1 = __importDefault(require("../model/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const jwtsecret = process.env.JWT_SECRET;
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;
        const profile_picture = req.body.profile_picture;
        const confirm_password = req.body.confirm_password;
        const phone_number = req.body.phone_number;
        const country = req.body.country;
        const validateUser = utils_1.RegisterSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, yield bcryptjs_1.default.genSalt(12));
        const user = yield userModel_1.default.findOne({ email: email });
        let pictureUrl = "";
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
        }
        if (!user) {
            const newUser = yield userModel_1.default.create({
                fullname,
                email,
                profile_picture: pictureUrl,
                password: passwordHash,
                phone_number,
                country,
            });
            return res.status(200).json({
                message: "Registration Successful",
                data: newUser,
            });
        }
        res.status(400).json({
            message: "User already exist",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.RegisterUser = RegisterUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const validateUser = utils_1.LoginSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const user = (yield userModel_1.default.findOne({
            email: email,
        }));
        if (!userModel_1.default) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        const { _id } = user;
        const token = jsonwebtoken_1.default.sign({ _id }, jwtsecret, { expiresIn: "30d" });
        const validUser = yield bcryptjs_1.default.compare(password, user.password);
        if (validUser) {
            return res.status(200).json({
                msg: "Login Successful",
                user,
                token,
            });
        }
        return res.status(400).json({
            error: "Invalid password",
        });
    }
    catch (error) {
        console.error("Something went wrong login in");
    }
});
exports.loginUser = loginUser;
