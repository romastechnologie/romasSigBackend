import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Produit } from "../../gestiondesproduits/entity/Produit";
import { Conditionnement } from "./Conditionnement";
import { ProCondiCommandeClient } from "../../gestiondesclients/entity/ProCondiCommandeClient";
import { DemandePrixProCondi } from "../../gestiondesapprovisionnements/entity/DemandePrixProCondi";
import { CommandeFourniProCondi } from "../../gestiondesapprovisionnements/entity/CommandeFourniProCondi";

@Entity()
export class ProduitConditionnement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    qtiteConditionnement:number

    @Column()
    qtiteStockCondi:number

    @Column()
    prix:number

    @Column()
    montant:number

    @ManyToOne(()=>Produit, (produit)=>produit.produitconditionnements)
    @JoinColumn()
    produit:Produit[]

    @ManyToOne(()=>Conditionnement, (conditionnement)=>conditionnement.produitconditionnements)
    @JoinColumn()
    conditionnement:Conditionnement[]

    @OneToMany(() => ProCondiCommandeClient, (proCondiCommandeClient) => proCondiCommandeClient.commandeclient)
    proCondiCommandeClients: ProCondiCommandeClient[]

    @OneToMany(() => DemandePrixProCondi, (prixproduitcondi) => prixproduitcondi.produitcondi)
    prixproduitcondis: DemandePrixProCondi[]

    @OneToMany(() => CommandeFourniProCondi, (produitcondiscommande) => produitcondiscommande.produitcondi)
    produitcondiscommandes: CommandeFourniProCondi[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}