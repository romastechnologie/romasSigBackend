import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { Approvisionnement } from "./Approvisionnement";

@Entity()
export class AProCondi{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    montant:number

    @Column()
    qtité:number

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.prixproduitcondis)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @ManyToOne(()=>Approvisionnement, (approvision)=>approvision.apropocondis)
    @JoinColumn()
    approvision:Approvisionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}