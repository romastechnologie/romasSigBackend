import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Caisse } from "./Caisse";
import { Monnaie } from "./Monnaie";

@Entity()
export class MonnaieCaisse{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nombre de monnaie est obligatoire."})
    nombreMonnaie:number

    @Column({nullable:false})
    montant:number

    @Column({nullable:false})
    ouverture:boolean

    @ManyToOne(()=>Caisse, (caisse)=>caisse.monnaiecaisses)
    @JoinColumn()
    caisse:Caisse[]

    @ManyToOne(()=>Monnaie, (monnaie)=>monnaie.monnaiecaisses)
    @JoinColumn()
    monnaie:Monnaie[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}