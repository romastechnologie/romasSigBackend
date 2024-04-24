import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { CommandeFournisseur } from "./CommandeFournisseur";

@Entity()
export class CommandeFourniProCondi{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    montant:number

    @Column({nullable:true})
    qtité:number

    @ManyToOne(()=>CommandeFournisseur, (commandefourniseur)=>commandefourniseur.commandefourniseurprocondis)
    @JoinColumn()
    commandefourniseur:CommandeFournisseur[]

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.produitcondiscommandes)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}