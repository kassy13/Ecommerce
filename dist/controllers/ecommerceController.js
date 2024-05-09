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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleProduct = exports.getUserProduct = exports.singleProduct = exports.getProduct = exports.updateProduct = exports.createProduct = void 0;
const utils_1 = require("../utils/utils");
const e_commerceModel_1 = __importDefault(require("../model/e-commerceModel"));
const cloudinary_1 = require("cloudinary");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verify = req.user;
        const validateUser = utils_1.creatProductSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        let links = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            links = yield Promise.all(req.files.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(item.path);
                return result.secure_url;
            })));
        }
        const newProduct = yield e_commerceModel_1.default.create(Object.assign(Object.assign({}, validateUser.value), { user: verify._id, pictures: links }));
        return res
            .status(200)
            .json({ message: "Ecommerce Product created successfully", newProduct });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { pictures } = _a, rest = __rest(_a, ["pictures"]);
        const { id } = req.params;
        const validateUser = utils_1.updateProductSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const Product = yield e_commerceModel_1.default.findById({ _id: id });
        if (!Product) {
            return res.status(400).json({
                error: "Product not found",
            });
        }
        const updateRecord = yield e_commerceModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, rest), { pictures }), {
            new: true,
            runValidators: true,
            context: "query",
        });
        if (!updateRecord) {
            return res.status(404).json({
                msg: "Product not updated",
            });
        }
        return res.status(200).json({
            message: "Product updates successfully",
            updateRecord,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateProduct = updateProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllUserProduct = yield e_commerceModel_1.default.find().populate("user");
        res.status(200).json({
            msg: "Product successfully fetched",
            getAllUserProduct,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getProduct = getProduct;
const singleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getsingleProduct = yield e_commerceModel_1.default.findById(id);
        if (!getsingleProduct) {
            return res.status(400).json({
                error: "Product not found",
            });
        }
        res.status(200).json({
            msg: "Product successfully fetched",
            getsingleProduct,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.singleProduct = singleProduct;
const getUserProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const getAllUserProduct = yield e_commerceModel_1.default.find({ user: userId });
        res.status(200).json({
            msg: "Product successfully fetched",
            getAllUserProduct,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserProduct = getUserProduct;
const deleteSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteSingleRecord = yield e_commerceModel_1.default.findByIdAndDelete(id);
        if (!deleteSingleRecord) {
            return res.status(400).json({
                error: "Product not found",
            });
        }
        res.status(200).json({
            message: "Product successfully deleted",
            deleteSingleRecord,
        });
    }
    catch (error) {
        console.error("Problem deleting Product");
    }
});
exports.deleteSingleProduct = deleteSingleProduct;
