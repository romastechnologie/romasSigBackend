import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { ProCondiFact } from "./ProCondiFact";
import { ModePaiement } from "./ModePaiement";
import { Facture } from "./Facture";
import { Transfert } from "../../gestiondesmagasins/entity/Transfert";

@Entity()
export class Paiement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"La date ne peut pas être nulle"})
    date:Date
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant réglé ne peut pas être nul"})
    montantRegle:number

    @Column()
    montantRest:number

    @ManyToOne(()=>ModePaiement, (modepaiement)=>modepaiement.modepaiements)
    @JoinColumn()
    modepaiement:ModePaiement[]

    @ManyToOne(()=>Facture, (facture)=>facture.facturepaiements)
    @JoinColumn()
    facture:Facture[]

    @ManyToOne(()=>Transfert, (transfert)=>transfert.transfpaiements)
    @JoinColumn()
    transfert:Transfert[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}