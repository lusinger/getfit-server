import { Express } from "express";

export const resetPassword = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      console.log(req.query);
    } catch (err) {
      throw err;
    }
  });
}