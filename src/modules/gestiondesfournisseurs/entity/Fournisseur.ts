import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { DemandePrix } from "../../gestiondesapprovisionnements/entity/DemandePrix";
import { CommandeFournisseur } from "../../gestiondesapprovisionnements/entity/CommandeFournisseur";
import { Compte } from "../../gestiondesportefeuille/entity/Compte";

@Entity()
export class Fournisseur{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom du fournisseur ne peut pas être nul"})
    nomFournisseur:string

    @Column()
    adresseFournisseur:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le numéro de téléphone ne peut pas être nul"})
    telFournisseur1:number

    @OneToMany(() => DemandePrix, (fournisseurdemandpri) => fournisseurdemandpri.fournisseur)
    fournisseurdemandprix: DemandePrix[]

    @OneToMany(() => CommandeFournisseur, (fournisseurcommande) => fournisseurcommande.fournisseur)
    fournisseurcommandes: CommandeFournisseur[]

    @OneToMany(() => Compte, (comptefournisseur) => comptefournisseur.fournisseur)
    comptefournisseurs: Compte[]

    @Column()
    telFournisseur2:number

    @Column()
    email:string

    @Column({nullable:false})
    @IsNotEmpty({message:"L'ifu ne peut pas être nul"})
    ifu:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le sigle ne peut pas être nul"})
    sigle:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La dénomination ne peut pas être nulle"})
    denomination:string

    @Column({nullable:false})
    @IsNotEmpty({message:"La date ne peut pas être nulle"})
    dateCreation:Date

    @Column()
    statut:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le RCCM ne peut pas être nul"})
    rccm:string

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}