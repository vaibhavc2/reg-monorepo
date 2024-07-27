import { database } from '@/db';
import { PreparedQueryType } from '@/types';
import { SelectPerson, SelectVehicleType } from '@reg/db';
import { asc, sql } from 'drizzle-orm';

class PersonQueries {
  private readonly queries: {
    getVehicleTypes: PreparedQueryType<SelectVehicleType[]>;
    getPersonsPage: PreparedQueryType<SelectPerson[]>;
  };

  constructor() {
    this.queries = {
      getVehicleTypes: database.db?.query.vehiclesTypes
        .findMany()
        .prepare() as PreparedQueryType<SelectVehicleType[]>,
      getPersonsPage: database.db?.query.persons
        .findMany()
        .prepare() as PreparedQueryType<SelectPerson[]>,
    };
  }

  async getVehicleTypes() {
    return await this.queries.getVehicleTypes?.execute();
  }

  // async getNextPersonsPage(
  //   {
  //     order,
  //     cursor,
  //     pageSize,
  //   }: { order: 'asc' | 'desc'; cursor?: number; pageSize: number } = {
  //     order: 'asc',
  //     pageSize: 10,
  //   },
  // ) {
  //   return await this.queries.getPersonsPage?.execute({
  //     order,
  //     cursor,
  //     pageSize,
  //   });
  // }
}

export const personQueries = new PersonQueries();
