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
    @IsNotEmpty({message:"Le montant est obligatoire."})
    montant:number

    @Column({nullable:true})
    dateD:Date

    @ManyToOne(()=>Fournisseur, (fournisseur)=>fournisseur.fournisseurcommandes)
    @JoinColumn()
    fournisseur:Fournisseur[]

    @OneToMany(() => CommandeFourniProCondi, (commandefourniseurprocondi) => commandefourniseurprocondi.commandefourniseur)
    commandefourniseurprocondis: CommandeFourniProCondi[]

    @OneToMany(() => Approvisionnement, (aprovisioncommandefourni) => aprovisioncommandefourni.commandefournisseur)
    aprovisioncommandefournis: Approvisionnement[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}