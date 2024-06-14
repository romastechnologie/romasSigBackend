import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "./ProduitConditionnement";

@Entity()
export class Conditionnement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé est obligatoire."})
    libelle:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La quantité est obligatoire."})
    quantite:number

    @OneToMany(() => ProduitConditionnement, (produitconditionnement) => produitconditionnement.conditionnement)
    produitconditionnements: ProduitConditionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}