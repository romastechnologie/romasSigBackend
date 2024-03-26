import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { Facture } from "./Facture";

@Entity()
export class ProCondiFact{
    @PrimaryGeneratedColumn()
    id:number
       
    @Column()
    qtite:number

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.proconditionfacts)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @ManyToOne(()=>Facture, (facture)=>facture.factureprocondis)
    @JoinColumn()
    facture:Facture[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}