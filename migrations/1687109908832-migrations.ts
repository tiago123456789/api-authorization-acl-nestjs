import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1687109908832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                    CREATE TABLE users_permissions(
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        permission_id INTEGER NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(permission_id) REFERENCES roles(id)
                    )
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                    DROP TABLE IF EXISTS users_permissions;
            `);
  }
}
