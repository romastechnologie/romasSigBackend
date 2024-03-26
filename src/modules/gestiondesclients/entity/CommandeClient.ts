import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Client } from "./Client";
import { AdresseLivraison } from "../../gestiondessorties/entity/AdresseLivraison";
import { ProCondiCommandeClient } from "./ProCondiCommandeClient";

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