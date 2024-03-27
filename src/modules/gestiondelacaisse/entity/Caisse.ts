import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { MonnaieCaisse } from "./MonnaieCaisse";
import { CaisseUtilisateur } from "./CaisseUtilisateur";

@Entity()
export class Caisse{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le fond de roulement est obligatoire."})
    fondRoulemnt:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le solde de clôture est obligatoire."})
    soldeCloture:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La date d'ouverture est obligatoire."})
    dateHeureOuv:Date

    @Column({nullable:false})
    @IsNotEmpty({message:"Le date de fermerture est obligatoire."})
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