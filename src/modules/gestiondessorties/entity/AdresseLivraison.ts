import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { Client } from "../../gestiondesclients/entity/Client";

@Entity()
export class AdresseLivraison{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    libelleAdresse:string

    @ManyToOne(()=>Client, (client)=>client.adresselivrclients)
    @JoinColumn()
    client:Client[]

    @OneToMany(() => CommandeClient, (commandeclient) => commandeclient.client)
    commandeclients: CommandeClient[]
   
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}