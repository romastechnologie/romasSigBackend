import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { DemandePrixProCondi } from "./DemandePrixProCondi";

@Entity()
export class DemandePrix{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant ne peut pas être nul"})
    montant:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La date ne peut pas être nul"})
    date:Date

    @ManyToOne(()=>Fournisseur, (fournisseur)=>fournisseur.fournisseurdemandprix)
    @JoinColumn()
    fournisseur:Fournisseur[]

    @OneToMany(() => DemandePrixProCondi, (demandepriprocondi) => demandepriprocondi.demandepri)
    demandepriprocondis: DemandePrixProCondi[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}