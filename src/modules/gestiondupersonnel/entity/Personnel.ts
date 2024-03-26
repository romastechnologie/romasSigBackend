import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { PersonnelFonction } from "./PersonnelFonction";
import { Magasin } from "../../gestiondesmagasins/entity/Magasin";

@Entity()
export class Personnel{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    nom:string

    @Column()
    prenom:string

    @Column()
    sexe:string

    @Column()
    civilite:string

    @Column()
    dateNais:Date

    @Column()
    tel:number

    @Column()
    email:string

    @Column()
    adresse:string

    @Column()
    nomUtilisateur:string

    @Column()
    motPasse:string

    @OneToMany(() => PersonnelFonction, (personnelfonction) => personnelfonction.personnel)
    personnelfonctions: PersonnelFonction[]

    @OneToMany(() => Magasin, (personnelmagasin) => personnelmagasin.personnel)
    personnelmagasins: Magasin[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}