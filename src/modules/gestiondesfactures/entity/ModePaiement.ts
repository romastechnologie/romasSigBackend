import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Paiement } from "./Paiement";
import { Depot } from "./Depot";
import { Transaction } from "../../gestiondesportefeuille/entity/Transaction";

@Entity()
export class ModePaiement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé est obligatoire."})
    libelle:string

    @OneToMany(() => Paiement, (modepaiement) => modepaiement.modepaiement)
    modepaiements: Paiement[]

    @OneToMany(() => Depot, (depot) => depot.modepaiement) 
    depot: Depot

    @OneToMany(() => Transaction, (modepaiement) => modepaiement.modepaiement)
    modepaiementts: Transaction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}