import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { Client } from "../../gestiondesclients/entity/Client";
import { Transaction } from "./Transaction";
import { Operation } from "./Operation";

@Entity()
export class Compte{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"L'intitulé de compte est obligatoire."})
    intituleCompte:string

    @Column({nullable:false})
    solde:number

    @ManyToOne(()=>Client, (client)=>client.compteclients)
    @JoinColumn()
    client:Client[]

    @ManyToOne(()=>Fournisseur, (fournisseur)=>fournisseur.comptefournisseurs)
    @JoinColumn()
    fournisseur:Fournisseur[]

    // @OneToMany(() => Transaction, (comptetransac) => comptetransac.compte)
    // comptetransacs: Transaction[]

    @Column({nullable:false})
    typeCompte:number

    @Column()
    statut:boolean
   
    @Column()
    soldeActuel:number

    @Column()
    soldeInitial:number

    @Column()
    dateCreation:Date

    @OneToMany(() => Operation, (operation) => operation.compte)
    operations: Operation[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}