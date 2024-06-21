import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Compte } from "./Compte";
import { User } from "../../gestiondesutilisateurs/entity/user.entity";


@Entity()
export class TypeCompte{
    @PrimaryGeneratedColumn()
    id:number
   
    @Column({nullable:false})
    @IsNotEmpty({message:"Le code est obigatoire"})
    code:string
   
    @Column({nullable:false})
    @IsNotEmpty({message:"Le libelle est obigatoire"})
    libelle:string

    @OneToMany(() => Compte, (compte) => compte.typeCompte)
    comptes: Compte[]

    @ManyToOne(()=>User)
    userCreation:User
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}