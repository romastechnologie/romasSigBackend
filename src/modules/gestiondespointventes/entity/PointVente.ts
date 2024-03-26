import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { Societe } from "../../gestiondesportefeuille/entity/Societe";
import { Personnel } from "../../gestiondupersonnel/entity/Personnel";

@Entity()
export class PointVente{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    nomPointVente:string
    
    @Column()
    adresse:string

    @ManyToOne(()=>Personnel, (personnel)=>personnel.personelpointvents)
    @JoinColumn()
    personnel:Personnel[]

    @ManyToOne(()=>Societe, (societe)=>societe.societepointvents)
    @JoinColumn()
    societe:Societe[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}