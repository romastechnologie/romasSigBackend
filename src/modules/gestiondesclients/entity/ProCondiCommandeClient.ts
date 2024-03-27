import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "./CommandeClient";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";

@Entity()
export class ProCondiCommandeClient{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"La quantité ne peut pas être nulle"})
    qtite:number

    @Column()
    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant ne peut pas être nul"})
    montant:number

    @ManyToOne(()=>CommandeClient, (commandeclient)=>commandeclient.proCondiCommandeClients)
    @JoinColumn()
    commandeclient:CommandeClient[]

    @ManyToOne(()=>ProduitConditionnement, (produitconditionnement)=>produitconditionnement.proCondiCommandeClients)
    @JoinColumn()
    produitconditionnement:ProduitConditionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}