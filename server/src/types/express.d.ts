import { Request } from "express";

declare module "express" {
  export interface Request {
    userId?: number;
  }
}
declare namespace Express {
  export interface Request {
    userId?: number;
  }
}
