import * as express from "express";
import DataLayer from "./services/dataLayer";
declare global {
  namespace Express {
    interface Request {
      client?: any;
      iDl: DataLayer;
    }
  }
}
