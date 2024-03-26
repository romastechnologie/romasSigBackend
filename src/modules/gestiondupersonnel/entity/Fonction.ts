import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { PersonnelFonction } from "./PersonnelFonction";

@Entity()
export class Fonction{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    libelle:string

    @OneToMany(() => PersonnelFonction, (personnelfonction) => personnelfonction.fonction)
    personnelfonctions: PersonnelFonction[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}