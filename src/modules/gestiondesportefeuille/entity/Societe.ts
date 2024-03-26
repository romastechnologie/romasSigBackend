import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Banque } from "./Banque";

@Entity()
export class Societe{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    nom:string

    @Column()
    sigle:string

    @Column()
    adresse:string

    @Column()
    logo:string

    @Column()
    raisonSocial:string

    @Column()
    ifu:number
    
    @Column()
    rccm:string

    @Column()
    statut:string

    @OneToMany(() => Banque, (banquesociete) => banquesociete.societe)
    banquesocietes: Banque[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}