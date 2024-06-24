import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "./CommandeClient";
import { AdresseLivraison } from "../../gestiondessorties/entity/AdresseLivraison";
import { Compte } from "../../gestiondesportefeuille/entity/Compte";
import { Transaction } from "../../gestiondesportefeuille/entity/Transaction";
import { Sortie } from "../../gestiondessorties/entity/Sortie";
import { Vente } from "../../gestiondespointventes/entity/Vente";
import { Operation } from "../../gestiondesportefeuille/entity/Operation";

@Entity()
export class Client{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:true})
    nomClient:string

    @Column({nullable:true})
    prenomClient:string

    @Column()
    adresseClient:string

    @Column()
    sexe:string

    @Column()
    emailClient:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le numéro de téléphone est obligatoire."})
    telephone1:number

    @Column({nullable:true})
    telephone2:number

    @Column({nullable:true})
    dateNais:Date

    @Column({nullable:true})
    raisonSociale:string

    @ManyToOne(()=>Vente, (vente)=>vente.clients)
    @JoinColumn()
    vente:Vente[]

    @OneToMany(() => AdresseLivraison, (adresselivrclient) => adresselivrclient.client)
    adresselivrclients: AdresseLivraison[]

    @OneToMany(() => CommandeClient, (commandeclient) => commandeclient.client)
    commandeclients: CommandeClient[]

    @OneToMany(() => Compte, (compteclient) => compteclient.client)
    compteclients: Compte[]

    @OneToMany(() => Transaction, (clientransac) => clientransac.client)
    clientransacs: Transaction[]

    @OneToMany(() => Sortie, (client) => client.sortie)
    clients: Sortie[];

    @OneToMany(() => Operation, (operation) => operation.client)
    operations: Operation[]
    
    @Column({nullable:false})
    @IsNotEmpty({message:"L'ifu est obligatoire."})
    ifu:number
    
    @Column({nullable:true})
    rccm:string

    @Column({nullable:true})
    sigle:string

    @Column({nullable:true})
    denomination:string

    @Column({nullable:true})
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