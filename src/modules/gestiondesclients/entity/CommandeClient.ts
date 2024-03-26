import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Client } from "./Client";
import { AdresseLivraison } from "../../gestiondessorties/entity/AdresseLivraison";
import { ProCondiCommandeClient } from "./ProCondiCommandeClient";
import { Facture } from "../../gestiondesfactures/entity/Facture";
import { Livraison } from "../../gestiondessorties/entity/Livraison";

@Entity()
export class CommandeClient{
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Client, (client)=>client.commandeclients)
    @JoinColumn()
    client:Client[]

    @ManyToOne(()=>Client, (client)=>client.commandeclients)
    @JoinColumn()
    adresseLivraison:AdresseLivraison[]

    @OneToMany(() => ProCondiCommandeClient, (proCondiCommandeClient) => proCondiCommandeClient.commandeclient)
    proCondiCommandeClients: ProCondiCommandeClient[]

    @OneToMany(() => Facture, (commandefacture) => commandefacture.commandeclient)
    commandefactures: Facture[]

    @OneToMany(() => Livraison, (commandeclientlivr) => commandeclientlivr.commandeclient)
    commandeclientlivrs: Livraison[]
    
    @Column()
    dateCommande:Date

    @Column()
    montHT:number

    @Column()
    montTTC:number

    @Column()
    montTotal:number

    @Column()
    statutCommande:string

    @Column()
    remise:number

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}