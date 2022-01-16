import { Express } from "express";

import { encryptPw } from "../modules/pw-encription";
import { registerUser } from "../modules/database/user-queries";

import { RegisterRequest } from "../interfaces/register-request";
import { AuthResponse } from "../interfaces/auth-response";

export const register = async(server: Express, url: string): Promise<Express> => {
  return server.post(url, async(req, res) => {
    const request = req.body as RegisterRequest;

    const hashedPw = await encryptPw(request.password);
    const dbResponse = await registerUser(request, hashedPw);

    switch(dbResponse){
      case 0: 
        const successResponse: AuthResponse = {statusCode: 201, message: 'USER_CREATED'};
        res.send(successResponse);
        break;
      case 23505: 
        const errorResponse: AuthResponse = {statusCode: 409, message: 'USER_ALREADY_EXISTS'}; 
        res.send(errorResponse);
        break;
    };
  });
}