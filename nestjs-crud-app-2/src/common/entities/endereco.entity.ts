import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rua!: string;

  @Column()
  numero!: string;

  @Column()
  cidade!: string;

  @Column()
  estado!: string;

  @Column()
  cep!: string;
}