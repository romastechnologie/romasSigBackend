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

    @ManyToOne(()=>TypeTaxe, (typeTaxe)=>typeTaxe.taxes)
    @JoinColumn()
    typeTaxe:TypeTaxe[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}