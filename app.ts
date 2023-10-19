import express, { Request, Response, NextFunction, Express } from 'express';
import App from './Config/start';
import Database from './Config/database';

const app = new App(express, 3000);
const database = new Database();

database.start();
app.listen();
