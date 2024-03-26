import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { DemandePrix } from "../../gestiondesapprovisionnements/entity/DemandePrix";
import { CommandeFournisseur } from "../../gestiondesapprovisionnements/entity/CommandeFournisseur";

@Entity()
export class Fournisseur{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    nomFournisseur:string

    @Column()
    adresseFournisseur:string

    @Column()
    telFournisseur1:number

    @OneToMany(() => DemandePrix, (fournisseurdemandpri) => fournisseurdemandpri.fournisseur)
    fournisseurdemandprix: DemandePrix[]

    @OneToMany(() => CommandeFournisseur, (fournisseurcommande) => fournisseurcommande.fournisseur)
    fournisseurcommandes: CommandeFournisseur[]

    @Column()
    telFournisseur2:number

    @Column()
    email:string

    @Column()
    ifu:number

    @Column()
    sigle:string

    @Column()
    denomination:string

    @Column()
    dateCreation:Date

    @Column()
    statut:string

    @Column()
    rccm:string

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}