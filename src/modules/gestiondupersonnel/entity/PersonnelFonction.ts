import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Personnel } from "./Personnel";
import { Fonction } from "./Fonction";

@Entity()
export class PersonnelFonction{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    nombreFonction:number

    @Column()
    dateDebutFonc:Date

    @Column()
    dateFinFonc:Date

    @Column()
    etat:string

    @ManyToOne(()=>Personnel, (personnel)=>personnel.fonctionpersonnels)
    @JoinColumn()
    personnel:Personnel[]

    @ManyToOne(()=>Fonction, (Fonction)=>Fonction.personnelfonctions)
    @JoinColumn()
    fonction:Fonction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}