import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { TypeTaxe } from "./TypeTaxe";

@Entity()
export class Taxe{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La valeur de la taxe ne peut pas être nulle"})
    valeurTaxe:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé de la taxe ne peut pas être nul"})
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