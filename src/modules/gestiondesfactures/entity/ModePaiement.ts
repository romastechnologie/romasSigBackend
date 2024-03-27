import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Paiement } from "./Paiement";

@Entity()
export class ModePaiement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé est obligatoire."})
    libelle:string

    @OneToMany(() => Paiement, (modepaiement) => modepaiement.modepaiement)
    modepaiements: Paiement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}