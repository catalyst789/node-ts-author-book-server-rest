import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import Logger from "../library/Logger";
import { IAuthor } from "../models/Autho";
import { IBook } from "../models/Book";

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      Logger.error(error);
      res.status(402).json({ error });
    }
  };
};

export const Schemas = {    
  author: {
    create: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),

    update: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
  },

  book: {
    create: Joi.object<IBook>({
      author: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      title: Joi.string().required(),
    }),

    update: Joi.object<IBook>({
      author: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      title: Joi.string().required(),
    }),
  },
};
