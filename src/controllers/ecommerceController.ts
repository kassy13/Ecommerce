import { Request, Response } from "express";
import {
  creatProductSchema,
  updateProductSchema,
  option,
} from "../utils/utils";
import Ecommerce from "../model/e-commerceModel";
import { v2 as cloudinaryV2 } from "cloudinary";

export const createPost = async (req: Request | any, res: Response) => {
  try {
    const verify = req.user;

    //validate todo form inputs
    const validateUser = creatProductSchema.validate(req.body, option);

    if (validateUser.error) {
      res.status(400).json({ Error: validateUser.error.details[0].message });
    }

    let links = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      // Upload images to Cloudinary and retrieve their URLs
      links = await Promise.all(
        req.files.map(async (item: Record<string, any>) => {
          const result = await cloudinaryV2.uploader.upload(item.path);
          return result.secure_url;
        })
      );
    }

    const newPost = await Ecommerce.create({
      ...validateUser.value,
      user: verify._id,
      pictures: links.join(","),
    });

    return res
      .status(200)
      .json({ message: "Ecommerce Post created successfully", newPost });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { pictures, ...rest } = req.body;
    const { id } = req.params;
    //validate todo form inputs
    const validateUser = updateProductSchema.validate(req.body, option);

    if (validateUser.error) {
      res.status(400).json({ Error: validateUser.error.details[0].message });
    }

    const todo = await Ecommerce.findById({ _id: id });

    if (!todo) {
      return res.status(400).json({
        error: "Todo not found",
      });
    }
    const updateRecord = await Ecommerce.findByIdAndUpdate(
      id,
      {
        ...rest,
        pictures,
      },

      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updateRecord) {
      return res.status(404).json({
        msg: "Todo not updated",
      });
    }

    return res.status(200).json({
      message: "Todo updates successfully",
      updateRecord,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const getAllUserTodos = await Ecommerce.find().populate("user");

    res.status(200).json({
      msg: "Todos successfully fetched",
      getAllUserTodos,
    });
  } catch (error) {
    console.log(error);
  }
};

export const singleTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const getsingleTodos = await Ecommerce.findById(id);

    if (!getsingleTodos) {
      return res.status(400).json({
        error: "todo not found",
      });
    }
    res.status(200).json({
      msg: "Todos successfully fetched",
      getsingleTodos,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserTodos = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const getAllUserTodos = await Ecommerce.find({ user: userId });

    res.status(200).json({
      msg: "Todos successfully fetched",
      getAllUserTodos,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteSingleTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteSingleRecord = await Ecommerce.findByIdAndDelete(id);
    if (!deleteSingleRecord) {
      return res.status(400).json({
        error: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo successfully deleted",
      deleteSingleRecord,
    });
  } catch (error) {
    console.error("Problem deleting todo");
  }
};
