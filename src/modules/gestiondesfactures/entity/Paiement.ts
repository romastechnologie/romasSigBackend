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
    @IsNotEmpty({message:"La date est obligatoire."})
    datePaiement:Date
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant payé est obligatoire."})
    montantPaye:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant réglé est obligatoire."})
    montantDu:number

    @Column({nullable:true})
    montantRest:number

    @Column({nullable:true})
    montantRecu:number

    @Column({nullable:true})
    reliquat:number

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