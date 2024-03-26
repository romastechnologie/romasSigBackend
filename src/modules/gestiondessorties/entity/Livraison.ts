import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { ProCondiMag } from "../../gestiondessorties/entity/ProCondiMag";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { AdresseLivraison } from "./AdresseLivraison";

@Entity()
export class Livraison{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    date:Date

    @ManyToOne(()=>CommandeClient, (commandeclient)=>commandeclient.commandeclientlivrs)
    @JoinColumn()
    commandeclient:CommandeClient[]

    @ManyToOne(()=>AdresseLivraison, (adreslivraison)=>adreslivraison.adresselivraisons)
    @JoinColumn()
    adreslivraison:AdresseLivraison[]
    
    @OneToMany(() => ProCondiMag, (procondimaglivraison) => procondimaglivraison.magprocondi)
    procondimaglivraisons: ProCondiMag[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}