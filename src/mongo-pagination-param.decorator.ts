import { BadRequestException, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

const FIRST_PAGE: number = 1;
const DEFAULT_NUMBER_OF_RESULTS: number = 10;

/**
 * Mongo query
 */
export interface MongoQuery {
  filter: {};
  limit: number;
  skip: number;
  sort: [];
}

// tslint:disable-next-line:variable-name
export const MongoPaginationParamDecorator: () => ParameterDecorator = createParamDecorator(
  (_data: {}, req: Request): MongoQuery => {
    const page: number = Number(req.query.page) || FIRST_PAGE;
    const limit: number = Number(req.query.per_page) || DEFAULT_NUMBER_OF_RESULTS;
    let filter: {};
    let sort: [];

    try {
      filter = req.query.filter !== undefined ? JSON.parse(req.query.filter) : {};
      sort = req.query.sort !== undefined ? JSON.parse(req.query.sort) : [];
    } catch (exception) {
      throw new BadRequestException();
    }

    return {
      filter,
      limit,
      skip: (page - 1) * limit,
      sort,
    };
  },
);
