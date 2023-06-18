import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1687098429351 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE roles(
                id SERIAL PRIMARY KEY,
                name VARCHAR(70) NOT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXIST roles;
    `);
  }
}
