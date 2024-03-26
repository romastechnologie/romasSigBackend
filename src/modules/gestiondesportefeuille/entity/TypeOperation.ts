import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class TypeOperation{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    libelle:string

    @OneToMany(() => Transaction, (typeopertransac) => typeopertransac.typeoperation)
    typeopertransacs: Transaction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}