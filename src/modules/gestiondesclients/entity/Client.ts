import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "./CommandeClient";
import { AdresseLivraison } from "../../gestiondessorties/entity/AdresseLivraison";
import { Compte } from "../../gestiondesportefeuille/entity/Compte";
import { Transaction } from "../../gestiondesportefeuille/entity/Transaction";

@Entity()
export class Client{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom du client est obligatoire."})
    nomClient:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le prénom est obligatoire."})
    prenomClient:string

    @Column()
    adresseClient:string

    @Column()
    emailClient:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le numéro de téléphone est obligatoire."})
    telephone1:number

    @Column({nullable:true})
    telephone2:number

    @Column({nullable:true})
    dateNais:Date

    @Column({nullable:false})
    @IsNotEmpty({message:"La raison sociale est obligatoire."})
    raisonSociale:string

    @OneToMany(() => AdresseLivraison, (adresselivrclient) => adresselivrclient.client)
    adresselivrclients: AdresseLivraison[]

    @OneToMany(() => CommandeClient, (commandeclient) => commandeclient.client)
    commandeclients: CommandeClient[]

    @OneToMany(() => Compte, (compteclient) => compteclient.client)
    compteclients: Compte[]

    @OneToMany(() => Transaction, (clientransac) => clientransac.client)
    clientransacs: Transaction[]

    @Column({nullable:false})
    @IsNotEmpty({message:"L'ifu est obligatoire."})
    ifu:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le RCCM est obligatoire."})
    rccm:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le sigle est obligatoire."})
    sigle:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La dénomination est obligatoire."})
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