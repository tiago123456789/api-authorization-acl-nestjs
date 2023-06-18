import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1687104762046 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE permissions ADD role_id INTEGER NOT NULL,
            ADD FOREIGN KEY(role_id) REFERENCES roles(id);
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                ALTER TABLE permissions DROP role_id;
            `);
  }
}
