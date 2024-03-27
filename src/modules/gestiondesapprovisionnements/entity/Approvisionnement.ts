import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { DemandePrixProCondi } from "./DemandePrixProCondi";
import { CommandeFournisseur } from "./CommandeFournisseur";
import { AProCondi } from "./AProCondi";

@Entity()
export class Approvisionnement{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    montant:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La date est obligatoire."})
    date:Date

    @ManyToOne(()=>CommandeFournisseur, (commandefourniseur)=>commandefourniseur.aprovisioncommandefournis)
    @JoinColumn()
    commandefourniseur:CommandeFournisseur[]

    @OneToMany(() => AProCondi, (apropocondi) => apropocondi.approvision)
    apropocondis: AProCondi[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}