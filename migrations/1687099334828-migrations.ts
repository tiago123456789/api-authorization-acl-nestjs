import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1687099334828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE permissions(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(150) NOT NULL
                )
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                DROP TABLE IF EXIST permissions;
        `);
  }
}
