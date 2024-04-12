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
      dictionaries: [adjectives, colors, starWars],
      length: 2,
      separator: ' ',
    };
  }

  public getNameFromEmail(email: string): string {
    return email.split('@')[0];
  }

  public generateRandomName(): string {
    return uniqueNamesGenerator(this.config);
  }
}

export const names = new Names();
