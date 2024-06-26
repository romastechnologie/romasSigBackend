import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Produit } from "../../gestiondesproduits/entity/Produit";
import { Conditionnement } from "./Conditionnement";
import { ProCondiCommandeClient } from "../../gestiondesclients/entity/ProCondiCommandeClient";
import { DemandePrixProCondi } from "../../gestiondesapprovisionnements/entity/DemandePrixProCondi";
import { CommandeFourniProCondi } from "../../gestiondesapprovisionnements/entity/CommandeFourniProCondi";
import { ProCondiMagasin } from "../../gestiondesmagasins/entity/ProCondiMagasin";
import { AProCondi } from "../../gestiondesapprovisionnements/entity/AProCondi";
import { ProCondiTrans } from "../../gestiondesmagasins/entity/ProCondiTrans";
import { ProCondiFact } from "../../gestiondesfactures/entity/ProCondiFact";

@Entity()
export class ProduitConditionnement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"La quantité de conditionnement est obligatoire."})
    qtiteConditionnement:number

    @Column({nullable:true})
    qtiteStockCondi:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le prix est obligatoire."})
    prix:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant est obligatoire."})
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

    @OneToMany(() => AProCondi, (aprocondi) => aprocondi.produitcondi)
    aprocondis: AProCondi[]

    @OneToMany(() => CommandeFourniProCondi, (produitcondiscommande) => produitcondiscommande.produitcondi)
    produitcondiscommandes: CommandeFourniProCondi[]

    @OneToMany(() => ProCondiMagasin, (procondiaprovision) => procondiaprovision.produitcondi)
    procondiaprovisions: ProCondiMagasin[]

    @OneToMany(() => ProCondiTrans, (proconditransfert) => proconditransfert.produitcondi)
    proconditransferts: ProCondiTrans[]

    @OneToMany(() => ProCondiFact, (procondifactur) => procondifactur.produitcondi)
    proconditionfacts: ProCondiFact[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}