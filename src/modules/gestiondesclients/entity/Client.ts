import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "./CommandeClient";
import { AdresseLivraison } from "../../gestiondessorties/entity/AdresseLivraison";

@Entity()
export class Client{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    nomClient:string

    @Column()
    prenomClient:string

    @Column()
    adresseClient:string

    @Column()
    emailClient:string

    @Column()
    telephone1:number

    @Column()
    telephone2:number

    @Column()
    dateNais:string

    @Column()
    raisonSociale:string

    @OneToMany(() => AdresseLivraison, (adresselivrclient) => adresselivrclient.client)
    adresselivrclients: AdresseLivraison[]

    @OneToMany(() => CommandeClient, (commandeclient) => commandeclient.client)
    commandeclients: CommandeClient[]

    @Column()
    ifu:number
    
    @Column()
    rccm:string

    @Column()
    sigle:string

    @Column()
    denomination:string

    @Column()
    dateCreation:Date

    @Column()
    statut:string

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}