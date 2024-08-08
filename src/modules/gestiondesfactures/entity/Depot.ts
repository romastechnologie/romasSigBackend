import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ModePaiement } from "./ModePaiement";
import { Client } from "../../gestiondesclients/entity/Client";

@Entity()
export class Depot{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"La date est obligatoire."})
    dateDepot:Date
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant est obligatoire."})
    montant:number

    @Column({nullable:true})
    beneficiaire:string

    @Column({nullable:true})
    typeDepot:string

    @ManyToOne(() => ModePaiement, (modepaiement) => modepaiement.depot) 
    modepaiement: ModePaiement

    @ManyToOne(() => Client, (client) => client.depot) 
    client: Client
    
    // @ManyToOne(()=>ModeDepot, (modepaiement)=>modepaiement.modepaiements)
    // @JoinColumn()
    // modepaiement:ModeDepot[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}