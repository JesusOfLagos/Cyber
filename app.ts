import express, { Request, Response, NextFunction, Express } from 'express';
import App from './Config/start';
import Database from './Config/database';
import config from './Config/config';

const app = new App(express, config.app.port);
const database = new Database();

database.start();
app.listen();
