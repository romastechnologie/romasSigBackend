import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { SortieProCondi } from "./SortieProCndi";
import { Client } from "../../gestiondesclients/entity/Client";

@Entity()
export class Sortie{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant est obligatoire."})
    montant:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le motif de sortie est obligatoire."})
    motifSortie:string

    @Column({nullable:false})
    date:Date

    @OneToMany(() => SortieProCondi, (sortiprocondi) => sortiprocondi.sortie)
    sortiprocondis: SortieProCondi[]
   
    @ManyToOne(() => Client, (sortie) => sortie.clients)
    sortie: Client;

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}