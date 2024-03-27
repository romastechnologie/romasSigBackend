import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { PersonnelFonction } from "./PersonnelFonction";
import { Magasin } from "../../gestiondesmagasins/entity/Magasin";
import { PointVente } from "../../gestiondespointventes/entity/PointVente";

@Entity()
export class Personnel{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom est obligatoire"})
    nom:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le prénom est obligatoire"})
    prenom:string

    @Column()
    sexe:string

    @Column()
    civilite:string

    @Column()
    dateNais:Date

    @Column({nullable:false})
    @IsNotEmpty({message:"Le téléphone est obligatoire"})
    tel:number

    @Column()
    email:string

    @Column()
    adresse:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom d'utilisateur est obligatoire"})
    nomUtilisateur:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le mot de passe est obligatoire"})
    motPasse:string

    @OneToMany(() => PersonnelFonction, (personnelfonction) => personnelfonction.personnel)
    personnelfonctions: PersonnelFonction[]

    @OneToMany(() => Magasin, (personnelmagasin) => personnelmagasin.personnel)
    personnelmagasins: Magasin[]

    @OneToMany(() => PointVente, (personelpointvent) => personelpointvent.personnel)
    personelpointvents: PointVente[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}