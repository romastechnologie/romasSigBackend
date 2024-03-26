import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { TypeTaxe } from "./TypeTaxe";

@Entity()
export class Taxe{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    valeurTaxe:number

    @Column()
    libelleTaxe:string

    @ManyToOne(()=>TypeTaxe, (taxe)=>taxe.typetaxes)
    @JoinColumn()
    taxe:TypeTaxe[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}