import { database } from '@/db';
import { PreparedQueryType } from '@/types';
import { SelectVehicleType } from '@reg/db';

class PersonQueries {
  private readonly queries: {
    getVehicleTypes: PreparedQueryType<SelectVehicleType[]>;
  };

  constructor() {
    this.queries = {
      getVehicleTypes: database.db?.query.vehiclesTypes
        .findMany()
        .prepare() as PreparedQueryType<SelectVehicleType[]>,
    };
  }

  async getVehicleTypes() {
    return await this.queries.getVehicleTypes?.execute();
  }
}

export const personQueries = new PersonQueries();
