import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { MonnaieCaisse } from "./MonnaieCaisse";
import { CaisseUtilisateur } from "./CaisseUtilisateur";

@Entity()
export class Caisse{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    fondRoulemnt:number

    @Column()
    soldeCloture:number

    @Column()
    dateHeureOuv:Date

    @Column()
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