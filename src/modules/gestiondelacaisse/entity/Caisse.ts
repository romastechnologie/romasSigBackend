import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { MonnaieCaisse } from "./MonnaieCaisse";
import { CaisseUtilisateur } from "./CaisseUtilisateur";

@Entity()
export class Caisse{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le fond de roulement ne peut pas être nul"})
    fondRoulemnt:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le sole de cloture ne peut pas être nul"})
    soldeCloture:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La date d'ouverture ne peut pas être nulle"})
    dateHeureOuv:Date

    @Column({nullable:false})
    @IsNotEmpty({message:"Le date de fermerture ne peut pas être nulle"})
    dateHeureFer:Date

    @OneToMany(() => MonnaieCaisse, (monnaiecaisse) => monnaiecaisse.caisse)
    monnaiecaisses: MonnaieCaisse[]

    @OneToMany(() => CaisseUtilisateur, (caisseuser) => caisseuser.caisse)
    caisseusers: CaisseUtilisateur[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}