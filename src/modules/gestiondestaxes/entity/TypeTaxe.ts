import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Taxe } from "./Taxe";

@Entity()
export class TypeTaxe{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    valeurMonnaie:number

    @Column()
    libelle:string

    @OneToMany(() => Taxe, (typetaxe) => typetaxe.taxe)
    typetaxes: Taxe[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}