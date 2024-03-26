import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { Client } from "../../gestiondesclients/entity/Client";
import { Transaction } from "./Transaction";

@Entity()
export class Compte{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    intituleCompte:string

    @Column()
    solde:number

    @ManyToOne(()=>Client, (client)=>client.commandeclients)
    @JoinColumn()
    client:Client[]

    @ManyToOne(()=>Fournisseur, (fournisseur)=>fournisseur.comptefournisseurs)
    @JoinColumn()
    fournisseur:Fournisseur[]

    @OneToMany(() => Transaction, (comptetransac) => comptetransac.compte)
    comptetransacs: Transaction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}