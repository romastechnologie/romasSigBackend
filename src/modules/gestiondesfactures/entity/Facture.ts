import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { ProCondiFact } from "./ProCondiFact";
import { Paiement } from "./Paiement";

@Entity()
export class Facture{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    date:Date
    
    @Column()
    montFact:string

    @OneToMany(() => Paiement, (facturepaiement) => facturepaiement.facture)
    facturepaiements: Paiement[]

    @OneToMany(() => ProCondiFact, (factureprocondi) => factureprocondi.facture)
    factureprocondis: ProCondiFact[]

    @ManyToOne(()=>CommandeClient, (commandeclient)=>commandeclient.commandefactures)
    @JoinColumn()
    commandeclient:CommandeClient[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}