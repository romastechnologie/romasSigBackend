import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Personnel } from "./Personnel";
import { Fonction } from "./Fonction";

@Entity()
export class PersonnelFonction{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    nombreFonction:number

    @Column({nullable:true})
    dateDebutFonc:Date

    @Column({nullable:true})
    dateFinFonc:Date

    @Column()
    etat:string

    @ManyToOne(()=>Personnel, (personnel)=>personnel.personnelfonctions)
    @JoinColumn()
    personnel:Personnel[]

    @ManyToOne(()=>Fonction, (fonction)=>fonction.personnelfonctions)
    @JoinColumn()
    fonction:Fonction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}