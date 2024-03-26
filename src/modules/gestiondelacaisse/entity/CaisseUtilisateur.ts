import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Caisse } from "./Caisse";
import { Monnaie } from "./Monnaie";
import { User } from "../../gestiondesutilisateurs/entity/user.entity";

@Entity()
export class CaisseUtilisateur{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    nombreMonnaie:number

    @Column()
    statut:boolean

    @ManyToOne(()=>Caisse, (caisse)=>caisse.caisseusers)
    @JoinColumn()
    caisse:Caisse[]

    @ManyToOne(()=>User, (user)=>user.caisseusers)
    @JoinColumn()
    user:User[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}