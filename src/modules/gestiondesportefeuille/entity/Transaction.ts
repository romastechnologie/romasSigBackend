import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Client } from "../../gestiondesclients/entity/Client";
import { Banque } from "./Banque";
import { Compte } from "./Compte";
import { TypeOperation } from "./TypeOperation";
import { ModePaiement } from "../../gestiondesfactures/entity/ModePaiement";

@Entity()
export class Transaction{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:true})
    motifTrans:string

    @Column({nullable:true})
    refTrans:string

    @Column({nullable:true})
    montTrans:string

    @ManyToOne(()=>Client, (client)=>client.clientransacs)
    @JoinColumn()
    client:Client[]

    @ManyToOne(()=>ModePaiement, (modepaiement)=>modepaiement.modepaiements)
    @JoinColumn()
    modepaiement:ModePaiement[]

    // @ManyToOne(()=>Banque, (banque)=>banque.banquetransacs)
    // @JoinColumn()
    // banque:Banque[]

    @ManyToOne(()=>TypeOperation, (typeoperation)=>typeoperation.typeopertransacs)
    @JoinColumn()
    typeoperation:TypeOperation[]

    // @ManyToOne(()=>Compte, (compte)=>compte.comptetransacs)
    // @JoinColumn()
    // compte:Compte[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}