import express, { Express, RequestHandler } from 'express';
import { Options as UrlencodedOptions } from 'body-parser';

const bodyParser = (app: Express) => {
  const jsonParser: RequestHandler = express.json();
  const urlencodedParser: RequestHandler = express.urlencoded(
    { extended: true } as UrlencodedOptions,
  );

  app.use(jsonParser);
  app.use(urlencodedParser);
};

export default bodyParser;
