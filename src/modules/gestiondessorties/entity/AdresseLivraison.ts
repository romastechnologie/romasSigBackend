import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { Client } from "../../gestiondesclients/entity/Client";
import { Livraison } from "./Livraison";

@Entity()
export class AdresseLivraison{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé est obligatoire."})
    libelleAdresse:string

    @ManyToOne(()=>Client, (client)=>client.adresselivrclients)
    @JoinColumn()
    client:Client[]

    @OneToMany(() => Livraison, (adresselivraison) => adresselivraison.adreslivraison)
    adresselivraisons: Livraison[]
    
    @OneToMany(() => CommandeClient, (commandeclient) => commandeclient.client)
    commandeclients: CommandeClient[]
   
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}