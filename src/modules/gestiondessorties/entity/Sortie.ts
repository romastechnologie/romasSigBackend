import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { SortieProCondi } from "./SortieProCndi";

@Entity()
export class Sortie{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant ne peut pas être nul"})
    montant:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le motif de sortie ne peut pas être nul"})
    motifSortie:string

    @Column()
    date:Date

    @OneToMany(() => SortieProCondi, (sortiprocondi) => sortiprocondi.sortie)
    sortiprocondis: SortieProCondi[]
   
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}