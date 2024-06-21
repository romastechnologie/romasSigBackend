import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Compte } from "./Compte";
import { Client } from "../../gestiondesclients/entity/Client";
import { User } from "../../gestiondesutilisateurs/entity/user.entity";

@Entity()
export class Operation{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé est obligatoire"})
    libelle:string

    @Column()
    montant:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le type de l'opération est obligatoire"})
    typeOperation:string

    /** debit et credit */
    @Column({nullable:false})
    @IsNotEmpty({message:"La nature de l'opération est obligatoire"})
    nature:string

    @ManyToOne(() => Compte, (compte) => compte.operations)
    public compte: Compte

    @ManyToOne(() => Client, (client) => client.operations)
    public client: Client

    @ManyToOne(()=>User)
    userCreation:User

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}