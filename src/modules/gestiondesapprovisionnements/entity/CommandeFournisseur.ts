import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Fournisseur } from "../../gestiondesfournisseurs/entity/Fournisseur";
import { CommandeFourniProCondi } from "./CommandeFourniProCondi";
import { Approvisionnement } from "./Approvisionnement";

@Entity()
export class CommandeFournisseur{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant ne peut pas être nul"})
    montant:number

    @ManyToOne(()=>Fournisseur, (fournisseur)=>fournisseur.fournisseurcommandes)
    @JoinColumn()
    fournisseur:Fournisseur[]

    @OneToMany(() => CommandeFourniProCondi, (commandefourniseurprocondi) => commandefourniseurprocondi.commandefourniseur)
    commandefourniseurprocondis: CommandeFourniProCondi[]

    @OneToMany(() => Approvisionnement, (aprovisioncommandefourni) => aprovisioncommandefourni.commandefourniseur)
    aprovisioncommandefournis: Approvisionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}