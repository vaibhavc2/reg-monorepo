import {
  Config,
  adjectives,
  colors,
  starWars,
  uniqueNamesGenerator,
} from 'unique-names-generator';

class Names {
  private config: Config;
  constructor() {
    this.config = {
      dictionaries: [adjectives, starWars, colors],
      length: 2,
      separator: ' ',
    };
  }

  public getNameFromEmail(email: string): string {
    return email.split('@')[0];
  }

  public generateUniqueName(): string {
    return uniqueNamesGenerator(this.config);
  }
}

export const names = new Names();
