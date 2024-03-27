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
    @IsNotEmpty({message:"Le nom du client ne peut pas être nul"})
    nomClient:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le prénom ne peut pas être nul"})
    prenomClient:string

    @Column()
    adresseClient:string

    @Column()
    emailClient:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le numéro de téléphone ne peut pas être nul"})
    telephone1:number

    @Column()
    telephone2:number

    @Column()
    dateNais:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La raison sociale ne peut pas être nulle"})
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
    @IsNotEmpty({message:"L'ifu ne peut pas être nul"})
    ifu:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le RCCM ne peut pas être nul"})
    rccm:string

   
    @Column({nullable:false})
    @IsNotEmpty({message:"Le sigle ne peut pas être nul"})
    sigle:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La dénomination ne peut pas être nulle"})
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