import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { DemandePrix } from "./DemandePrix";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";

@Entity()
export class DemandePrixProCondi{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    montant:number

    @Column({nullable:true})
    qtité:number

    @ManyToOne(()=>DemandePrix, (demandepri)=>demandepri.demandepriprocondis)
    @JoinColumn()
    demandepri:DemandePrix[]

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.prixproduitcondis)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}