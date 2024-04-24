import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { Client } from "../../gestiondesclients/entity/Client";
import { Societe } from "./Societe";
import { Transaction } from "./Transaction";

@Entity()
export class Banque{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom est obligatoire."})
    nom:string

    @Column({nullable:true})
    adresse:string

    @Column({nullable:false})
    numCompte:number

    @ManyToOne(()=>Societe, (societe)=>societe.banquesocietes)
    @JoinColumn()
    societe:Societe[]

    @OneToMany(() => Transaction, (banquetransac) => banquetransac.banque)
    banquetransacs: Transaction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}